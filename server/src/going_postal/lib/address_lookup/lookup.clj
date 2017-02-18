(ns going-postal.lib.address-lookup.lookup)

(defprotocol Lookup
  (lookup [_ street city state zip]))

