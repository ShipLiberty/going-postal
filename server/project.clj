(defproject going-postal "0.1.0-SNAPSHOT"
  :description "FIXME: write description"
  :url "http://example.com/FIXME"
  :dependencies [[org.clojure/clojure "1.8.0"]
                 [org.clojure/data.csv "0.1.3"]
                 [compojure "1.1.6"]
                 [hiccup "1.0.5"]
                 [hickory "0.6.0"]
                 [clj-http "2.0.0"]
                 [clj-datastore "0.3.0-SNAPSHOT"]
                 [ring-server "0.3.1"]]
  :plugins [[lein-ring "0.8.12"]
            ]
  :ring {:handler going-postal.handler/app
         :init going-postal.handler/init
         :destroy going-postal.handler/destroy}
  :profiles
  {:uberjar {:aot :all}
   :production
   {:ring
    {:open-browser? false, :stacktraces? false, :auto-reload? false}}
   :dev
   {:dependencies [[ring-mock "0.1.5"] [ring/ring-devel "1.3.1"] [clj-http-trace "0.1.0-SNAPSHOT"]]
    :resource-paths ["test/resources"]}})
