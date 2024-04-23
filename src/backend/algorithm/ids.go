package algorithm

import (
	// "fmt"
	"scraper/api"
	"scraper/models"
	"time"
)

func IDS(startUrl string, targetUrl string) models.Result {
	var result models.Result
	var steps []models.Page

	depth := 0
	start := time.Now()
	for {
		visited := make(map[string]bool)
		path := DLS(startUrl, targetUrl, visited, steps, depth)
		if path != nil {
			end := time.Now()
			exe_time := end.Sub(start)
			result.Steps = path
			result.N_step = depth
			result.Time = exe_time.Milliseconds()
			return result
		}
		depth++
	}
}

func DLS(currentUrl string, targetUrl string, visited map[string]bool, steps []models.Page, depth int) []string {
	if currentUrl == targetUrl {
		return []string{currentUrl}
	}
	if depth <= 0 {
		return nil
	}

	childUrl := api.Scraper(currentUrl)
	for _, page := range childUrl {
		if !visited[page.Url] {
			visited[page.Url] = true
			steps = append(steps, page)
			next := DLS(page.Url, targetUrl, visited, steps, depth-1)
			if next != nil {
				return append([]string{currentUrl}, next...)
			}
			steps = steps[:len(steps)-1]
		}
	}
	return nil
}
