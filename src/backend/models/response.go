package models

type Response struct {
	Result 	[]Link 	`json:"result"`
	Time   	float64 `json:"time"`
}