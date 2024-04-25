package api

import (
	"time"
	"fmt"
	"log"
	"scraper/models"
	// "scraper/algorithm"
	"strings"
	"sync"
	"github.com/gocolly/colly"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
)

// scrape hyperlinks of a page
func Scraper(pageUrl string) []models.Page {
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
		text := e.Text

		// debug
		// fmt.Printf("Link found : %q -> %s\n", text, link)
		// fmt.Println()

		// Send link object to links channel
		if /*text != "edit" && text != ""  && */strings.HasPrefix(link, "/wiki") {
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
		// fmt.Printf("title : %q, url : %s\n", val.Title, val.Url)
		result = append(result, val)
	}
	return result
}

func handleBFS(c *fiber.Ctx) error{
	var data map[string]string

	// parse body to Page struct, binds the request body to Page struct
	err := c.BodyParser(&data)
	if err != nil{
		return err
	}
	
	// startPage := &models.Page{}
	startTime := time.Now()
	// result := algorithm.bfs(data[startUrl], data[goalUrl])
	result := Scraper(data["startUrl"]) // for testing purposes, nanti diubah
	// result := algorithm.runBFS(data[startUrl], data[goalUrl])
	result := Scraper(data["startUrl"]) // for testing purposes, nanti diubah
	endTime := time.Now()
	executionTime := endTime.Sub(startTime)

	response := models.Response{
		Result: result, // untuk sekarang berupa array of adjacent Page of startPage
		Runtime: float64(executionTime.Microseconds()) / float64(1000),
	}

	return c.JSON(response)
}

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

	return title
}

func Init() {
	app := fiber.New()
	app.Use(cors.New(cors.Config{
		AllowOrigins:     "http://localhost:5173",
		AllowHeaders:     "Origin, Content-Type, Accept",
		AllowMethods:     "POST, GET",
		AllowCredentials: true,
	}))

	// create a new page
	app.Post("/bfs", handleBFS)

	log.Fatal(app.Listen(":8080"))
}