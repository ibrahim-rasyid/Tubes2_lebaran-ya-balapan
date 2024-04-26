package main

import (
	"scraper/algorithm"
	// "scraper/api"
	"fmt"
)

func main(){
	fmt.Println(algorithm.RunBFS("https://en.wikipedia.org/wiki/Joko_Widodo", "https://en.wikipedia.org/wiki/Central_Java"))
}