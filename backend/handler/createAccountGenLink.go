package handler

import (
	"errors"
	"fmt"

	"example.com/shida"
	"example.com/utils"
	"github.com/gofiber/fiber/v2"
)

const bURL = "http://localhost:3000/"

type CreateAccountReq struct {
	SourceCountry         string  `json:"countryCode"`
	ProductName           string  `json:"productName"`
	Image                 string  `json:"imageURL"`
	Price                 float64 `json:"price"`
	CurrentStock          int64   `json:"stock"`
	OwnerEmail            string  `json:"email"`
	OwnerTelegram         string  `json:"telegram"`
	userIdStoredSomeWhere string
}

type GetMeProductRequst struct {
	ProductID string `json:"pid"`
}

type PayMeRequst struct {
	ProductID string `json:"pid"`
	Email     string `json:"email"`
	Country   string `json:"country"`
}

type PayMeReponse struct {
	PaymentURL                  string `json:"payurl"`
	SomeStuffWeWilBEstoringInBE *shida.BUDPayResponseBro
}

// jotham@gmail.com: w423432434
var userDB = make(map[string]string)

// 213123: 200
var walletDB = make(map[string]float64)

// productName + userId = product nonsnce
var productDB = make(map[string]*CreateAccountReq)

// reference -> Prodcut
var referencesDB = make(map[string]*CreateAccountReq)

type CoolPageResponse struct {
	CoolURL   string
	ProductID string
}

func CreateAccountGenLink(c *fiber.Ctx) error {
	newAccountRequest := new(CreateAccountReq)

	if err := c.BodyParser(newAccountRequest); err != nil {
		return err
	}

	userId, found := userDB[newAccountRequest.OwnerEmail]
	if !found {
		userId = utils.SomeRef(4)
		userDB[newAccountRequest.OwnerEmail] = userId
	}

	theProductID := newAccountRequest.ProductName + userId

	newAccountRequest.userIdStoredSomeWhere = userId

	productDB[theProductID] = newAccountRequest

	return c.JSON(&CoolPageResponse{
		CoolURL:   fmt.Sprintf("%spay/%s", bURL, theProductID),
		ProductID: theProductID,
	})

}

func GetMeProductDetails(c *fiber.Ctx) error {
	getMeRequest := new(GetMeProductRequst)

	if err := c.BodyParser(getMeRequest); err != nil {
		return err
	}

	product, found := productDB[getMeRequest.ProductID]
	if found {
		return c.JSON(&product)
	}

	return nil
}

func PayForProduct(c *fiber.Ctx) error {
	payMeRequest := new(PayMeRequst)

	if err := c.BodyParser(payMeRequest); err != nil {
		return err
	}

	product, found := productDB[payMeRequest.ProductID]
	if !found {
		return errors.New("the product doesn't exist 😭")
	}

	payableAmount := product.Price
	if payMeRequest.Country != product.SourceCountry {

		// TODO we freaking win
		if product.SourceCountry != payMeRequest.Country {
			payableAmount = product.Price / 10
		} else {
			payableAmount = product.Price
		}

	}

	paymentDetss, err := shida.GetMePaymentURL(payMeRequest.Country, payMeRequest.Email, payableAmount)
	if err != nil {
		return err
	}

	referencesDB[paymentDetss.Data.Reference] = product

	return c.JSON(&PayMeReponse{
		PaymentURL:                  paymentDetss.Data.AuthorizationURL,
		SomeStuffWeWilBEstoringInBE: paymentDetss,
	})
}
