package main

import (
	"fmt"
	"strings"
	"sync"

	"github.com/gocolly/colly"
)

type Link struct {
	title string
	url string
}

func main(){
	// Instantiate default collector
	c := colly.NewCollector(
		colly.AllowedDomains("en.wikipedia.org"),
	)

	// Create channel
	links := make(chan Link)

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
			links <- Link{text, "https://en.wikipedia.org" + link}
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
		fmt.Printf("title : %q, url : %s\n", val.title, val.url)
	}
}