package main

import (
	"RealTimeCollabarationAPp/router"
	"fmt"
	"net/http"
)

func main() {
	fmt.Println("Hy")
	r := router.Router()
	http.ListenAndServe(":4000", r)

	fmt.Println("Completed")
}
