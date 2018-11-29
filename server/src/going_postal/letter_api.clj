(ns going-postal.letter-api
  (:require [clojure.java.io :as io] 
            [cheshire.core :as json]
            [lob-clj.core :refer [make-client]]
            [lob-clj.letters :as l]
            [lob-clj.models :refer [->Address]]))

;

;; This record matches the fields in the html template (i.e. defines the API for templates)
(defrecord Content [date salutation text signature])

(def honorific {"senator" "Senator", "representative" "Rep."})

(def client (delay (make-client (. System (getenv "LOB_API_KEY")))))

(defn make-address-from-from-args [from]
  (let [name (:name from) 
        line1 (:address from)
        line2 (:address2 from)
        city (:city from)
        state (:state from)
        zip (:zip from)]
    (->Address nil name line1 line2 city state zip "US")))

(defn make-address-from-contact-record [cr]
  (let [name (->> [:prefix :firstname :middlename :lastname :suffix]
                  (map #(cr %))
                  (clojure.string/join " "))
        line1 (:address cr)
        city (:city cr)
        state (:state cr)
        zip (:zip cr)]
    ;; TODO validate non-null fields
    (->Address nil name line1 nil city state zip "US")))
(defn json-response [data & [status]]
  (when data
    {:status (or status 200)
     :headers {"Content-Type" "application/json"}
     :body (json/generate-string data)}))

(defn template []
  (let [turl (io/resource "letter_template.html")]
    (slurp turl)))

(defn handle-post-letter [{{:keys [from letters]} :body}]
  (let [today (. (java.text.SimpleDateFormat. "MMMM d, YYYY")
                 format (java.util.Date.))
        signature (:name from)]
    (for [{message :message to :representative} letters]
      (let [salutation (str
                         (-> to
                             :rectype
                             honorific)
                         " "
                         (:lastname to))
            content (->Content today salutation message signature)]
        (println "sending: " (make-address-from-from-args from) (make-address-from-contact-record to) (template) content)
        (l/send-letter @client
                       (make-address-from-from-args from)
                       (make-address-from-contact-record to)
                       (template)
                       content)))))
