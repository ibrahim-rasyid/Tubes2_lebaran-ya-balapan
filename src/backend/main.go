package main

import (
	"scraper/algorithm"
	"fmt"
)

func main(){
	fmt.Println(algorithm.RunBFS("https://en.wikipedia.org/wiki/Joko_Widodo", "https://en.wikipedia.org/wiki/Law_enforcement"))
}