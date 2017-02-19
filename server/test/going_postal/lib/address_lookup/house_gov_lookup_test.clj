;;;; Integration test for house-gov-lookup using clj-http-trace to mock http requests/responses
(ns going-postal.lib.address-lookup.house-gov-lookup-test
  (:require [clojure.test :refer :all]
            [clj-http-trace.core :refer :all]
            [going-postal.models.contact-record :refer [->ContactRecord]]
            [going-postal.lib.address-lookup.lookup :refer [lookup]]
            [going-postal.lib.address-lookup.house-gov-lookup :refer :all]))

(deftest simple-zip-lookup-test
  (testing "Test parsing and simple get."
    (install-trace-intercept! "trace/housegov_miami.trace")
    (let [undertest (make-house-gov-lookup)
          expected (->ContactRecord :representative "The Honorable" "Ileana" "" "Ros-Lehtinen" "" "2206 Rayburn House Office Building" "Washington" "DC" "20515-0927" "FL27" "R000435" "R" "ziplook.house.gov/zip/pictures/fl27_ros-lehtinen.jpg" "http://ros-lehtinen.house.gov/")]
      (is (= expected (lookup undertest "9700 sw 67th ave" "miami" "florida" 33156))))))

(deftest invalid-address-lookup-test
  (testing "Test parsing and lookup with invalid (unknown) address"
    (install-trace-intercept! "trace/housegov_safeway.trace")
    (let [undertest (make-house-gov-lookup)
          expected nil]
      (is (= expected (lookup undertest "5280 diamond heights blvd" "san francisco" "california" 94131))))))                                                                   

(deftest full-address-lookup-test
  (testing "Test parsing and lookup with full address (2 possibilities for zip code)."
    (install-trace-intercept! "trace/housegov_safeway.trace")
    (let [undertest (make-house-gov-lookup)
          expected (->ContactRecord :representative "The Honorable" "Nancy" "" "Pelosi" "" "233 Cannon House Office Building" "Washington" "DC" "20515-0512" "CA12" "P000197" "D" "ziplook.house.gov/zip/pictures/ca12_pelosi.jpg" "http://pelosi.house.gov/")] 
      (is (= expected (lookup undertest "5290 diamond heights blvd" "san francisco" "california" 94131))))))
