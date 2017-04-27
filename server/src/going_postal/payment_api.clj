(ns going-postal.payment-api
  (:require [clj-stripe.common :as common]
            [clj-stripe.charges :as charges]))

(def api-key (. System (getenv "STRIPE_API_KEY")))

(def currency "usd")

(defn create-charge [token amt desc]
  (common/with-token api-key
    (let [{:keys [error] :as resp} (common/execute (charges/create-charge
                                                     (common/money-quantity amt currency)
                                                     (common/source token)
                                                     (common/description charge-desc)))]
      (if-let [{:keys [charge]} error]
        (merge (common/execute (charges/get-charge charge)) resp)
        resp))))
