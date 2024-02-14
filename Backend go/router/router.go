package router

import (
	"RealTimeCollabarationAPp/controller"
	"github.com/gorilla/mux"
)

func Router() *mux.Router {

	router := mux.NewRouter()
	controller.SqlConnection()
	router.HandleFunc("/registartion", controller.PostRegistartionContorller).Methods("POST")
	router.HandleFunc("/getAll", controller.GetAllRegisteredUsersController).Methods("GET")
	router.HandleFunc("/loggedIn", controller.CheckLogInDetails).Methods("POST")
	router.HandleFunc("/uploadFile", controller.UploadFiles).Methods("POST")
	router.HandleFunc("/getAllFilesForId/{username}", controller.GetAllFilesForUserInDB).Methods("GET")
	router.HandleFunc("/deleteFileForId/{username}/{filename}/{admin}", controller.DeleteFile).Methods("DELETE")
	router.HandleFunc("/accessforIds", controller.AddFilesToSelectedUsers).Methods("POST")

	return router
}
