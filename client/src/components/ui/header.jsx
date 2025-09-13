import {useState} from 'react'
import grid from '../../assets/images/svg/grid.svg'
import gridClose from '../../assets/images/svg/grid-close.svg'

function Header({ handleGridChange, isGridClose }) {
  const setGrid = isGridClose ? gridClose : grid
  return (
    <div className='header'>
      <button className="btn" onClick={handleGridChange} >
        <img src={setGrid} 
          alt='grid'
          className='sidebarImage'></img>
      </button>
    </div>
  )
}

export default Header