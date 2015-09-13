package models

import (
	"database/sql"
	_ "github.com/lib/pq"
	"log"
)

func OpenConn() *sql.DB {
	log.Println("Attempting to connect to DB")
	db, err1 := sql.Open("postgres", "user=def dbname=chatapp sslmode=verify-full")
	if err1 != nil {
		log.Fatal(err1)
	}

	log.Println("Did/did not connect")
	_, err2 := db.Query("INSERT INTO member VALUES ('goozie', 'goozies', '11111111', 'Dylan', 'Richardson')")

	log.Println("Query executed")
	if err2 != nil {
		log.Fatal(err2)
	}

	return db
}
