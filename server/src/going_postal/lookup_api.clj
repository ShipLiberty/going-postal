(ns going-postal.lookup-api
  (:require [going-postal.lib.address-lookup.lookup :refer [lookup]]
            [going-postal.lib.address-lookup.house-gov-lookup :refer [make-house-gov-lookup]]
            [going-postal.lib.address-lookup.senate-gov-lookup :refer [make-senate-gov-lookup]]
            [cheshire.core :as json]))

(defn json-response [data & [status]]
  (when data
    {:status (or status 200)
     :headers {"Content-Type" "application/json"}
     :body (json/generate-string data)}))

(def lookup-handlers (atom []))

(defn register-lookup-handler! [handler]
  (swap! lookup-handlers conj handler))

(register-lookup-handler! (make-house-gov-lookup))
(register-lookup-handler! (make-senate-gov-lookup))

(defn lift-to-vector [x]
  (if-not (seq? x)
    (vector x)
    x))

(defn handle-lookup [{{:keys [address city state zip]} :params :as request}]
  (println "REQ" address city state zip)
  (let [found (->> (map #(lookup % address city state zip) @lookup-handlers)
                   (map lift-to-vector)
                   (reduce concat []))]
    (if (empty? found)
      {:status 404 :body "Nothing found for this address"}
      (json-response found))))



