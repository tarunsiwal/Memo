import React, { useEffect, useRef } from 'react'
import cross from '../../assets/images/svg/cross.svg'
import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';

const SearchPopup = ({trigger, onClose, searchQuery, setSearchQuery}) => {
const inputRef = useRef(null)
  const handleSubmit = (e) => {
    e.preventDefault();
    // handleSearch(searchQuery);
    onClose();
  };
  const handleClose = () => {
    onClose();
  }
  return trigger ? 
    (<div className="popup-container">
        <div className="popup">
          <form className='form-group' onSubmit={handleSubmit}>
            <div className='d-flex search-bar'>
              <InputGroup >
              <Form.Control
                placeholder="Search your task..."
                autofocus
                ref={inputRef}
                aria-label="title"
                className="text-area"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                required
                aria-describedby="basic-addon1"
              />
            </InputGroup>
              <div className='submit-btn'>
                  <img style={{width:'1em'}} className='sidebarImage' onClick={handleClose} src={cross}></img>                
              </div>
            </div>
          </form>
        </div>
    </div> 
  ) : null
}

export default SearchPopup