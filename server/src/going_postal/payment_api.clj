(ns going-postal.payment-api
  (:require [clj-stripe.common :as common]
            [clj-stripe.charges :as charges]))

(def api-key (. System (getenv "STRIPE_SECRET_KEY")))

(def currency "usd")

(defn create-charge [token amt desc]
  (println "In create-charge: " token ", " amt ", " desc)
  (common/with-token api-key
    (let [{:keys [error] :as resp} (common/execute (charges/create-charge
                                                     (common/money-quantity amt currency)
                                                     (common/source token)
                                                     (common/description desc)))]
      (if-not error 
        resp
        ;; Error conditions...
        (if-let [charge (:charge error)]
          ;; If there's a charge, merge the charge into the error and return the response
          (merge (common/execute (charges/get-charge (:charge error))) resp) 
          ;; Otherwise, it's a server error.  Abort the whole thing
          (throw (ex-info "" error)))
        ))))
