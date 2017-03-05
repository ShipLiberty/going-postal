;;;; Lookup house of rep individuals using house.gov and sunlight foundation API

(ns going-postal.lib.address-lookup.senate-gov-lookup
  (:require [going-postal.lib.address-lookup.lookup :refer [Lookup]]
            [going-postal.lib.address-lookup.lookup-util :refer :all]
            [going-postal.models.contact-record :refer :all]
            [clojure.string :as cstr]
            [clojure.data.csv :as csv]
            [clojure.java.io :as io]
            [hickory.core :as hick]
            [hickory.select :as s]))


(def senate-gov-url-all "https://www.senate.gov/general/contact_information/senators_cfm.cfm")
(def senate-gov-resource (io/resource "data/senators_cfm.cfm"))

(defn load-html-from-file []
  (with-open [r (io/reader senate-gov-resource)]
    (-> (slurp r)
       hick/parse
       hick/as-hickory)))

(defn parser-init []
  [[] {} 0])

(defn split-at-last [s delim]
  (if-let [inx (cstr/last-index-of s delim)]
    [(subs s 0 inx) (subs s (inc inx))]
    [s ""]))
(defn <->
  "Calls a function with arguments in reverse order.  If no arguments are supplied, returns a function that will call the original function with the arguments in reversed order.  This is useful for when you want to thread a value through a function using -> or ->> and the function isn't written to take the threaded argument as the first or last argument (respectively)."
  ([f]
    (fn[& args]
      (apply <-> f args)))
  ([f & args]
    (->> (reverse args)
         (apply f))))


(defn parse-name-step [rec {:keys [content]}]
  (let [link (first content)
        [_ party state] (-> content
                            second
                            (cstr/replace #"\(|\)" "")
                            (cstr/split #"-")
                            ((<-> map) cstr/trim))

                            
        href (get-a-href link)
        [last-name first-and suffix] (-> (get-content link)
                                         (cstr/split #",")
                                         ((<-> map) cstr/trim))
        [first-name middle-name] (split-at-last first-and " ")]

    (assoc rec :prefix "The Honorable"
               :firstname first-name
               :middlename middle-name
               :lastname last-name
               :suffix (or suffix "")
               :region state
               :party party
               :bioguide-id ""
               :image-url ""
               :home-page href)))

(defn parse-address-step [rec {:keys [content]}]
  (let [s (first content)
        [s zip] (split-at-last s " ")
        [s state] (split-at-last s " ")
        [address city] (split-at-last s " ")]
    (assoc rec :address address
               :city city
               :state state
               :zip zip)))


(defn push-record-and-reset [v rec step]
  (let [done (-> (assoc rec :rectype :senator)
                 map->ContactRecord)]
    [(conj v done) {} 0]))

(defn parse-one-step [[v rec step] row]
  (if (= :img (get-in row [:content 0 :tag]))
    (push-record-and-reset v rec step)
    (condp = step
      0 [v (parse-name-step rec row) 1]
      1 [v rec 2] ; Skip "Class _"
      2 [v (parse-address-step rec row) 3]
      3 [v rec step]))) ; No op/terminal state

(defn parse-senate-gov-page [page]
  (let [[table] (s/select (s/follow-adjacent
                            (s/tag :form)
                            (s/tag :img)
                            (s/tag :table))
                          page)
        rows (s/select (s/and
                         (s/descendant
                           (s/tag :tr)
                           (s/el-not
                             (s/descendant
                               (s/tag :tr)
                               (s/tag :img))))
                         (s/tag :td))
                       table)]
    
    (-> (reduce parse-one-step (parser-init) rows)
        first)))

(defn get-two-letter-state [state]
  (let [state-map {"alabama" "AL",
                   "alaska" "AK",
                   "arizona" "AZ",
                   "arkansas" "AR",
                   "california" "CA",
                   "colorado" "CO",
                   "connecticut" "CT",
                   "delaware" "DE",
                   "florida" "FL",
                   "georgia" "GA",
                   "hawaii" "HI",
                   "idaho" "ID",
                   "illinois" "IL",
                   "indiana" "IN",
                   "iowa" "IA",
                   "kansas" "KS",
                   "kentucky" "KY",
                   "louisiana" "LA",
                   "maine" "ME",
                   "maryland" "MD",
                   "massachusetts" "MA",
                   "michigan" "MI",
                   "minnesota" "MN",
                   "mississippi" "MS",
                   "missouri" "MO",
                   "montana" "MT",
                   "nebraska" "NE",
                   "nevada" "NV",
                   "new hampshire" "NH",
                   "new jersey" "NJ",
                   "new mexico" "NM",
                   "new york" "NY",
                   "north carolina" "NC",
                   "north dakota" "ND",
                   "ohio" "OH",
                   "oklahoma" "OK",
                   "oregon" "OR",
                   "pennsylvania" "PA",
                   "rhode island" "RI",
                   "south carolina" "SC",
                   "south dakota" "SD",
                   "tennessee" "TN",
                   "texas" "TX",
                   "utah" "UT",
                   "vermont" "VT",
                   "virginia" "VA",
                   "washington" "WA",
                   "west virginia" "WV",
                   "wisconsin" "WI",
                   "wyoming" "WY",
                   "american samoa" "AS",
                   "district of columbia" "DC",
                   "federated states of micronesia" "FM",
                   "guam" "GU",
                   "marshall islands" "MH",
                   "northern mariana islands" "MP",
                   "palau" "PW",
                   "puerto rico" "PR",
                   "virgin islands" "VI",
                   "armed forces africa" "AE",
                   "armed forces americas" "AA",
                   "armed forces canada" "AE",
                   "armed forces europe" "AE",
                   "armed forces middle east" "AE",
                   "armed forces pacific" "AP"}]
    (println state)
    (->> (cstr/lower-case state)
         (get state-map))))

(defn lookup-by-state [two-letter-state]
  (binding [clj-http.core/*cookie-store* (clj-http.cookies/cookie-store)]
    (try
      (let [senate-gov-page (load-html-from-file) ;(fetch-html senate-gov-url-all)
            records (parse-senate-gov-page senate-gov-page)]
        (filter (comp #{two-letter-state} :region) records))
      (catch clojure.lang.ExceptionInfo e
        (let [{status :status} (ex-data e)]
          (if-not (= 404 status)
            (throw e)))))))

(defn make-senate-gov-lookup []
  (reify Lookup
    (lookup [_ street city state zip]
      (let [two-letter-state state];(get-two-letter-state state)]
        (println "looking up for" two-letter-state)
        (lookup-by-state two-letter-state)))))

