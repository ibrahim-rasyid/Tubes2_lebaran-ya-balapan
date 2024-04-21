package models

type Page struct {
	Title string	`json: "title"`
	Url string		`json: "url"`
	Hyperlinks []string `json: "hyperlinks"`
}