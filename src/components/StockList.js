import React, { Component } from 'react';
import { Table } from 'react-bootstrap';
import '../style/StockList.scss';


class StockList extends Component {
  render() {
    return (
      <Table className="table" responsive>
        <thead>
          <tr>
            <th scope="col">Name</th>
            <th scope="col">No of Shares</th>
            <th scope="col">Date of Purchase</th>
            <th scope="col">Purchase Unit</th>
            <th scope="col">Current Unit</th>
            <th scope="col">Total Price</th>
            <th scope="col">Select To Delete</th>
          </tr>
        </thead>
        <tbody>
          {this.props.listStocks.map(stock => {
            return (
              <tr key={stock.id_stock}>
                <td>{stock.symbol}</td>
                <td>{stock.shares}</td>
                <td>{stock.purchase_on_date}</td>
                <td>{stock.purchased_value}{this.props.currency}</td>
                <td>{(this.props.rate * stock.current_value).toFixed(4)}{this.props.currency}</td>
                <td>{(this.props.rate * stock.current_value * stock.shares).toFixed(2)}{this.props.currency}</td>
                <td><input type="checkbox" value={stock.id_stock} id={stock.id_stock} /></td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    );
  }
}

export default StockList;
