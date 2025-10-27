import React from 'react';

function LogoutPopup({ trigger, handleLogout, onClose }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    handleLogout();
    onClose();
  };
  const handleClose = () => {
    onClose();
  };
  return trigger ? (
    <div className="popup-container">
      <div className="popup" style={{ width: '45%' }}>
        <form onSubmit={handleSubmit}>
          <h1 className="deleteTaskHeading">Logout</h1>
          <p className="descriptiotn">Do you want to logout?</p>
          <div className="popup-btn" style={{ float: 'right', margin: '0' }}>
            <div className="submit-btn">
              <button className="btn submit" type="submit">
                Logout
              </button>
              <button
                className="btn cancel"
                type="button"
                onClick={handleClose}
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  ) : null;
}

export default LogoutPopup;
