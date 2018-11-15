;;;; Lookup house of rep individuals using house.gov and sunlight foundation API

(ns going-postal.lib.address-lookup.house-gov-lookup
  (:require [going-postal.lib.address-lookup.lookup :refer [Lookup]]
            [going-postal.lib.address-lookup.lookup-util :refer :all]
            [going-postal.models.contact-record :refer :all]
            [clojure.string :as cstr]
            [clojure.data.csv :as csv]
            [clojure.java.io :as io]
            [hickory.select :as s])
  (:import [org.jsoup Jsoup])) ;; Import available through hickory dependency

(def house-gov-url-start "http://www.house.gov/representatives/find/")
(def image-base-url "ziplook.house.gov")

(defn load-and-parse-contact-records []
  (with-open [in-file (-> "data/text-labels-115.tsv"
                          io/resource
                          io/reader)]
    (let [recs (doall (csv/read-csv in-file :separator \tab))
          header (->> recs
                      first
                      (map cstr/lower-case)
                      (map #(cstr/replace % #"[^\w]" "")) ; Strip out non-word characters
                      (map keyword))
          data (rest recs)]
      (->> (map interleave (repeat header) data)
           (map (partial apply hash-map))))))

(def contact-records (delay (load-and-parse-contact-records)))

(defn lookup-contact [district]
  (-> (filter (comp #{district} cstr/lower-case :115stdis) @contact-records)
      first))

(defn do-extract-form-params [frm]
  (let [frm-attrs (:attrs frm)
        ret-attrs [:action :method]]
    (-> (partial get frm-attrs)
        (map ret-attrs))))

(defn extract-by-zip-url [page]
  ;; NOTE: this maps to the page layout, and may need to be changed if the page changes..
  (let [frm (-> (s/select (s/child
                            (s/id "findrep"))
                          page)
                first)]
    (conj (vec (do-extract-form-params frm)) page)))


(defn fetch-by-zip [zip [by-zip-url method]]
  (let [url-fmt (str by-zip-url "?ZIP=%s&Submit=%s")]
    (fetch-html url-fmt zip "FIND+YOUR+REP+BY+ZIP")))

(defn extract-by-address-url [page]
  (let [frm (-> (s/select (s/child
                            (s/id "AddressFromForm")
                            (s/tag :form))
                          page)
                first)]
    (conj (vec (do-extract-form-params frm)) page)))


(defn format-state [state page]
  (let [state-lwr (cstr/lower-case state)
        state-map (->> (s/select (s/child
                                   (s/id "state")
                                   (s/tag :option))
                                 page)
                       (map (juxt get-content-lower-case get-option-value))
                       (into {}))]
    (get state-map state-lwr)))

  
(defn fetch-by-address [street city state zip [by-address-url method page]]
  (let [formatted-state (format-state state page)]
    (post-and-parse-html by-address-url {:street street :city city :state formatted-state :Submit "FIND YOUR REP BY ADDRESS" :ZIP zip})))

(defn get-district-from-image-url [img-url]
  (when-let [start-inx (cstr/last-index-of img-url "/")]
    (when-let [end-inx (cstr/last-index-of img-url "_")]
      (subs img-url (inc start-inx) end-inx))))

(defn extract-rep-info [page]
  (let [rep (-> (s/select (s/child
                            (s/id "RepInfo")
                            (s/class "rep"))
                          page)
                first)
        img-url (->> (s/select (s/child
                                 (s/tag :img))
                               rep)
                     first
                     :attrs
                     :src
                     (str image-base-url))
        a-tag   (-> (s/select (s/child
                                (s/tag :a))
                              rep)
                    first)]
    (when (and a-tag img-url)
      (let [href    (get-a-href a-tag)
            rep-name (get-content a-tag)
            district (get-district-from-image-url img-url)]
        {:name rep-name :image-url img-url :district district :home-page href}))))


(defn select-values [map ks]
  (reduce #(conj %1 (map %2)) [] ks))

(defn make-contact-record [{district :district :as rep-info}]
  (when district
    (let [contact (lookup-contact district)
          values (-> contact
                     (select-values [:prefix :firstname :middlename :lastname :suffix :address :city :state :zip4 :115stdis :bioguideid :party])
                     (concat (map (partial get rep-info) [:image-url :home-page])))]
      (println contact)
      (println values)

      (apply ->ContactRecord :representative values))))

(defn lookup-address [street city state zip]
  (binding [clj-http.core/*cookie-store* (clj-http.cookies/cookie-store)]
    (try
      (let [by-zip-page (->> (fetch-html house-gov-url-start)
                             extract-by-zip-url
                             (fetch-by-zip zip))]
        ;; Try to extract a rep from the zip page...if there are multiple, we need to do a bit more
        (if-let [rec (extract-rep-info by-zip-page)]
          (->> rec          ; Exact match on zip code
               make-contact-record)
          (->> by-zip-page  ; Multiple possibilities, use full address
               extract-by-address-url
               (fetch-by-address street city state zip)
               extract-rep-info
               make-contact-record)))
      (catch clojure.lang.ExceptionInfo e
        (let [{status :status} (ex-data e)]
          (if-not (= 404 status)
            (throw e)))))))


(defn make-house-gov-lookup []
  (reify Lookup
    (lookup [_ street city state zip]
      (lookup-address street city state zip))))


