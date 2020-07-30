import { getError } from './errorController';
import httpRequest from 'axios';


// api_key "K9KJ8JZPZ753BIG3" is generated from - 'www.alphavantage.co'
const stock_url = "https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&interval=1min&outputsize=compact&apikey=K9KJ8JZPZ753BIG3";


// api request to fetch stock details
export function fetchStock(p_id, symbol, shares, purchased_value, purchase_on_date) {
    return function action(dispatch) {
        const url = `${stock_url}&symbol=${symbol.toUpperCase()}`;
        const request = httpRequest.get(url);
        return request.then(
            response => dispatch(addStock(response, p_id, shares, purchased_value, purchase_on_date)),
            err => getError(err)
        )
    }
}


export function addStock(stock, id, shares, purchased_value, purchase_on_date) {
    return {
        type: "ADD_STOCK",
        payload: stock,
        id: id,
        shares: shares,
        purchased_value: purchased_value,
        purchase_on_date: purchase_on_date
    }
}


// api request to fetch stock values based on a selected date
export function updateStockValues(port_id, stock_id, symbol) {
    return function action(dispatch) {
        const url = `${stock_url}&symbol=${symbol}`;
        const request = httpRequest.get(url);
        return request.then(
            response => dispatch(saveUpdatedValues(response, port_id, stock_id)),
            err => getError(err)
        );
    }
}


export function saveUpdatedValues(stock, port_id, stock_id) {
    return {
        type: "UPDATE_STOCK_VALUES",
        payload: stock,
        port_id: port_id,
        stock_id: stock_id
    }
}


export function deleteStocks(stocks, id_port) {
    return {
        type: "DELETE_STOCKS",
        stocks: stocks,
        id_port: id_port
    }
}
