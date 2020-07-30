import React, { Component } from 'react';
import StockForm from './StockForm';
import '../style/StockAdd.scss';


class StockAdd extends Component {
    constructor() {
        super();
        this.state = {
            showForm: false
        };
    }

    openForm() {
        this.setState({ showForm: !this.state.showForm });
    }

    render() {
        return (
            <div>
                <button className="s_button" onClick={this.openForm.bind(this)}>Add Stock</button>
                {this.state.showForm ?
                    <StockForm
                        p_value={this.props.p_value}
                        listStocks={this.props.listStocks}
                        clicked_id={this.props.clicked_id}
                        closePopup={this.openForm.bind(this)} />
                    : null
                }
            </div>
        );
    }
}

export default StockAdd;
