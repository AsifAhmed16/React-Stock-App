import actionTypes from '../actions/actionTypes';
import swal from 'sweetalert';

const initialState={
    portfolio_count:0, 
    port_id:0, 
    portfolios:[],
    stock_id:0,
    error:""
};

export default function(state=initialState, action){
    switch (action.type){
        case actionTypes.ADD_PORTFOLIO: {
            return {...state,
                port_id:state.port_id+1,
                portfolio_count:state.portfolio_count+1,
                portfolios:[
                ...state.portfolios, {name:action.portfolio, id:state.port_id++, stock_count:0, stocks:[], rate:1, currency:'USD'}]};
        }
        case actionTypes.DELETE_PORTFOLIO:{
            return {
                ...state,
                portfolio_count:state.portfolio_count-1,
                portfolios: state.portfolios.reduce(
                    function(state_update, portfolio) {
                    if (portfolio.id !== action.id)
                        state_update.push(Object.assign({}, portfolio));
                    return state_update;
                },[])
            };
        }
        case actionTypes.ADD_STOCK:{
            if(action.payload.data["Error Message"])
            {
                swal("Server Side Error", "No such stock with the symbol exists.", "error");
                return state;
            }
            else
            {
                return{...state,
                    stock_id:state.stock_id+1,
                    portfolios: state.portfolios.map(function (portfolio) {
                            if(action.payload.data["Meta Data"]){
							if(portfolio.id === action.id){
                                return Object.assign({},portfolio,{
                                    stock_count:portfolio.stock_count+1,
                                    stocks:[...portfolio.stocks,
                                        {
                                            id_stock: state.stock_id++,
                                            symbol: action.payload.data["Meta Data"]["2. Symbol"],
                                            purchased_value: action.purchased_value,
                                            current_value: Number(action.payload.data["Time Series (1min)"][action.payload.data["Meta Data"]["3. Last Refreshed"]]["4. close"]),
                                            shares: action.shares,
                                            purchase_on_date: action.purchase_on_date,
                                        },
                                        ]
                                });
                            }
							}
							else{
								swal("Server Side Error ", "API call frequency is 5 calls per minute. A higher API call frequency is needed", "error");
							}
                            return portfolio;
                        })
                };
            }
        }
        case actionTypes.UPDATE_STOCK_VALUES:{
            if(action.payload.data["Error Message"])
            {
                swal("Server Error", action.payload.data["Error Message"], "error");
                return state;
            }
            else {
                return {
                    ...state,
                    portfolios: state.portfolios.map(portfolio => {
                        if (portfolio.id === action.port_id) {
                            return Object.assign({}, portfolio, {
                                stocks: portfolio.stocks.map(stock => {
                                    if (stock.id_stock === action.stock_id) {
                                        if(action.payload.data["Time Series (1min)"]){
                                            return Object.assign({}, stock, {	
                                                current_value: action.payload.data["Time Series (1min)"][action.payload.data["Meta Data"]["3. Last Refreshed"]]["4. close"]
                                            })
										}
                                    }
                                    return stock;
                                })
                            })
                        }
                        return portfolio;
                    })
                }
            }
        }
        case actionTypes.DELETE_STOCKS:{
            return{
                ...state,
                portfolios: state.portfolios.map(portfolio=>{
                    if(portfolio.id===action.id_port){
                        return Object.assign({},portfolio,{
                            stock_count:portfolio.stock_count-(action.stocks.length),
                            stocks:portfolio.stocks.reduce(
                                function (state_update,stock) {
                                    if(!action.stocks.includes(stock.id_stock))
                                        state_update.push(Object.assign({},stock));
                                    return state_update;
                                },[])
                        })
                    }
                    return portfolio;
                })
            }
        }
        case actionTypes.CHANGE_TO_EUR:{
            if(action.payload.data["Error Message"])
            {
                swal("Server Error", action.payload.data["Error Message"], "error");
                return state;
            }
            else{
                return{
                    ...state,
                    portfolios:state.portfolios.map(portfolio=>{
                        if(portfolio.id===action.id_port){
                            let rate_ = 0.92;
                            try{
                                rate_ = Number(action.payload.data["Realtime Currency Exchange Rate"]["5. Exchange Rate"]);
                            } catch {
                                rate_ = 0.92;
                            }
                            return Object.assign({},portfolio,{
                                currency:"EUR",
                                rate: rate_
                            })
                        }
                        return portfolio;
                    })
                }
            }
        }
        case actionTypes.CHANGE_TO_USD:{
            if(action.payload.data["Error Message"])
            {
                swal("Server Error", action.payload.data["Error Message"], "error");
                return state;
            }
            else{
                return{
                    ...state,
                    portfolios:state.portfolios.map(portfolio=>{
                        if(portfolio.id===action.id_port){
                            return Object.assign({},portfolio,{
                                currency:"USD",
                                rate:1
                            })
                        }
                        return portfolio;
                    })
                }
            }
        }
        case actionTypes.GET_ERROR:{
            swal("Error ", action.error, "error");
            return state;
        }
        default:
            return state;
    }
}
