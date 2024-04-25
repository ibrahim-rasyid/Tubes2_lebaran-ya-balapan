package algorithm

import ( 
	"time"
	"fmt"
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
	start := time.Now()
	visited := make(map[string]bool)
	step := make(map[models.Page]models.Page)
	visited[pageUrl] = true

	var main_page models.Page

	main_page.Title = api.GetTitle(pageUrl)
	main_page.Url = pageUrl

	var input = []models.Page{main_page}

	ret, depth, count := runBFSHelper(pageUrl, target, visited, step, input, 1, 0)

	fmt.Println(depth , " ", "count : ", count)
	ret = append(ret, main_page)

	for i, j := 0, len(ret)-1; i < j; i, j = i+1, j-1 {
		ret[i], ret[j] = ret[j], ret[i]
	}

	for i := range ret {
		if ret[i].Title == ""{
			ret[i].Title = api.GetTitle(ret[i].Url)
		}
	}

	fmt.Println(time.Since((start)))

	return ret
}

func runBFSHelper(start string, target string, visited map[string]bool, step map[models.Page]models.Page, to_be_processed []models.Page, depth int, count int) ([]models.Page, int, int){
	
	var new_process []models.Page
	

	for i := range to_be_processed {
		st := time.Now()
		temp := api.Scraper(to_be_processed[i].Url)
		count++
		fmt.Println(time.Since((st)))
		for j := len(temp) - 1 ; j >= 0 ; j--{
			if !visited[temp[j].Url]{

				visited[temp[j].Url] = true
				new_process = append(new_process, temp[j])
				step[temp[j]] = to_be_processed[i]

				if temp[j].Url == target {
					var ret []models.Page
					step_temp := temp[j]

					ret = append(ret, step_temp)

					for {
						if step[step_temp].Url == start {
							break
						} else {
							ret = append(ret, step[step_temp])
							step_temp = step[step_temp]
						}
					}
					return ret, depth, count
				}
			} else {
				temp = append(temp[:j], temp[j+1:]...)
			}
		}
		new_process = append(new_process, temp...)
	}

	depth++
	return runBFSHelper(start, target, visited, step, new_process, depth, count)
}