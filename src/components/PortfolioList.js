import React, { Component } from 'react';
import { connect } from 'react-redux';
import StockDelete from './StockDelete';
import StockAdd from './StockAdd';
import StockList from './StockList';
import PortfolioDelete from "./PortfolioDelete";
import { bindActionCreators } from "redux";
import { getExchangeRate } from "../actions/currencyController";
import { updateStockValues } from "../actions/stockController";
import '../style/PortfolioList.scss';


class PortfolioList extends Component {
    // method to handle currency change while pressing SHOW IN button from $>>E or E>>$
    handleCurrencyChange(id, currency) {
        if (currency === "EUR")
            this.props.getExchangeRate(id, "USD");
        else
            this.props.getExchangeRate(id, "EUR");
    }

    // fetch api and implementation of promise method to update currency change status 
    // while pressing the >> REFRESH button.
    handleRefresh(id, currency, stocks) {
        Promise.resolve(
            stocks.map(stock => {
                this.props.updateStockValues(id, stock.id_stock, stock.symbol);
            })
        )
        .then((response)=> {
                this.props.getExchangeRate(id, currency);
        })
    }

    render() {
        return (
            <div className="all_items">
                {this.props.reducers.portfolios.map(portfolio => {

                    const reducer = (total, stock) => total + portfolio.rate * stock.current_value * stock.shares;
                    const total = (portfolio.stocks.reduce(reducer, 0)).toFixed(2);
                    return (
                        <div className="p_items" key={portfolio.id}>
                            <div className='p_div'>
                                <label>Portfolio Name : <b>{portfolio.name}</b></label>
                                <label>
                                    <button className='curr_btn' name={portfolio.id} onClick={() => this.handleCurrencyChange(portfolio.id, portfolio.currency)} >Show In {portfolio.currency === "EUR" ? "$" : "€"}</button>
                                </label>
                                <label><PortfolioDelete clicked_id={portfolio.id} /></label>
                                <StockAdd p_value={this.props.reducers.p_value} clicked_id={portfolio.id} portfolio={portfolio.name} listStocks={portfolio.stocks} />
                            </div>

                            <div>
                                <StockList listStocks={portfolio.stocks} rate={portfolio.rate} p_id={portfolio.id} p_value={this.props.reducers.p_value} currency={portfolio.currency === "EUR" ? "€" : "$"} />
                                <label>Total Value of <b>{portfolio.name}</b> : <b>{total} {portfolio.currency === "EUR" ? "€" : "$"}</b></label>
                                <label><button className='refresh_btn' onClick={() => this.handleRefresh(portfolio.id, portfolio.currency, portfolio.stocks)}>Refresh</button></label>
                                <label><StockDelete clicked_id={portfolio.id} listStocks={portfolio.stocks} /></label>
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        reducers: state.reducer
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ getExchangeRate, updateStockValues }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(PortfolioList);
