(ns going-postal.lib.address-lookup.house-gov-lookup-test
  (:require [clojure.test :refer :all]
            [clj-http-trace.core :refer :all]
            [going-postal.lib.address-lookup.lookup :refer [lookup]]
            [going-postal.lib.address-lookup.house-gov-lookup :refer :all]))

(deftest simple-zip-lookup-test
  (testing "Test parsing and simple get."
    (install-trace-intercept! "trace/housegov_miami.trace")
    (let [undertest (make-house-gov-lookup)
          expected {:name "Ileana Ros-Lehtinen", :image-url "ziplook.house.gov/zip/pictures/fl27_ros-lehtinen.jpg", :district "fl27", :home-page "http://ros-lehtinen.house.gov/", :contact {:party "R", :suffix "", :zip4 "20515-0927", :address "2206 Rayburn House Office Building", :lastname "Ros-Lehtinen", :115stdis "FL27", :city "Washington", :state "DC", :middlename "", :prefix "The Honorable", :bioguideid "R000435", :firstname "Ileana"}}]
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
          expected {:name "Nancy Pelosi", :image-url "ziplook.house.gov/zip/pictures/ca12_pelosi.jpg", :district "ca12", :home-page "http://pelosi.house.gov/", :contact {:party "D", :suffix "", :zip4 "20515-0512", :address "233 Cannon House Office Building", :lastname "Pelosi", :115stdis "CA12", :city "Washington", :state "DC", :middlename "", :prefix "The Honorable", :bioguideid "P000197", :firstname "Nancy"}}]
      (is (= expected (lookup undertest "5290 diamond heights blvd" "san francisco" "california" 94131))))))
