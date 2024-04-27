package api

import (
	"log"
	"scraper/algorithm"
	"scraper/models"
	"strconv"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
)

func handleBFS(c *fiber.Ctx) error{
	var data map[string]string

	// parse body to data 
	err := c.BodyParser(&data)
	if err != nil{
		return err
	}
	max_result, err := strconv.Atoi(data["maxResult"])
    if err != nil {
        return err
    }
	// run algo
	result := algorithm.RunBFS(data["startUrl"], data["goalUrl"],20,max_result)
	response := models.Response{
		Steps: result.Steps,
		Accessed: result.Accessed,
		N_step: result.N_step,
		Time: result.Time,
	}

	return c.JSON(response)
}

func handleIDS(c *fiber.Ctx) error{
	var data map[string]string
	var temp_result [][]models.Page

	// parse body to data
	err := c.BodyParser(&data)
	if err != nil{
		return err
	}
	// run algo
	result := algorithm.IDS(data["startPage"], data["endPage"], data["startUrl"], data["goalUrl"])
	temp_result = append(temp_result, result.Steps)
	response := models.Response{
		Steps: temp_result,
		Accessed: result.Accessed,
		N_step: result.N_step,
		Time: result.Time,
	}

	return c.JSON(response)
}

func Init() {
	app := fiber.New()
	app.Use(cors.New(cors.Config{
		AllowOrigins:     "http://localhost:5173",
		AllowHeaders:     "Origin, Content-Type, Accept",
		AllowMethods:     "POST, GET",
		AllowCredentials: true,
	}))

	// create  new route
	app.Post("/bfs", handleBFS)
	app.Post("/ids", handleIDS)

	log.Fatal(app.Listen(":8080"))
}