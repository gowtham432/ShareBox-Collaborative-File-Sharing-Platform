package controller

import (
	"RealTimeCollabarationAPp/model"
	"database/sql"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"strconv"

	"github.com/go-sql-driver/mysql"
	"github.com/gorilla/mux"
)

var db *sql.DB

func SqlConnection() {
	cfg := mysql.Config{
		User:   "root",
		Passwd: "Sai@1243",
		Net:    "tcp",
		Addr:   "127.0.0.1:3306",
		DBName: "Users",
	}

	var err error
	db, err = sql.Open("mysql", cfg.FormatDSN())
	if err != nil {
		log.Fatal(err)
	}

	pingErr := db.Ping()
	if pingErr != nil {
		log.Fatal(pingErr)
	}

	fmt.Println("Connected")

}

func UploadFiles(w http.ResponseWriter, r *http.Request) {
	uploadFile(w, r)
}

func GetAllRegisteredUsersController(w http.ResponseWriter, r *http.Request) {
	var registeredUsers []model.Registration = getAllUsersFromDB(w)
	// Return the users as JSON response
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")

	json.NewEncoder(w).Encode(registeredUsers)

}

func CheckLogInDetails(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")

	var loggedInUser model.Login

	err := json.NewDecoder(r.Body).Decode(&loggedInUser)

	if err != nil {
		log.Fatal(err)
	}

	isUserExsist, username := isLoggedIn(w, &loggedInUser)

	if !isUserExsist {
		json.NewEncoder(w).Encode("Invalid login credentials")
	} else {
		json.NewEncoder(w).Encode(username)
	}

}

func PostRegistartionContorller(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")

	var registeredUsers []model.Registration = getAllUsersFromDB(w)

	var registeredUser model.Registration

	err := json.NewDecoder(r.Body).Decode(&registeredUser)

	if err != nil {
		log.Fatal(err)
	}

	var flag bool

	for _, user := range registeredUsers {
		if user.Email == registeredUser.Email || user.UserName == registeredUser.UserName {
			flag = true
		}
	}

	if flag {
		json.NewEncoder(w).Encode("User Already exsist")
	} else {
		insertOneItem(w, &registeredUser)
		w.WriteHeader(http.StatusCreated)
		json.NewEncoder(w).Encode(registeredUser)
	}

}

func GetAllFilesForUserInDB(w http.ResponseWriter, r *http.Request) {

	vars := mux.Vars(r)
	username := vars["username"]

	files := getAllFilesForId(w, r, username)

	if len(files) > 0 {
		w.WriteHeader(http.StatusOK)
	} else {
		w.WriteHeader(http.StatusBadRequest)
	}

}

func DeleteFile(w http.ResponseWriter, r *http.Request) {

	vars := mux.Vars(r)
	filename := vars["filename"]
	username := vars["username"]
	admin, _ := strconv.Atoi(vars["admin"])
	fmt.Println(admin)
	var files []model.File
	if(admin == 1){
		fmt.Print("In admin condition")
		getAllUsersWithFileIfAdmin(w,r, filename)
		return
	} else{
		files = getAllFilesForId(w, r, username)
	}

	var filesAfterDeleted []model.File

	for _, f := range files {
		if f.File_Name != filename {
			filesAfterDeleted = append(filesAfterDeleted, f)
		} else {
			_, err := db.Exec("delete from files where file_name = ? && username=?", filename, username)
			if err != nil {
				log.Fatal(err)
			}

		}
	}

	json.NewEncoder(w).Encode(len(filesAfterDeleted))
}

func AddFilesToSelectedUsers(w http.ResponseWriter, r *http.Request) {
	uploadFile(w,r)		
}

func getAllUsersWithFileIfAdmin(w http.ResponseWriter, r *http.Request, fileName string){
	_, err := db.Exec("delete from files where file_name=?", fileName)
	if err!=nil{
		log.Fatal(err)
	}
	json.NewEncoder(w).Encode("File Deleted successfully for all users")
}
func getAllUsersFromDB(w http.ResponseWriter) []model.Registration {

	var registeredUsers []model.Registration

	if db == nil {
		http.Error(w, "Database connection is nil", http.StatusInternalServerError)
	}

	rows, err := db.Query("select email,username,password from registration")

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}

	for rows.Next() {
		var user model.Registration

		err := rows.Scan(&user.Email, &user.UserName, &user.Password)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
		}

		registeredUsers = append(registeredUsers, user)

	}

	if err := rows.Err(); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}

	return registeredUsers
}

func insertOneItem(w http.ResponseWriter, registeredUser *model.Registration) {

	_, err := db.Exec("INSERT INTO registration (email, username, password) VALUES (?, ?, ?)", registeredUser.Email, registeredUser.UserName, registeredUser.Password)

	if err != nil {
		log.Fatal(err)
	}

}

func isLoggedIn(w http.ResponseWriter, logInDetails *model.Login) (bool, string) {

	var registeredUsers []model.Registration = getAllUsersFromDB(w)

	var flag bool

	for _, user := range registeredUsers {
		if user.UserName == logInDetails.UserName && user.Password == logInDetails.Password {
			flag = true
		}
	}

	var err error

	var username string

	err = db.QueryRow("select username from registration where username= ?", logInDetails.UserName).Scan(&username)

	if err != nil {
		if err == sql.ErrNoRows {
			fmt.Println("No user found with the given username")
		} else {
			log.Fatal(err)
		}
	}

	return flag, username
}

func uploadFile(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/octet-stream")
	// Parse multipart form data
	r.ParseMultipartForm(10 << 20) // Max file size: 10MB

	username := r.FormValue("username")
	admin := r.FormValue("admin")
	file, fileHeader, err := r.FormFile("file")

	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	defer file.Close()

	// Read file content into memory
	fileContent, err := io.ReadAll(file)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Write the file to disk
	// Here, you can save the file to your desired location
	// For simplicity, we'll just print out the file details
	fmt.Printf(fileHeader.Filename, fileHeader.Size)

	files := getAllFilesForId(w, r, username)

	for _, f := range files{
		if(f.File_Name == fileHeader.Filename){
			json.NewEncoder(w).Encode("File already exsist")
			return
		}
	}

	_, err = db.Exec("INSERT INTO files ( file_content, file_name, file_size, username, file_admin)  VALUES (?, ?, ?, ?, ?)", fileContent, fileHeader.Filename, fileHeader.Size, username, admin)

	if err != nil {
		http.Error(w, err.Error(), http.StatusNotFound)
		json.NewEncoder(w).Encode("File not found")
		return
	}
	// Send a success response
	json.NewEncoder(w).Encode("File uploaded sucessfully")
	w.WriteHeader(http.StatusOK)

}

func getAllFilesForId(w http.ResponseWriter, r *http.Request, username string) []model.File {

	rows, err := db.Query("select file_name,file_content, file_admin from files where username= ?", username)

	if err != nil {
		json.NewEncoder(w).Encode("No files found for the user")
	}

	var files []model.File
	defer rows.Close()

	for rows.Next() {
		var file model.File
		if err := rows.Scan(&file.File_Name, &file.File_Content, &file.File_Admin); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
		}
		files = append(files, file)
	}

	// Check for errors after iteration
	if err := rows.Err(); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}

	// Convert files slice to JSON
	jsonData, err := json.Marshal(files)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}

	// Set response headers and write JSON response
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write(jsonData)

	return files

}
