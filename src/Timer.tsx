import React, { useState, useEffect } from 'react';

const Timer = () => {
  const initialTime = 1.5 * 60 * 60; 

  const savedEndTime = localStorage.getItem('endTime');
  const currentTime = Math.floor(Date.now() / 1000);

  const endTime = savedEndTime
    ? parseInt(savedEndTime)
    : currentTime + initialTime;

  const [timeRemaining, setTimeRemaining] = useState(endTime - currentTime);

  useEffect(() => {
    localStorage.setItem('endTime', endTime);

    const interval = setInterval(() => {
      const currentTime = Math.floor(Date.now() / 1000);
      const remaining = endTime - currentTime;

      if (remaining <= 0) {
        clearInterval(interval);
        setTimeRemaining(0);
        localStorage.removeItem('endTime');
      } else {
        setTimeRemaining(remaining);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [endTime]);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <div style={styles.timer}>
      <p>{formatTime(timeRemaining)}</p>
    </div>
  );
};

const styles = {
  timer: {
    position: 'absolute',
    top: '10px',
    left: '10px',
    fontSize: '24px',
    fontWeight: 'bold',
    color: 'white',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: '5px',
    borderRadius: '5px',
  }
};

export default Timer;
