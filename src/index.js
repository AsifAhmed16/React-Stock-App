import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import ReduxPromise from 'redux-promise';
import thunk from 'redux-thunk';
import reducers from './reducers';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';


// connection settings for persistent local storage to save all data (portfolios, stocks,
// number of shares, initial values, latest values, and latest historical values)
const persistedState = localStorage.getItem('final_state') ? JSON.parse(localStorage.getItem('final_state')) : {};
const store=createStore(reducers,persistedState, applyMiddleware(ReduxPromise,thunk));
store.subscribe(()=>{
    localStorage.setItem('final_state',JSON.stringify(store.getState()));
});
// connection seetings for persistent local storage ends

class Doc extends React.Component{
  componentDidMount(){
    document.title = "spms"
  }

  render(){
    return(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    )
  }
}

ReactDOM.render(
  <Provider store={store}>
    <Doc />
  </Provider>,
  document.getElementById('root')
);

serviceWorker.unregister();
