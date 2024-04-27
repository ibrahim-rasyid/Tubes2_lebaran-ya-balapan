package main

import (
	"fmt"
	"scraper/algorithm"
	// "scraper/api"
)

func main() {
	result := algorithm.IDSGoroutine("Prabowo Subianto", "Jakarta", "https://en.wikipedia.org/wiki/Prabowo_Subianto", "https://en.wikipedia.org/wiki/Jakarta")
	fmt.Printf("%d\n%d\n", result.Accessed, result.N_step)
	for i, step := range result.Steps {
		if i != 0 {
			fmt.Print(" --> ")
		}
		fmt.Printf("%s", step.Title)
	}
	fmt.Printf("\n%f\n", result.Time)
	// api.Init();
}
