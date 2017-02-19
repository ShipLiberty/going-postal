;;;; Integration test for senate-gov-lookup using clj-http-trace to mock http requests/responses
(ns going-postal.lib.address-lookup.senate-gov-lookup-test
  (:require [clojure.test :refer :all]
            [clj-http-trace.core :refer :all]
            [going-postal.models.contact-record :refer [->ContactRecord]]
            [going-postal.lib.address-lookup.lookup :refer [lookup]]
            [going-postal.lib.address-lookup.senate-gov-lookup :refer :all]))

(deftest simple-lookup-test
  (testing "Test parsing and simple get.  Should return 2 records for each of 50 states."
    (install-trace-intercept! "trace/senategov_all.trace")
    (let [undertest (make-senate-gov-lookup)
          expected1 (->ContactRecord :senator "The Honorable" "Robert" "P." "Casey" "Jr." "393 Russell Senate Office Building" "Washington" "DC" "20510" "PA" "" "D" "" "http://www.casey.senate.gov/")
          expected2 (->ContactRecord :senator "The Honorable" "Patrick" "J." "Toomey" "" "248 Russell Senate Office Building" "Washington" "DC" "20510" "PA" "" "R" "" "http://www.toomey.senate.gov/")
          [sen1 sen2] (lookup undertest "1237 E Passyunk Ave" "Philadelphia" "pennsylvania" 19147)]
      (is (= expected1 sen1))
      (is (= expected2 sen2)))))


(deftest invalid-state-lookup-test
  (testing "Test parsing and lookup with invalid (unknown) state"
    (install-trace-intercept! "trace/senategov_all.trace")
    (let [undertest (make-senate-gov-lookup)]
      (is (empty? (lookup undertest "1237 E Passyunk Ave" "Philadelphia" "PB" 19147))))))
