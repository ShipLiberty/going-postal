(ns going-postal.letter-workflow
  (:require [going-postal.letter-api :as le]
            [going-postal.payment-api :as pa]
            [cheshire.core :as json]))

(defn json-response [data & [status]]
  (when data
    {:status (or status 200)
     :headers {"Content-Type" "application/json"}
     :body (json/generate-string data)}))

(def cost-per-letter-usd-cents 200)
(def charge-desc "ShipLiberty letter")

(defn workflow-end-middleware []
  (fn [{:keys [response-data] :as req}]
    (println "In workflow-end-middleware")
    (json-response response-data)))

(defn charge-payment-middleware [nxt] 
  (fn [{{:keys [stripeToken]} :body :as req}]
    (println "In charge-payment-middleware")
    (let [{:keys [error] :as resp} (pa/create-charge stripeToken cost-per-letter-usd-cents charge-desc)]
      (if error
        (json-response error 402)
        (nxt req)
        ))))

(defn post-letter-middleware [nxt]
  (fn [req]
    (println "in post-letter-middleware")
    (let [{:keys [error] :as resp} (le/handle-post-letter req)]
      (if error
        (json-response error 400)
        (-> (update req :response-data merge resp)
            nxt)
        ))))

(defn workflow-start-middleware [nxt]
  (fn [req]
    (-> (assoc req :response-data {})
        nxt)))

(def handle-post-letter-workflow
  (-> (workflow-end-middleware)
      post-letter-middleware
      charge-payment-middleware
      workflow-start-middleware))

