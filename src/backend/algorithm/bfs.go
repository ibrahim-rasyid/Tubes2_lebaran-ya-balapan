package algorithm
// Breadth first search implementation

import (
	"scraper/models"
	"fmt"
	"sync"
	"time"
)

/*
=== MUST READ BEFORE USING ===
The function takes 5 main arguments
if all result are needed to be returned, input max_result as 0 and use_max_res as false
example :

anything := algorithm.RunBFS("https://en.wikipedia.org/wiki/Adolf_Hitler", "https://en.wikipedia.org/wiki/United_Kingdom", 20, 0, false)

*/

func RunBFS(pageUrl string, target string, max_goroutine int, max_result int) models.Response{	// Run BFS function

	visited := make(map[string]bool)
	step := make(map[models.Page]models.Page)
	visited[pageUrl] = true

	var main_page models.Page

	main_page.Title = GetTitle(pageUrl)
	main_page.Url = pageUrl

	var input = []models.Page{main_page}

	// ret, depth, count := runBFSHelper(pageUrl, target, visited, step, input, 1, 0)
	ret, depth, count, runtime := runBFSGoRoutine(pageUrl, target, visited, input, step, 1, max_goroutine, max_result) // Main BFS function
	fmt.Println(depth , " ", "count : ", count)

	for i, j := 0, len(ret)-1; i < j; i, j = i+1, j-1 { // Result reversal for valid output
		ret[i], ret[j] = ret[j], ret[i]
	}

	for i := range ret { // appending result with start page
		ret[i] = append(ret[i], main_page)
		ret[i] = reverse(ret[i])
	}

	if max_result != 0 {
		if max_result < len(ret){
			ret = ret[:max_result]
		}
	}

	var return_val models.Response

	return_val.N_step = depth
	return_val.Accessed = count
	return_val.Time = runtime
	return_val.Steps = ret

	return return_val
}

func runBFSHelper(start string, target string, visited map[string]bool, step map[models.Page]models.Page, to_be_processed []models.Page, depth int, count int) ([]models.Page, int, int){
	// run BFS without concurrentcy
	var new_process []models.Page
	
	for i := range to_be_processed {
		fmt.Println(i)
		st := time.Now()
		temp := Scraper(to_be_processed[i].Url)
		count++
		fmt.Println(time.Since((st)))
		for j := len(temp) - 1 ; j >= 0 ; j--{
			if !visited[temp[j].Url]{

				visited[temp[j].Url] = true
				new_process = append(new_process, temp[j])
				step[temp[j]] = to_be_processed[i]

				if temp[j].Url == target {
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

func runBFSGoRoutine(start string, target string, visited map[string]bool, to_be_processed []models.Page, step map[models.Page]models.Page, depth int, max_go int, max_res int) ([][]models.Page, int, int, float64){
	st := time.Now()
	
	guard := make(chan struct{}, max_go)
	var lock sync.Mutex
	var wg sync.WaitGroup
	// Go routine guard, wait group, and mutex definition

	var next_process []models.Page // Used as queue
	var result [][]models.Page // Path result slice
	added := make(map[string]bool) // Validator for added url
	// Required data initialization

	for i := range to_be_processed {
		guard <- struct{}{}
		wg.Add(1)
		// Go routine constraints prep

			go func (page models.Page) {
				defer func(){
					<-guard
					wg.Done()
					// Routine temrination
				}()
				
				temp := Scraper(page.Url) // Scraping

				lock.Lock() // Lock mutex due to writing data

				visited[page.Url] = true

				for j := range temp {
					if !visited[temp[j].Url]{
						_, val := step[temp[j]]
						if !val{
							step[temp[j]] = page
						}
						if !added[temp[j].Url]{
							next_process = append(next_process, temp[j])
							added[temp[j].Url] = true
						}
						if temp[j].Url == target { // Found result process
							fmt.Println("found from " + page.Url)
							var path_i []models.Page
							if page.Url == start {
	
							} else {
								path_i = getPath(start, step, page)
							}
							path_i = reverse(path_i)
							path_i = append(path_i, temp[j])
							path_i = reverse(path_i)
							// Adding path to result slice of path
							
							result = append(result, path_i)
							break // Break out of loop since a result is found
						}
					}
				}
				lock.Unlock() // Unlock mutex

			}(to_be_processed[i])

		if(len(result) >= max_res && max_res != 0){ // if a maximum amount on answer is not omitted
			break
		}
	}

	wg.Wait() // Wait for go routines termination
	// fmt.Println(len(result)) debugging purpose
	// fmt.Println(time.Since(st))

	total_time := time.Since(st).Seconds()

	if len(result) == 0 {
		depth++ // depth increment
		return runBFSGoRoutine(start, target, visited, next_process, step, depth, max_go, max_res)
	} else {
		return result, depth, len(visited), total_time
	}
}

func reverse(ret []models.Page) []models.Page {
	// Slice reversal
	for i, j := 0, len(ret)-1; i < j; i, j = i+1, j-1 {
		ret[i], ret[j] = ret[j], ret[i]
	}
	return ret
}

func getPath(start string, step map[models.Page]models.Page, page models.Page) []models.Page {
	// Path treading algorithm
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