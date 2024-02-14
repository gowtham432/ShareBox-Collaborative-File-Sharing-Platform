package model

type File struct {
	File_Admin   string `json:"admin"`
	File_Content []byte `json:"content"`
	File_Name    string `json:"name"`
}
