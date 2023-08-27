import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './styles1.css';

function BillingPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const { carNumber, startTime, endTime } = location.state || {};

  const [totalAmount, setTotalAmount] = useState(0);

  const calculateElapsedTime = (start, end) => {
    const [startHour, startMinute, startSecond] = start.split(':').map(Number);
    const [endHour, endMinute, endSecond] = end.split(':').map(Number);

    const startTimeInSeconds = startHour * 3600 + startMinute * 60 + startSecond;
    const endTimeInSeconds = endHour * 3600 + endMinute * 60 + endSecond;

    const elapsedTimeInSeconds = endTimeInSeconds - startTimeInSeconds;

    return elapsedTimeInSeconds;
  };

  useEffect(() => {
    if (startTime && endTime) {
      const calculateBillingAmount = (elapsedTimeInSeconds) => {
        const initialRate = 40; 
        const ratePer10Seconds = 10;

        if (elapsedTimeInSeconds <= 30) {
          return initialRate;
        } else {
          const additionalSeconds = elapsedTimeInSeconds - 30;
          const additionalBillingAmount = Math.ceil(additionalSeconds / 10) * ratePer10Seconds;
          return initialRate + additionalBillingAmount;
        }
      };
      const elapsedTimeInSeconds = calculateElapsedTime(startTime, endTime);
      const totalAmount = calculateBillingAmount(elapsedTimeInSeconds);
      setTotalAmount(totalAmount);
    }
  }, [startTime, endTime]);

  const handlePayment = () => {

    setTotalAmount(0);
  };

  return (
    <div className="billing-page-container">
      <div className="card">
        <h2>Billing Page</h2>
        {carNumber ? (
          <div className="billing-details">
            <p>Car Registration Number: {carNumber}</p>
            <p>Start Time: {startTime}</p>
            <p>End Time: {endTime}</p>
            <p>Total Amount: ${totalAmount} </p>
          </div>
        ) : (
          <p>No billing information available.</p>
        )}
        {totalAmount > 0 ? (
          <div>
            <button onClick={handlePayment} className="pay-button">
              Pay Now
            </button>
            <p>Please pay the total amount to complete the transaction.</p>
          </div>
        ) : (
          <p>Payment has been completed.</p>
        )}
        <button onClick={() => navigate(-1)} className="go-back-button">
          Go Back
        </button>
      </div>
    </div>
  );
}

export default BillingPage;
