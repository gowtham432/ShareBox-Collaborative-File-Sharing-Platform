package model

type Registration struct {
	Email    string `json:"email"`
	UserName string `json:"username"`
	Password string `json:"password"`
}
