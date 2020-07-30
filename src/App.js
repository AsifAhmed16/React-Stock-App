import React from 'react';
import PortfolioForm from './components/PortfolioForm';
import PortfolioList from './components/PortfolioList';
import './App.scss';

function App() {
  return (
    <div className="App">
      <h1>SPMS</h1>
      <PortfolioForm />
      <div className='line'></div>
      <PortfolioList />
    </div>
  );
}

export default App;
