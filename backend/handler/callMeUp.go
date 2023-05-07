package handler

import (
	"errors"
	"fmt"
	"log"

	"example.com/shida"
	"github.com/gofiber/fiber/v2"
)

type CallBackReq struct {
	Notify     string `json:"notify"`
	NotifyType string `json:"notifyType"`
	Data       struct {
		ID                int         `json:"id"`
		Currency          string      `json:"currency"`
		Amount            string      `json:"amount"`
		Reference         string      `json:"reference"`
		IPAddress         interface{} `json:"ip_address"`
		Channel           string      `json:"channel"`
		Type              string      `json:"type"`
		Domain            string      `json:"domain"`
		Fees              string      `json:"fees"`
		Plan              interface{} `json:"plan"`
		RequestedAmount   string      `json:"requested_amount"`
		Status            string      `json:"status"`
		CardAttempt       int         `json:"card_attempt"`
		SettlementBatchid interface{} `json:"settlement_batchid"`
		Message           string      `json:"message"`
		Metadata          string      `json:"metadata"`
		CreatedAt         string      `json:"created_at"`
		UpdatedAt         string      `json:"updated_at"`
		PaidAt            string      `json:"paid_at"`
		Customer          struct {
			ID           int         `json:"id"`
			FirstName    interface{} `json:"first_name"`
			LastName     interface{} `json:"last_name"`
			Email        string      `json:"email"`
			Phone        interface{} `json:"phone"`
			Domain       string      `json:"domain"`
			CustomerCode string      `json:"customer_code"`
			Metadata     string      `json:"metadata"`
			Status       string      `json:"status"`
		} `json:"customer"`
	} `json:"data"`
}

func CallMeUpHandler(c *fiber.Ctx) error {
	callRequest := new(CallBackReq)

	if err := c.BodyParser(callRequest); err != nil {
		return err
	}

	product, found := referencesDB[callRequest.Data.Reference]
	if !found {
		return errors.New("reference not stored on our end")
	}

	product.CurrentStock -= 1

	walletDB[product.userIdStoredSomeWhere] += product.Price

	log.Println("The new stock is", product.CurrentStock)

	productURL := fmt.Sprintf("%s%s", bURL, product.ProductName+product.userIdStoredSomeWhere)
	shida.SendMeTelegramMessage(fmt.Sprintf("<b>Product Name : </b> <a href='%s'> %s </a>\n<b>Stock : %d </b> \n<b>💸 Wallet Balance : Ksh. %.2f  </b>  \n\n\n<a href='https://www.google.com/'> Clik here to process refund </a>", productURL, product.ProductName, product.CurrentStock, walletDB[product.userIdStoredSomeWhere]))

	return c.JSON(map[string]string{
		"webhook Acknowledged": "🕊️ Thanks",
	})
}
