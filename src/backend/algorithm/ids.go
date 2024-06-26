package algorithm

import (
	// "fmt"
	"scraper/models"
	"time"
)

func IDS(startTitle string, targetTitle string, startUrl string, targetUrl string) models.Result {
	var result models.Result
	var steps []models.Page

	var startPage models.Page
	startPage.Title = startTitle
	startPage.Url = startUrl

	var targetPage models.Page
	targetPage.Title = targetTitle
	targetPage.Url = targetUrl
	depth := 0

	start := time.Now()
	for {
		visited := make(map[string]bool)
		// fmt.Println(startPage)
		// fmt.Println(targetPage)
		path := DLS(startPage, targetPage, visited, steps, depth)
		if path != nil {
			end := time.Now()
			exe_time := end.Sub(start)
			result.Accessed = len(visited)
			result.N_step = depth
			result.Time = exe_time.Seconds()

			encountered := make(map[string]bool)
			res := []models.Page{}
			for _, i := range path {
				if(!encountered[i.Url]){
					encountered[i.Url] = true
					i.Title = GetTitle(i.Url)
					res = append(res, i)
				}
			}
			result.N_step = len(res) - 1

			result.Steps = res

			return result
		}
		depth++
	}
}

func DLS(currentPage models.Page, targetPage models.Page, visited map[string]bool, steps []models.Page, depth int) []models.Page {
	if currentPage.Url == targetPage.Url {
		return []models.Page{currentPage}
	}
	if depth <= 0 {
		return nil
	}

	childUrl := Scraper(currentPage.Url)
	for _, page := range childUrl {
		if !visited[page.Url] {
			visited[page.Url] = true
			steps = append(steps, page)
			next := DLS(page, targetPage, visited, steps, depth-1)
			if next != nil {
				return append([]models.Page{currentPage}, next...)
			}
			steps = steps[:len(steps)-1]
		}
	}
	return nil
}
