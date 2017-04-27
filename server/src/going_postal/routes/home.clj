(ns going-postal.routes.home
  (:require [compojure.core :refer :all]
            [ring.middleware.json :as j] 
            [going-postal.lookup-api :as lo]
            [going-postal.letter-workflow :as lw]))


(def handle-post-letter-json (j/wrap-json-body lw/handle-post-letter-workflow {:keywords? true :bigdecimals? true}))

(defroutes home-routes
  (context "/v1" []
    (GET "/lookup" req (lo/handle-lookup req))
    (POST "/letters" req (handle-post-letter-json req))))
