(defproject org.shipliberty/going-postal "0.1.0-SNAPSHOT"
  :description "FIXME: write description"
  :url "http://example.com/FIXME"
  :min-lein-version "2.0.0"
  :dependencies [[org.clojure/clojure "1.8.0"]
                 [org.clojure/data.csv "0.1.3"]
                 [cheshire "5.7.0"]
                 [compojure "1.1.6"]
                 [hiccup "1.0.5"]
                 [hickory "0.6.0"]
                 [clj-http "2.0.0"]
                 [clj-datastore "0.3.0-SNAPSHOT"]
                 [ring-server "0.3.1"]
                 [ring-cors "0.1.9"]
                 [ring/ring-json "0.4.0"]
                 [org.shipliberty/clj-stripe "1.0.5-SNAPSHOT"]
                 [org.shipliberty/lob-clj "0.1.1-SNAPSHOT"]]
  :plugins [[lein-ring "0.8.12"]
            ]
  :ring {:handler going-postal.handler/app
         :init going-postal.handler/init
         :destroy going-postal.handler/destroy}
  :profiles
  {:uberjar {:aot :all}
   :production
   {:ring
    {:open-browser? false, :stacktraces? false, :auto-reload? false }}
   :dev
   {:dependencies [[ring-mock "0.1.5"] [ring/ring-devel "1.3.1"] [clj-http-trace "0.1.0-SNAPSHOT"]]
    :resource-paths ["test/resources"]}})
