package algorithm

import (
	"fmt"
	"scraper/api"
	"scraper/models"
	"sync"
	"time"
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

func RunBFS(pageUrl string, target string) [][]models.Page{
	start := time.Now()
	visited := make(map[string]bool)
	step := make(map[models.Page]models.Page)
	visited[pageUrl] = true

	var main_page models.Page

	main_page.Title = api.GetTitle(pageUrl)
	main_page.Url = pageUrl

	var input = []models.Page{main_page}

	// ret, depth, count := runBFSHelper(pageUrl, target, visited, step, input, 1, 0)
	ret, depth, count := runBFSGoRoutine(pageUrl, target, visited, input, step, 0, 10)
	fmt.Println(depth , " ", "count : ", count)
	// ret = append(ret, main_page)

	for i, j := 0, len(ret)-1; i < j; i, j = i+1, j-1 {
		ret[i], ret[j] = ret[j], ret[i]
	}

	// for i := range ret {
	// 	if ret[i].Title == ""{
	// 		ret[i].Title = api.GetTitle(ret[i].Url)
	// 	}
	// }

	fmt.Println(time.Since((start)))

	return ret
}

func runBFSHelper(start string, target string, visited map[string]bool, step map[models.Page]models.Page, to_be_processed []models.Page, depth int, count int) ([]models.Page, int, int){
	
	var new_process []models.Page
	
	for i := range to_be_processed {
		fmt.Println(i)
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
					// var ret []models.Page
					// step_temp := temp[j]

					// ret = append(ret, step_temp)

					// for {
					// 	if step[step_temp].Url == start {
					// 		break
					// 	} else {
					// 		ret = append(ret, step[step_temp])
					// 		step_temp = step[step_temp]
					// 	}
					// }
					return getPath(start, step, temp[j]), depth, len(visited)
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

func runBFSGoRoutine(start string, target string, visited map[string]bool, to_be_processed []models.Page, step map[models.Page]models.Page, depth int, max_go int) ([][]models.Page, int, int){
	st := time.Now()
	guard := make(chan struct{}, max_go)
	var lock sync.Mutex
	var wg sync.WaitGroup

	var next_process []models.Page

	var result [][]models.Page

	// added := make(map[string]bool)

	for i := range to_be_processed {
		guard <- struct{}{}
		wg.Add(1)

		go func (page models.Page) {
			defer func(){
				<-guard
				wg.Done()
				// fmt.Println("Terminate " + page.Title)
			}()
			temp := api.Scraper(page.Url)
			lock.Lock()

			visited[page.Url] = true

			for j := range temp {
				if !visited[temp[j].Url]{
					_, val := step[temp[j]]
					if !val{
						step[temp[j]] = page
					}
					next_process = append(next_process, temp[j])
					if temp[j].Url == target {
						fmt.Println("found from " + page.Url)
						var path_i []models.Page
						if page.Url == start {

						} else {
							path_i = getPath(start, step, page)
						}
						// path_i = append(path_i, temp[j])
						result = append(result, path_i)
						break
					}
				}
			}
			lock.Unlock()
		}(to_be_processed[i])
	}

	wg.Wait()
	fmt.Println(len(result))
	fmt.Println(time.Since(st))

	if len(result) == 0{
		depth++
		return runBFSGoRoutine(start, target, visited, next_process, step, depth, max_go)
	} else {
		return result, depth, len(visited)
	}
}

func reverse(ret []models.Page) []models.Page {
	for i, j := 0, len(ret)-1; i < j; i, j = i+1, j-1 {
		ret[i], ret[j] = ret[j], ret[i]
	}
	return ret
}

func getPath(start string, step map[models.Page]models.Page, page models.Page) []models.Page {
	var ret []models.Page
	step_temp := page

	ret = append(ret, step_temp)

	for {
		if step[step_temp].Url == start {
			break
		} else {
			ret = append(ret, step[step_temp])
			step_temp = step[step_temp]
		}
	}

	return ret
}