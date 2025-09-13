import { forwardRef } from 'react'
import magnifier from '../../assets/images/svg/magnifer.svg'
const SearchPopup = forwardRef(({trigger, onClose}, ref) => {
  const handleClose = () => {
    onClose();
  }
  return trigger ? 
    (<div className="popup-container">
        <div className="popup">
          <form className='form-group'>
            <div className='d-flex'>
              <input type='text' name="searchField" id=""></input>
              <div className='submit-btn'>
                <button className='btn '>
                  <img src={magnifier} alt='magnifier' className='sidebarImage'></img>
                </button>
                <button className='btn ' onClick={handleClose}>x</button>
              </div>
            </div>
          </form>
        </div>
    </div> 
  ) : null
})

export default SearchPopup