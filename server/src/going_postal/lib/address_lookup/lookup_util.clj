(ns going-postal.lib.address-lookup.lookup-util
  (:require [hickory.core :as hick]
            [clojure.string :as cstr]
            [clj-http.client :as http]))

;;; Http get/post wrappers that parse and return Hickory nodes

;; Note: this does not properly handle different encodings (for that, we need to use JSoup/parse directly), buuut this should be OK for house/senate.gov I think.
(defn fetch-html
  ([url]
   (println "Fetching from" url)
   (-> (http/get url)
       :body
       hick/parse
       hick/as-hickory))
  ([url-fmt & args]
   (let [url (apply format url-fmt args)]
     (fetch-html url))))

(defn post-and-parse-html
  ([url params]
   (println "Posting to " url "," params)
   (-> (http/post url {:form-params params})
       :body
       hick/parse
       hick/as-hickory)))

;;; Hickory helper accessor functions

(defn get-attr-value-fn [attr node]
  (get-in node [:attrs attr]))

(def get-option-value (partial get-attr-value-fn :value))

(def get-a-href (partial get-attr-value-fn :href))

(defn get-content [node]
  (-> node
      :content
      first
      cstr/trim))

(def get-content-lower-case (comp cstr/lower-case get-content))
