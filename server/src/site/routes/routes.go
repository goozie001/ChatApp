package routes

import (
	"github.com/gorilla/mux"
	"net/http"
)

func Setup(router *mux.Router) {

	router.Handle("/public", http.FileServer(http.Dir("/public")))

}
