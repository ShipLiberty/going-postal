(ns going-postal.models.contact-record)

;;; Data methods, to generate consistant structures
(def RecTypes [:representative :senator])
(defrecord ContactRecord [rectype prefix firstname middlename lastname suffix address city state zip region bioguide-id party image-url home-page])
