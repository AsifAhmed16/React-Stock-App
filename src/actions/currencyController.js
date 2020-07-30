import { getError } from './errorController';
import httpRequest from 'axios';


// api_key "K9KJ8JZPZ753BIG3" is generated from - 'www.alphavantage.co'
const currency_exchange_url = "https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&apikey=K9KJ8JZPZ753BIG3&from_currency=";


// api request to fetch current exchange rate
export function getExchangeRate(id_port, currency) {
    return function action(dispatch) {
        let from_currency = "EUR"
        if (currency === "EUR") {
            from_currency = "USD"
        }
        const url = `${currency_exchange_url}${from_currency}&to_currency=${currency}`;
        const request = httpRequest.get(url);
        return request.then(
            response => dispatch(changeCurrency(response, id_port, currency)),
            err => getError(err)
        );
    };
}


export function changeCurrency(currency_data, id_port, currency) {
    if (currency === "EUR") {
        return {
            type: "CHANGE_TO_EUR",
            payload: currency_data,
            id_port: id_port
        }
    }
    else {
        return {
            type: "CHANGE_TO_USD",
            payload: currency_data,
            id_port: id_port
        }
    }
}
