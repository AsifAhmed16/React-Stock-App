import React, { Component } from 'react';
import { fetchStock } from "../actions/stockController";
import { getError } from "../actions/errorController";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import swal from 'sweetalert';
import { SingleDatePicker } from 'react-dates';
import httpRequest from 'axios';
import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../style/StockForm.scss';


class StockForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            symbol: '',
            shares: '',
            purchase_on_date: '',
            purchased_value: '',
            focused: false,
            error: ''
        };
        this.onSymbolChange = this.onSymbolChange.bind(this);
        this.onSharesChange = this.onSharesChange.bind(this);
        this.onFormSubmit = this.onFormSubmit.bind(this);
    }

    // An asynchronous method call to fetch api for previous value of stock on the day of purchase.
    async componentDidUpdate() {
        try{
            if (this.state.symbol !== '' && this.state.purchase_on_date !== '' && this.state.purchased_value === '') {
                // token_key "Tpk_ec4e84da96074ca9af8ec635b910f4f4" is generated from - 'https://iexcloud.io'
                let p_dt = (((this.state.purchase_on_date).format('L')).replace(/(..).(..).(....)/, "$3$1$2")).toString();
                const token = "Tpk_ec4e84da96074ca9af8ec635b910f4f4";
                const stock_url = "https://sandbox.iexapis.com/stable/stock/";
                const url = `${stock_url}${this.state.symbol.toLowerCase()}/chart/date/${p_dt}?chartByDay=true&token=${token}`;
                let p_val = 0.0;
                return await httpRequest(url)
                    .then(
                        response => {
                            try{
                                p_val = Number(response.data[0]["close"]);
                            } catch {
                                p_val = 0.0;
                            }
                            this.setState({
                                purchased_value: p_val
                            })
                        })
                    .catch(err => { this.props.getError(err) })
            }
        } catch {
            this.props.closePopup();
            this.props.getError("Sorry Something Went Wrong");
        }
    }

    // Disable ADD button for stock add while fetching data based on purchase date
    isButtonDisabled() {
        if (this.state.symbol !== '' && this.state.purchase_on_date !== '') {
            if (this.state.purchased_value !== '') {
                return false
            }
            return true
        }
        return false
    }

    // method to update symbol input while adding a stock and disable ADD button till the api could fetch a result
    onSymbolChange(event) {
        let is_disabled = () => { document.getElementById("add_button").disabled = !this.state.purchased_value }
        this.setState({ symbol: event.target.value });
    }

    // method to update number of share input while adding a stock
    onSharesChange(event) {
        this.setState({ shares: event.target.value });
    }

    onFormSubmit(event) {
        event.preventDefault();
        var isExist = false;
        if (this.state.symbol !== '' && this.state.purchased_value !== '' && this.state.shares !== '' && this.state.purchase_on_date !== '') {
            this.props.listStocks.map(stock => {
                if (this.state.symbol.toUpperCase() === stock.symbol) {
                    isExist = true;
                }
            });
            if (isExist === false) {
                this.props.fetchStock(this.props.clicked_id, this.state.symbol, this.state.shares, this.state.purchased_value, this.state.purchase_on_date.format('L'));
                this.props.closePopup();
                this.setState({
                    symbol: '',
                    shares: '',
                    purchase_on_date: '',
                    purchased_value: '',
                    focused: false,
                });
            }
            else {
                return swal("The stock symbol already exists");
            }
        }
        else {
            return swal("Please Fill-Up All Fields");
        }
    }

    render() {
        return (
            <div style={{ display: 'block' }} className="modal">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <form style={{ margin: '30px' }} onSubmit={(event) => this.onFormSubmit(event)}>
                            <h3>Add Stock</h3>
                            <input
                                placeholder='stock symbol'
                                type="text"
                                value={this.state.symbol}
                                onChange={this.onSymbolChange}
                                className="s_input"
                            />
                            <SingleDatePicker
                                placeholder='purchase on'
                                showDefaultInputIcon='true'
                                showClearDate='true'
                                date={this.state.purchase_on_date}
                                onDateChange={date => this.setState({ purchase_on_date: date })}
                                focused={this.state.focused}
                                onFocusChange={({ focused }) => this.setState({ focused })}
                                numberOfMonths={1}
                                isOutsideRange={() => false}
                            />
                            <input
                                placeholder='number of shares'
                                type="number"
                                min="1"
                                value={this.state.shares}
                                onChange={this.onSharesChange}
                                className="s_input"
                            />
                            <div>
                                <button className="s_cancel" type="button" onClick={this.props.closePopup}>Cancel</button>
                                <button className="s_submit" id="add_button" type="submit" disabled={this.isButtonDisabled()}></button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ fetchStock, getError }, dispatch);
}

export default connect(null, mapDispatchToProps)(StockForm);
