package models

type Response struct {
	Result 	[]Page 	`json:"result"`
	Runtime   	float64 `json:"time"`
}