package shida

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
)

const COMMMON_CALL_BACK_URL = "  https://73cf-197-237-158-133.in.ngrok.io/" + "callbackstuff"

type BUDPayReq struct {
	Email    string `json:"email"`
	Amounts  string `json:"amount"`
	Callback string `json:"callback"`
	Currency string `json:"currency"`
}

type BUDPayResponseBro struct {
	Status  bool   `json:"status"`
	Message string `json:"message"`
	Data    struct {
		AuthorizationURL string `json:"authorization_url"`
		AccessCode       string `json:"access_code"`
		Reference        string `json:"reference"`
	} `json:"data"`
}

func GetMePaymentURL(countryCode string, usersEmail string, amount float64) (*BUDPayResponseBro, error) {

	reqData := BUDPayReq{
		Email:    usersEmail,
		Amounts:  fmt.Sprint(amount),
		Callback: COMMMON_CALL_BACK_URL,
		Currency: countryCode,
	}

	x := new(BUDPayResponseBro)

	err := sendJSONSOMEWHERE("https://api.budpay.com/api/v2/transaction/initialize", &reqData, x)
	if err != nil {
		return nil, err
	}

	return x, nil
}

func sendJSONSOMEWHERE(endpoint string, data, dest interface{}) error {
	var err error

	var payloadBytes []byte
	payloadBytes, err = json.Marshal(data)
	if err != nil {
		return err
	}

	body := bytes.NewReader(payloadBytes)

	var request *http.Request
	request, err = http.NewRequest(http.MethodPost, endpoint, body)
	if err != nil {
		return err
	}

	// req.Header.Add("Connection", "keep-alive")
	request.Header.Add("Accept", "application/json, text/plain, */*")
	request.Header.Add("Content-Type", "application/json;charset=UTF-8")
	request.Header.Add("Accept-Language", "en-US,en;q=0.9")
	request.Header.Add("Authorization", "Bearer sk_live_cswltnqwc2rp7dedhblxpxmuoaz880jgqmi92dz")
	// req.Header.Add("Referer", "http://localhost:8080/")
	// req.Header.Add("User-Agent", "Mozilla/5.0 (iPhone; CPU iPhone OS 15_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko)")
	// req.Header.Add("Origin", "http://localhost:8080")

	var response *http.Response
	response, err = http.DefaultClient.Do(request)
	if err != nil {
		return err
	}

	defer response.Body.Close()

	responseBody, err := ioutil.ReadAll(response.Body)
	if err != nil {
		return err
	}

	err = json.Unmarshal(responseBody, &dest)

	defer response.Body.Close()
	if err != nil {
		return err
	}

	return nil
}
