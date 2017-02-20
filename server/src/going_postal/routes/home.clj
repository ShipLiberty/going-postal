(ns going-postal.routes.home
  (:require [compojure.core :refer :all]
            [ring.middleware.json :as j] 
            [going-postal.lookup-api :as lo]
            [going-postal.letter-api :as le]))


(def handle-post-letter-json (j/wrap-json-body le/handle-post-letter {:keywords? true :bigdecimals? true}))

(defroutes home-routes
  (context "/v1" []
    (GET "/lookup" req (lo/handle-lookup req))
    (POST "/letters" req (handle-post-letter-json req))))
