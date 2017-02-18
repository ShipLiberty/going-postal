(ns going-postal.routes.home
  (:require [compojure.core :refer :all]
            [going-postal.lookup-api :as lapi]))

(defroutes home-routes
  (GET "/lookup" req (lapi/handle-lookup req)))
