package algorithm

import ( 
	// "fmt"
	"scraper/api"
	"scraper/models"
)

// type Queue []models.Page

// func enqueue(q *Queue, element models.Page){
// 	*q = append((*q), element)
// }

// func dequeue(q *Queue) models.Page {
// 	element := (*q)[0]
// 	*q = (*q)[1:]
// 	return element
// }

func RunBFS(pageUrl string, target string) []models.Page{
	visited := make(map[string]bool)
	step := make(map[models.Page]models.Page)
	visited[pageUrl] = true

	var main_page models.Page

	main_page.Title = api.GetTitle(pageUrl)
	main_page.Url = pageUrl

	var input = []models.Page{main_page}

	return runBFSHelper(pageUrl, target, visited, step, input)
}

func runBFSHelper(start string, target string, visited map[string]bool, step map[models.Page]models.Page, to_be_processed []models.Page) []models.Page{
	
	var new_process []models.Page
	
	for i := range to_be_processed {
		temp := api.Scraper(to_be_processed[i].Url)
		for j := range temp{
			if !visited[temp[j].Url]{

				visited[temp[j].Url] = true
				new_process = append(new_process, temp[j])
				step[temp[j]] = to_be_processed[i]

				if temp[j].Url == target {
					var ret []models.Page
					ret = append(ret, temp[j])
					return ret
				}
			}
		}
		new_process = append(new_process, temp...)
	}

	return runBFSHelper(start, target, visited, step, new_process)
}