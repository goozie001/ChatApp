package main

import (
	"github.com/gorilla/mux"
	"net/http"
	"site/routes"
	"time"
)

func main() {
	// TODO: Setup database connection

	// TODO: Setup middleware

	router := mux.NewRouter()
	routes.Setup(router)

	server := &http.Server{
		Addr:           ":3000",
		Handler:        router,
		ReadTimeout:    10 * time.Second,
		WriteTimeout:   10 * time.Second,
		MaxHeaderBytes: http.DefaultMaxHeaderBytes,
		TLSConfig:      nil,
		TLSNextProto:   nil,
		ConnState:      nil,
		ErrorLog:       nil,
	}

	server.ListenAndServe()
}
