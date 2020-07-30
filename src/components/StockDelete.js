import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { deleteStocks } from '../actions/stockController';
import swal from 'sweetalert';
import '../style/StockDelete.scss';


var selected_stocks = [];

class StockDelete extends Component {
    constructor() {
        super();
        this.onDeletePress = this.onDeletePress.bind(this);
    }

    onDeletePress(event) {
        event.preventDefault();
        selected_stocks = [];
        if (this.props.listStocks.length === 0) {
            swal("No Stock Is In The Table!");
        }
        else {
            this.props.listStocks.map(stock => {
                if (document.getElementById(stock.id_stock).checked) selected_stocks.push(stock.id_stock);
            });
            if (selected_stocks.length === 0) {
                swal("No Stock Is Selected To Delete!");
            }
            else {
                return swal({
                    title: "Are you sure ?",
                    text: "Once deleted, you will not be able to recover the Stocks!",
                    icon: "warning",
                    buttons: true,
                    dangerMode: true,
                })
                    .then((willDelete) => {
                        if (willDelete) {
                            this.props.deleteStocks(selected_stocks, this.props.clicked_id);
                        } else {
                            swal("The operation in cancelled!");
                        }
                    });
            }
        }
    }

    render() {
        return (
            <button className="s_del" onClick={this.onDeletePress.bind(this)}>Remove Selected</button>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ deleteStocks }, dispatch);
}

export default connect(null, mapDispatchToProps)(StockDelete);
