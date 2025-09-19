import {useState} from 'react'
import grid from '../../assets/images/svg/grid.svg'
import gridClose from '../../assets/images/svg/grid-close.svg'
import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';
import magnifier from '../../assets/images/svg/magnifer.svg'
import burger from '../../assets/images/svg/burger-menu.svg'

function Header({ handleGridChange, isGridClose, searchQuery, setSearchQuery, isMobile, setIsSidebarOpen }) {
  const setGrid = isGridClose ? gridClose : grid
  const handleSubmit = (e) => {
    e.preventDefault();
  };
  const clearSearch = () => {
    setSearchQuery('')
  }
  return (
    <div className='header'>
      <div className='dummy'>
        {!isMobile ?  
          <button onClick={() => setIsSidebarOpen(true)} className="sideNavMobileToggle">
            <img src={burger} className='sidebarImage' alt="" />
          </button>
        : null}
      </div>
      <div className='searchContainer sm'>
        <div className="searchBar">
          <form className='form-group' onSubmit={handleSubmit}>
            <div className='d-flex search-bar'>
              <img src={magnifier} className='sidebarImage' alt="search" />
              <InputGroup >
              <Form.Control
                placeholder="Search..."
                aria-label="title"
                className="text-area"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                requireds='true'
                aria-describedby="basic-addon1"
              />
              </InputGroup>
              <hr />
              {searchQuery ? <button className='btn' type="button" onClick={clearSearch}>Clear</button> : null}
            </div>
          </form>
        </div>
      </div>
      <button className="gridBtn btn" onClick={handleGridChange} >
        <img src={setGrid} 
          alt='grid'
          className='sidebarImage'></img>
      </button>
    </div>
  )
}

export default Header