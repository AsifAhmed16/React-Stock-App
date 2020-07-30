import React, { Component } from 'react';
import { deletePortfolio } from "../actions/portfolioController";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import swal from 'sweetalert';
import '../style/PortfolioDelete.scss'


class PortfolioDelete extends Component {
    constructor() {
        super();
        this.onFormSubmit = this.onFormSubmit.bind(this);
    }

    onFormSubmit(event) {
        event.preventDefault();
        return swal({
            title: "Are you sure ?",
            text: "Once deleted, you will not be able to recover this Portfolio and its Stocks!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
            .then((willDelete) => {
                if (willDelete) {
                    this.props.deletePortfolio(this.props.clicked_id);
                } else {
                    swal("The operation in cancelled!");
                }
            });
    }

    render() {
        return (
            <div>
                <form onSubmit={(event) => this.onFormSubmit(event)}>
                    <button type='submit' className='del_btn'>Delete Portfolio</button>
                </form>
            </div>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ deletePortfolio }, dispatch);
}

export default connect(null, mapDispatchToProps)(PortfolioDelete);
