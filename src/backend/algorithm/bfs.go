package algorithm

import ( 
	// "fmt"
	"scraper/api"
	"scraper/models"
)

func RunBFS(pageUrl string, target string) []models.Page{
	solution := make([]models.Page, 0, 5)
	visited := make(map[string]bool)
	visited[pageUrl] = true
	runBFSHelper(pageUrl, target, &solution, visited)
	return solution
}

func runBFSHelper(pageUrl string, target string, solution *[]models.Page, visited map[string]bool) {
    results := api.Scraper(pageUrl)
    // found := false

    for i := 0; i < len(results); i++ {
		if(!visited[results[i].Url]){
			visited[results[i].Url] = true
			if results[i].Url == target {
				*solution = append(*solution, results[i])
				// found = true
				return
			}
		}
    }

	
}