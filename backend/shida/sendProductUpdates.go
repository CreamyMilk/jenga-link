package shida

import "log"

type TelegramReq struct {
	ChatID    int    `json:"chat_id"`
	Text      string `json:"text"`
	ParseMode string `json:"parse_mode"`
}

func SendMeTelegramMessage(message string) error {
	reqData := TelegramReq{
		ChatID:    2123974520,
		Text:      message,
		ParseMode: "HTML",
	}
	log.Println("✅ Message", message)

	x := new(BUDPayResponseBro)

	err := sendJSONSOMEWHERE("https://api.telegram.org/bot6285343877:AAHX1e55B_t8GrdX0-JJXbJ35ggFj55zP1g/sendMessage", &reqData, x)
	if err != nil {
		return err
	}

	return nil
}
