package main

import (
	// "fmt"
	// "scraper/algorithm"
	"scraper/api"
)

func main() {
	// result := algorithm.RunBFS("https://en.wikipedia.org/wiki/Adolf_Hitler", "https://en.wikipedia.org/wiki/United_Kingdom", 20, 0)
	// fmt.Printf("%d\n%d\n", result.Accessed, result.N_step)
	// for _, path := range result.Steps {
	// 	for i, step := range path {
	// 		if i != 0 {
	// 			fmt.Print(" --> ")
	// 		}
	// 		fmt.Printf("%s", step.Title)
	// 	}
	// }
	// fmt.Printf("\n%f\n", result.Time)
	api.Init();
}
