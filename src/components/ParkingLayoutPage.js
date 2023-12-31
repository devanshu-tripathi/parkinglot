import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import logo from './logop.jpg';
import './styles0.css';
import Modal from 'react-modal';

function ParkingLayout() {
  const navigate = useNavigate();
  const customModalStyles = {
    content: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      width: '320px',
      height: '250px',
      margin: 'auto',
      minWidth: '320px',
      minHeight: '250px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    },
  };

  const initialParkingSlots = JSON.parse(localStorage.getItem('parkingSlots')) ||
    Array(6).fill().map(() => Array(4).fill({ occupied: false, car: null, startTime: null, endTime: null }));

  const [parkingSlots, setParkingSlots] = useState(initialParkingSlots);
  const [enteredCar, setEnteredCar] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [isAlertClose, setIsAlertClose] = useState(true);
  const [customPromptValue, setCustomPromptValue] = useState('');
  const [customPromptRow, setCustomPromptRow] = useState(null);
  const [customPromptCol, setCustomPromptCol] = useState(null);

  const saveParkingSlotsToLocalStorage = (slots) => {
    localStorage.setItem('parkingSlots', JSON.stringify(slots));
  };

  useEffect(() => {
    saveParkingSlotsToLocalStorage(parkingSlots);
  }, [parkingSlots]);

  const carNumberRegex = /^[A-Z]{2}[ -]?[0-9]{2}[ -]?[A-Z]{1,2}[ -]?[0-9]{4}$/;

  const openModal = (message) => {
    setIsModalOpen(true);
    setModalMessage(message);
  };
  
  const closeModal = () => {
   
    setIsModalOpen(false);
    setModalMessage('');
    setCustomPromptValue('');
  };

 const onpenAlertModel=(message)=>{
  setIsAlertOpen(true);
  setModalMessage(message);
 }
 const closeAlertModal= () =>{
  setIsAlertOpen(false);
  setModalMessage('');
 }
  const handleCustomPromptSubmit = () => {
    if (!carNumberRegex.test(customPromptValue)) {
      
      onpenAlertModel('Invalid car registration number format. Please enter a valid number of format AB12CD3456.');
    } else {
      const foundSlot = parkingSlots.flat().find(slot => slot.occupied && slot.car === customPromptValue);
      if (foundSlot) {
        
        onpenAlertModel('Car is already registered in the parking slots.');
      } else {
        const updatedSlots = [...parkingSlots];
        const currentTime = new Date();
        const hh = String(currentTime.getHours()).padStart(2, '0');
        const mm = String(currentTime.getMinutes()).padStart(2, '0');
        const ss = String(currentTime.getSeconds()).padStart(2, '0');
        const formattedTime = `${hh}:${mm}:${ss}`;
        updatedSlots[customPromptRow][customPromptCol] = { occupied: true, car: customPromptValue, startTime: formattedTime, endTime: null };
        setParkingSlots(updatedSlots);
        closeModal();
      }
    }
  };

  const handleSlotClick = (row, col) => {
    const slot = parkingSlots[row][col];

    if (!slot.occupied) {
      if (isModalOpen) {
        closeModal(); // Close the modal if it's open
      }
      setCustomPromptRow(row);
      setCustomPromptCol(col);
      openModal();
    } else {
      
      onpenAlertModel(`CAR REGISTRATION NUMBER: ${slot.car} \n  START TIME: ${slot.startTime}`);
    }
  };

  const handleEndBooking = () => {
    const foundSlot = parkingSlots.flat().find(slot => slot.occupied && slot.car === enteredCar);

    if (foundSlot) {
      const currentTime = new Date();
      const hh = String(currentTime.getHours()).padStart(2, '0');
      const mm = String(currentTime.getMinutes()).padStart(2, '0');
      const ss = String(currentTime.getSeconds()).padStart(2, '0');
      const formattedTime = `${hh}:${mm}:${ss}`;
      navigate('/billing-page', {
        state: {
          carNumber: foundSlot.car,
          startTime: foundSlot.startTime,
          endTime: formattedTime,
        },
      });
    } else {
      onpenAlertModel('Car not found in the parking slots.');
    }
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
      <div className='parking-grid-all'>
        <div className="parking-grid">
          {parkingSlots.map((row, rowIndex) => (
            <div key={rowIndex} className="parking-row">
              {row.map((slot, colIndex) => (
                <div key={colIndex} className={`parking-slot ${slot.occupied ? 'occupied' : ''}`}
                  onClick={() => {
                    handleSlotClick(rowIndex, colIndex);
                  }}
                >
                  {slot.occupied ? (
                    <div >
                      <div className="registration-number" >Done!</div>
                    </div>
                  ) : (
                    'Book it !'
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className='bottom-card'>
          <input
            type='text'
            placeholder='Enter Car Registration Number'
            className="input-car"
            value={enteredCar}
            onChange={(e) => setEnteredCar(e.target.value)}
          />
          <button className='card-button' onClick={handleEndBooking}>End-Booking</button>
        </div>
      </div>
      <div className='rules'>
        <p>Certainly, here are four essential rules for a parking lot:</p>
        <ul>
          <h5>Follow Designated Spaces:</h5>
          <p>Park only within the clearly marked parking spaces. Avoid double parking, blocking other vehicles, or parking in restricted zones like fire lanes.</p>
          <h5>Observe Time Limits:</h5>
          <p>Respect posted time limits and parking restrictions. Overstaying in a time-limited spot or parking in a no-parking zone can result in fines or towing.</p>
          <h5>No Littering or Dumping:</h5>
          <p>Keep the parking lot clean by disposing of trash properly. Dumping or littering not only harms the environment but may also result in penalties.</p>
          <h5>Speed Limit and Pedestrian Safety:</h5>
          <p>Adhere to the posted speed limits within the parking lot. Always yield to pedestrians, and drive cautiously to ensure the safety of everyone in the area.</p>
        </ul>
      </div>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Enter Car Registration Number"
        style={customModalStyles}
      >
        <div className='size-modal'>
          <input
            type='text'
            placeholder='Enter Car Registration Number'
            className="input-car"
            value={customPromptValue}
            onChange={(e) => setCustomPromptValue(e.target.value)}
          />
          <button onClick={handleCustomPromptSubmit} className='card-button'>Submit</button>
          <button onClick={closeModal} className='card-button'>Close</button>
        </div>
      </Modal>

      {/* Display an alert if isModalOpen is true */}
      {isAlertOpen && (
        <div className="alert-container">
          <div className="alert-box">
            <p>{modalMessage}</p>
            <button onClick={closeAlertModal} className="alert-button">Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ParkingLayout;
