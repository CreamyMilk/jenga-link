package main

import (
	"log"

	"example.com/handler"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
)

func main() {
	app := fiber.New()
	app.Use(cors.New())

	app.Get("/", func(c *fiber.Ctx) error {
		return c.SendString("Hello, World!")
	})
	app.Post("/onboardme", handler.CreateAccountGenLink)
	app.Post("/getmeprod", handler.GetMeProductDetails)
	app.Post("/payforprod", handler.PayForProduct)
	app.Post("/callbackstuff", handler.CallMeUpHandler)

	log.Fatal(app.Listen(":3010"))
}
