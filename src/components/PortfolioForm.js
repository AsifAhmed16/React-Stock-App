import React, { Component } from 'react';
import { connect } from 'react-redux';
import swal from 'sweetalert';
import { addPortfolio } from "../actions/portfolioController";
import { bindActionCreators } from 'redux';
import '../style/PortfolioForm.scss';


class PortfolioForm extends Component {
    constructor() {
        super();
        this.state = {
            title: '',
            errorMsg: false,
            msg: ''
        };
        this.onInputChange = this.onInputChange.bind(this);
        this.onFormSubmit = this.onFormSubmit.bind(this);
    }

    // method to bind data as an input field to add a portfolio
    onInputChange(event) {
        this.setState({ title: String(event.target.value) });
    }

    // method to check count for maximum of 10 portfolios and proceed to save a new portfolio.
    onFormSubmit(event) {
        event.preventDefault();
        if (this.props.reducers.portfolio_count > 9) {
            this.setState({ title: '' });
            return swal("Maximum 5 Portfolios Can Be Added")
        }
        if (this.state.title !== '') {
            this.props.addPortfolio(this.state.title);
            this.setState({ title: '' });
        }
        else
            swal("Please Enter a Portfolio Name");
    }

    render() {
        return (
            <div>
                <form onSubmit={(event) => this.onFormSubmit(event)}>
                    <input
                        placeholder='portfolio name'
                        type="text"
                        className='p_input'
                        value={this.state.title}
                        onChange={this.onInputChange}
                    />
                    <button type='submit' className='p_button'>Add Portfolio</button>
                </form>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return { reducers: state.reducer };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ addPortfolio }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(PortfolioForm);
