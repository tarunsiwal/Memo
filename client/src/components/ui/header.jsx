import {useState} from 'react'
import grid from '../../assets/images/svg/grid.svg'
function Header({ handleGridChange, isGridClose }) {
  return (
    <div className='header'>
      <button className="btn" onClick={handleGridChange} >
        <img src={grid} 
          alt='grid'
          className='sidebarImage'></img>
      </button>
    </div>
  )
}

export default Header