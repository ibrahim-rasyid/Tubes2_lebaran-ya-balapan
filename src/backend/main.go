package main

import (
	"fmt"
	"scraper/algorithm"
)

func main() {
	fmt.Println(algorithm.IDS("https://en.wikipedia.org/wiki/Tomato", "https://en.wikipedia.org/wiki/Apple_Inc."))
}
