package main

import (
	"fmt"
	"log"
	"net/http"
)

func main() {
	http.HandleFunc("/api", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintf(w, "TODO implement API")
	})

	log.Fatal(http.ListenAndServe(":8000", nil))

}
