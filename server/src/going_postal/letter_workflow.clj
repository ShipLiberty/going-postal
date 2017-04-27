(ns going-postal.letter-workflow
  (:require [going-postal.letter-api :as le]
            [going-postal.payment-api :as pa]
            )
  )

(defn json-response [data & [status]]
  (when data
    {:status (or status 200)
     :headers {"Content-Type" "application/json"}
     :body (json/generate-string data)}))

(def cost-per-letter-usd-cents 150)
(def charge-desc "ShipLiberty letter")

(defn workflow-end-middleware []
  (fn [{:keys response-data} req] (json-response response-data)))

(defn charge-payment-middleware [nxt] 
  (fn [{{:keys [stripeToken]} :params} req]
    (let [resp (pa/create-charge stripeToken cost-per-letter-usd-cents charge-desc)]
      (if-let [{:keys [error]} resp]
        (json-response error 402)
        (nxt req)
        ))))

(defn post-letter-middleware [nxt]
  (fn [{{:keys [from to message]} :params} req])
    (le/handle-post-letter)
  )

(defn workflow-start-middleware [nxt]
  (fn [req] (assoc req :response-data {})))

(def handle-post-letter-workflow
  (-> workflow-end-middleware
      post-letter-middleware
      charge-payment-middleware
      workflow-start-middleware))

