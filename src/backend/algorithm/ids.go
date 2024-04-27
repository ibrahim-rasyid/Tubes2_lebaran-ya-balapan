package algorithm

import (
	// "fmt"
	"scraper/models"
	"sync"
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
			result.Steps = path
			result.N_step = depth
			result.Time = exe_time.Seconds()
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

func IDSGoroutine(startTitle string, targetTitle string, startUrl string, targetUrl string) models.Result {
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
	var wg sync.WaitGroup
	for {
		visited := make(map[string]bool)
		// fmt.Println(startPage)
		// fmt.Println(targetPage)
		if depth != 0 {
			wg.Add(1)
		}
		path := DLSGoroutine(startPage, targetPage, visited, steps, depth, &wg)
		wg.Wait()
		if path != nil {
			end := time.Now()
			exe_time := end.Sub(start)
			result.Accessed = len(visited)
			result.Steps = path
			result.N_step = depth
			result.Time = exe_time.Seconds()
			return result
		}
		depth++
	}
}

func DLSGoroutine(currentPage models.Page, targetPage models.Page, visited map[string]bool, steps []models.Page, depth int, wg *sync.WaitGroup) []models.Page {
	defer wg.Done()
	if currentPage.Url == targetPage.Url {
		return []models.Page{currentPage}
	}
	if depth <= 0 {
		return nil
	}

	childUrl := Scraper(currentPage.Url)
	for _, page := range childUrl {
		wg.Add(1)
		if !visited[page.Url] {
			visited[page.Url] = true
			steps = append(steps, page)
			next := DLSGoroutine(page, targetPage, visited, steps, depth-1, wg)
			if next != nil {
				return append([]models.Page{currentPage}, next...)
			}
			steps = steps[:len(steps)-1]
		}
	}
	return nil
}
