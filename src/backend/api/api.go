package api

import (
	"fmt"
	"strings"
	"sync"
	"github.com/gocolly/colly"
	"scraper/models"
	//"scraper/algorithm"
)


func Init(){
	// Instantiate default collector
	c := colly.NewCollector(
		colly.AllowedDomains("en.wikipedia.org"),
	)

	// Create channel
	links := make(chan models.Link)

	// Create wait group
	var w sync.WaitGroup

	// On every a element which has href attribute, call callback
	c.OnHTML("#bodyContent a[href]", func(e *colly.HTMLElement) {
		// Extract link
		link := e.Attr("href")
		text := e.Text

		// debug
		// fmt.Printf("Link found : %q -> %s\n", text, link)
		// fmt.Println()

		// Send link object to links channel
		if text != "edit" && text != ""  && strings.HasPrefix(link, "/wiki") {
			links <- models.Link{Title: text, Url: "https://en.wikipedia.org" + link}}
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
		if err := c.Visit("https://en.wikipedia.org/wiki/West_Java"); err != nil {
            fmt.Println("Error visiting URL:", err)
        }
	}()

	// Close links when scraping is finished
	go func() {
		w.Wait()
		close(links)
		}()
		
	for val := range links {
		fmt.Printf("title : %q, url : %s\n", val.Title, val.Url)
	}
}