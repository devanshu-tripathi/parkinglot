import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import logo from './logop.jpg';
import './styles0.css';

function ParkingLayout() {
  const navigate = useNavigate();

  const initialParkingSlots = JSON.parse(localStorage.getItem('parkingSlots')) || 
    Array(6).fill().map(() => Array(4).fill({ occupied: false, car: null, startTime: null, endTime: null }));

  const [parkingSlots, setParkingSlots] = useState(initialParkingSlots);

  const saveParkingSlotsToLocalStorage = (slots) => {
    localStorage.setItem('parkingSlots', JSON.stringify(slots));
  };

  useEffect(() => {
    saveParkingSlotsToLocalStorage(parkingSlots);
  }, [parkingSlots]);

  const handleSlotClick = (row, col) => {
    if (!parkingSlots[row][col].occupied) {
      const carNumber = prompt('Enter car registration number:');
      if (carNumber) {
        const updatedSlots = [...parkingSlots];
        const currentTime = new Date();
        const hh = String(currentTime.getHours()).padStart(2, '0');
        const mm = String(currentTime.getMinutes()).padStart(2, '0');
        const ss = String(currentTime.getSeconds()).padStart(2, '0');
        const formattedTime = `${hh}:${mm}:${ss}`;
        updatedSlots[row][col] = { occupied: true, car: carNumber, startTime: formattedTime, endTime: null };
        setParkingSlots(updatedSlots);

      }
    }
  };

  const closeSlot = (row, col) => {
    const updatedSlots = [...parkingSlots];
    const currentTime = new Date();
    const hh = String(currentTime.getHours()).padStart(2, '0');
    const mm = String(currentTime.getMinutes()).padStart(2, '0');
    const ss = String(currentTime.getSeconds()).padStart(2, '0');
    const formattedTime = `${hh}:${mm}:${ss}`;
    const carNumber = updatedSlots[row][col].car; 
    const startTime = updatedSlots[row][col].startTime; 
  
    updatedSlots[row][col].endTime = null;
    updatedSlots[row][col].startTime=null;
    updatedSlots[row][col].occupied=false;
    updatedSlots[row][col].car =null;
    updatedSlots[row][col] = { occupied: false, car: null, startTime: null, endTime: null };
    localStorage.setItem('parkingSlots', JSON.stringify(updatedSlots));

    setParkingSlots(updatedSlots);
    navigate('/billing-page', {
      state: {
        carNumber,
        startTime,
        endTime: formattedTime, 
      },
    });
  };
  const handleLogout = () => {
    navigate('/');
  };


  return (
    <div className="parking-layout-container">
        <nav className="navbar ">
        
        <a className="navbar-brand" href="#">
        <div className='x'>
          <img
            src={logo}
            width="40"
            height="40"
            className=" logo-pic "
            style={{ borderRadius: '50%' }} 
            alt=""
          />
          <span className="logo-text">ParkingLayout</span>
          </div>
        </a>
        <ul className="navbar-nav ml-auto">
          <li className="nav-item">
            <button className="logout-button" onClick={handleLogout}>Logout</button>
          </li>
        </ul>

      </nav>

      <div className="parking-grid">
        {parkingSlots.map((row, rowIndex) => (
          <div key={rowIndex} className="parking-row">
            {row.map((slot, colIndex) => (
              <div key={colIndex}  className={`parking-slot ${slot.occupied ? 'occupied' : ''}`}
                   onClick={() => {
                      if (!slot.occupied) {
                         handleSlotClick(rowIndex, colIndex);
                      }
                   }}
              >

                {slot.occupied ? (
                  <div className='click-button'>
                    <div className="registration-number">{slot.car} <p>{slot.startTime}</p></div>
                    <button className="close-button" onClick={() => closeSlot(rowIndex, colIndex)}>
                      Close It
                    </button>
                  </div>
                ) : (
                  'Book it !'
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ParkingLayout;
