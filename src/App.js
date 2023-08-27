import React from 'react'
import { BrowserRouter as Router,Routes, Route } from 'react-router-dom';

import Login from './components/login'
import Parkinglayout from './components/ParkingLayoutPage'
import BillingPage from './components/BillingPage';
function App() {
  return (
   
      <div className="App">
      <Router>
         <Routes>
          <Route path="/" element={<Login/>} />
          <Route path="parking-layout" element={<Parkinglayout/>} />
          <Route path="billing-page" element={<BillingPage/>}/>
         </Routes>
        </Router>
      </div>
    

  );
}

export default App;
