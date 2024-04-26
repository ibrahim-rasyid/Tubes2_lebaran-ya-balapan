package main

import (
	"fmt"
	"scraper/algorithm"
)

func main() {
	result := algorithm.IDS("https://en.wikipedia.org/wiki/Heru_Budi_Hartono", "https://en.wikipedia.org/wiki/Flood")
	fmt.Printf("%d\n%d\n", result.Accessed, result.N_step)
	for i, step := range result.Steps {
		if i != 0 {
			fmt.Print(" --> ")
		}
		fmt.Printf("%s", step.Title)
	}
	fmt.Printf("\n%f\n", result.Time)
}
