package algorithm

import (
	"fmt"
	"scraper/models"
	"github.com/gocolly/colly"
	"strings"
	"sync"
)

func GetTitle(url string) string{
	c := colly.NewCollector()

	var title string
	c.OnHTML("title", func(e *colly.HTMLElement) {
		title = e.Text
	})

	err := c.Visit(url)

	if err != nil {
		return ""
	}
	title = strings.Trim(title, " - Wikipedia")
	return title
}

// scrape hyperlinks of a page
func Scraper(pageUrl string) []models.Page {
	// Instantiate default collector
	c := colly.NewCollector(
		colly.AllowedDomains("en.wikipedia.org"),
	)

	// Create channel
	links := make(chan models.Page)

	// Slice to store result 
	result := []models.Page{}

	// Create wait group
	var w sync.WaitGroup

	// On every a element which has href attribute, call callback
	c.OnHTML("a[href]", func(e *colly.HTMLElement) {
		// Extract link
		link := e.Attr("href")
		text := e.Attr("title")

		// Send link object to links channel
		if strings.HasPrefix(link, "/wiki") && !strings.HasSuffix(link, "/Main_Page")  && !strings.Contains(link,":") {
			links <- models.Page{Title: text, Url: "https://en.wikipedia.org" + link}
		}
	})

	// Before making a request print "Visiting ..."
	c.OnRequest(func(r *colly.Request) {
		fmt.Println("Visiting", r.URL.String())
	})

	// Incr wait group counter
	w.Add(1)

	// Start scraping 
	go func() {
		defer w.Done()
		if err := c.Visit(pageUrl); err != nil {
            fmt.Println("Error visiting URL:", err)
        }
	}()

	// Close links when scraping is finished
	go func() {
		w.Wait()
		close(links)
	}()
		
	for val := range links {
		result = append(result, val)
	}
	return result
}