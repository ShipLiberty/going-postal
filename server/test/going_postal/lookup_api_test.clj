;;;; Integration test for lookup api using clj-http-trace to mock http requests/responses

(ns going-postal.lookup-api-test
  (:require [clojure.test :refer :all]
            [ring.mock.request :as mock]
            [clj-http-trace.core :refer :all]
            [going-postal.lib.address-lookup.lookup-util :refer [->ContactRecord]]
            [going-postal.handler :refer [app]]))


(deftest lookup-api-test
  (testing "Test lookup api and response."
    (install-trace-intercept! "trace/housegov_miami.trace")
    (let [request (mock/request :get "/lookup" {:address "9700 Sw 67th ave" :city "Miami" :state "Florida" :zip "33156"})
          response (app request)
          expected "[{\"rectype\":\"representative\",\"prefix\":\"The Honorable\",\"firstname\":\"Ileana\",\"middlename\":\"\",\"lastname\":\"Ros-Lehtinen\",\"suffix\":\"\",\"address\":\"2206 Rayburn House Office Building\",\"city\":\"Washington\",\"state\":\"DC\",\"zip+4\":\"20515-0927\",\"region\":\"FL27\",\"bioguide-id\":\"R000435\",\"party\":\"R\",\"image-url\":\"ziplook.house.gov/zip/pictures/fl27_ros-lehtinen.jpg\",\"home-page\":\"http://ros-lehtinen.house.gov/\"}]"]
      (is (= (:status response) 200))
      (is (= expected (:body response)))))
  
  (testing "Test nothing found for address."
    (install-trace-intercept! "trace/housegov_safeway.trace")
    (let [request (mock/request :get "/lookup" {:address "5280 diamond heights blvd" :city "San Francisco" :state "California" :zip "94131"})
          response (app request)
          expected "Nothing found for this address"]
      (is (= (:status response) 404))
      (is (= expected (:body response))))))
