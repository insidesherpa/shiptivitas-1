import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import HomeTab from './HomeTab';
import Navigation from './Navigation';
import Board from './Board';
import './App.css';

// Changed all the components into functional component!!
// React State plays main role with the dragula Library
function App() {
  const [selectedTab, setSelectedTab] = useState('home');

  const changeTab = (tabName) => {
    setSelectedTab(tabName);
  };

  const renderShippingRequests = () => {
    return <Board />;
  };

  const renderNavigation = () => {
    return (
      <Navigation
        onClick={(tabName) => changeTab(tabName)}
        selectedTab={selectedTab}
      />
    );
  };

  const renderHomeTabContent = () => {
    switch (selectedTab) {
      case 'home':
      default:
        return <HomeTab />;
      case 'shipping-requests':
        return renderShippingRequests();
    }
  };

  return (
    <div className="App">
      {renderNavigation()}

      <div className="App-body">{renderHomeTabContent()}</div>
    </div>
  );
}

export default App;