import React from 'react'
import '../../assets/css/popup.css';

function ConfirmDeletePopup({trigger, title, onClose, deleteTask}) {
    const handleSubmit = (e) => {
        e.preventDefault();
        deleteTask();
    }
    const handleClose = () => {
        onClose();
    }
  return trigger ? 
    (<div className="popup-container">
        <div className="popup">
        <form onSubmit={handleSubmit}>
                <p>Do you want to delete this task?</p>
                <p>{title}</p>
                <div className="popup-btn" style={{float:'right', margin:'0'}}>
                    <div className="submit-btn">
                        <button className="btn submit" type="submit">
                            Delete
                        </button>
                        <button
                            className="btn cancel"
                            type="button"
                            onClick={handleClose}
                        >Cancel
                        </button>
                    </div>
                </div>
            </form>
        </div>
    </div> 
  ) : null
}

export default ConfirmDeletePopup;