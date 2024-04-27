package main

import (
	"scraper/algorithm"
	// "scraper/api"
	"fmt"
	// "scraper/models"
)

func main(){
	temp := algorithm.RunBFS("https://en.wikipedia.org/wiki/Anies_Baswedan", "https://en.wikipedia.org/wiki/Banana")
	for i := range temp {
		fmt.Println(temp[i])
	}
	// st := make(map[models.Page]models.Page)
	// var mo models.Page
	// mo.Title = "Ass"
	// mo.Url = "woi"
	// _, ok := st[mo]
	// if ok  {
	// 	fmt.Println("Gay")
	// }
}