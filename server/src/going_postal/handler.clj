(ns going-postal.handler
  (:require [compojure.core :refer [defroutes routes]]
            [ring.middleware.resource :refer [wrap-resource]]
            [ring.middleware.file-info :refer [wrap-file-info]]
            [hiccup.middleware :refer [wrap-base-url]]
            [compojure.handler :as handler]
            [compojure.route :as route]
            [ring.middleware.cors :refer [wrap-cors]]
            [going-postal.routes.home :refer [home-routes]]))

(defn init []
  (println "going-postal is starting"))

(defn destroy []
  (println "going-postal is shutting down"))

(defroutes app-routes
  (route/resources "/")
  (route/not-found "Not Found"))

(defn mywrap-request-logging [handler]
  (fn [{:keys [request-method uri] :as req}]
    (try
      (let [
            ;;body (when (:body req)
            ;           (slurp (:body req))
            ;          (.reset (:body req)))
            _ (println (format "Processing %s %s" (.toUpperCase (name request-method)) uri))
            _ (println (format "\t Params: %s" req))

            resp (if (:body req) (handler req) (handler req))]
        (println (format "Response %s" resp))
        resp)
      (catch Exception e
        (println e)
        (throw e)))))

(def app
  (-> (routes home-routes app-routes)
      (mywrap-request-logging)
      (wrap-cors :access-control-allow-origin [#"http://localhost:3000" #"http://localhost:3001"]
                 :access-control-allow-methods [:get :post])
      (handler/site)
      (wrap-base-url)))
