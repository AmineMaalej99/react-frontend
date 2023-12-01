import React from 'react';

const Notification = ({ type, message, onClose }) => {
  const notificationStyle = {
    backgroundColor: type === 'success' ? '#4caf50' : '#f44336',
    color: 'white',
    padding: '10px',
    borderRadius: '5px',
    position: 'fixed',
    top: '10px',
    right: '10px',
    display: 'flex',
    alignItems: 'center',
  };

  const closeButtonStyle = {
    color: 'white',
    cursor: 'pointer',
    marginLeft: '5px',
    border: 'none',
    backgroundColor: 'transparent',
  };

  return (
    <div style={notificationStyle}>
      {message}
      <button onClick={onClose} style={closeButtonStyle}>
        X
      </button>
    </div>
  );
};

export default Notification;
