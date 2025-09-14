import React from 'react'
import '../../assets/css/popup.css';
import TruncatedText from '../ui/truncatedText';

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
        <div className="popup" style={{width:'45%'}}>
        <form onSubmit={handleSubmit}>
                <h1 className='deleteTaskHeading'>Delete task?</h1>
                <p className='descriptiotn'>Do you want to delete {<TruncatedText className={'fw-bold'} text={title} wordLimit={4}/>} task?</p>  
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