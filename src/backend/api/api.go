package api

import (
	"log"
	"scraper/models"
	"scraper/algorithm"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
)

func handleBFS(c *fiber.Ctx) error{
	var data map[string]string

	// parse body to Page struct, binds the request body to Page struct
	err := c.BodyParser(&data)
	if err != nil{
		return err
	}

	result := algorithm.IDS(data["startPage"], data["endPage"], data["startUrl"], data["goalUrl"]) //NANTI UBAH KE BFS

	response := models.Result{
		Steps: result.Steps,
		Accessed: result.Accessed,
		N_step: result.N_step,
		Time: result.Time,
	}

	return c.JSON(response)
}

func handleIDS(c *fiber.Ctx) error{
	var data map[string]string

	// parse body to Page struct, binds the request body to Page struct
	err := c.BodyParser(&data)
	if err != nil{
		return err
	}

	result := algorithm.IDS(data["startPage"], data["endPage"], data["startUrl"], data["goalUrl"])

	response := models.Result{
		Steps: result.Steps,
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