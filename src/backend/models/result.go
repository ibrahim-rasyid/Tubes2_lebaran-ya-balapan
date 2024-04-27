package models

type Result struct {
	Accessed int		`json:"accessed"`
	N_step   int		`json:"n_step"`
	Steps    []Page		`json:"steps"`
	Time     float64	`json:"time"`
}