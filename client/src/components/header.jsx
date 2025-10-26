import { useState } from 'react';
// import InputGroup from 'react-bootstrap/InputGroup';
// import Form from 'react-bootstrap/Form';

import { Rows2, LayoutGrid, Search, Menu } from 'lucide-react';

function Header({
  handleGridChange,
  isGridClose,
  searchQuery,
  setSearchQuery,
  isMobile,
  setIsSidebarOpen,
}) {
  const handleSubmit = (e) => {
    e.preventDefault();
  };
  const clearSearch = () => {
    setSearchQuery('');
  };
  return (
    <div className="header">
      <div className="dummy">
        {!isMobile ? (
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="sideNavMobileToggle"
          >
            <Menu className="sidebarImage" alt="" />
          </button>
        ) : null}
      </div>
      <div className="searchContainer sm">
        <div className="searchBar">
          <form className="form-group" onSubmit={handleSubmit}>
            <div className="search-bar">
              <Search
                className="sidebarImage"
                alt="search"
                strokeWidth={'1.8'}
              />
              <input
                placeholder="Search..."
                aria-label="title"
                className="text-area"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                required
                aria-describedby="basic-addon1"
              />
              <hr />
              {searchQuery ? (
                <button className="btn" type="button" onClick={clearSearch}>
                  Clear
                </button>
              ) : null}
            </div>
          </form>
        </div>
      </div>
      <button className="gridBtn btn" onClick={handleGridChange}>
        {isGridClose ? (
          <Rows2 className="sidebarImage" strokeWidth={'1.8'} />
        ) : (
          <LayoutGrid className="sidebarImage" strokeWidth={'1.8'} />
        )}
      </button>
    </div>
  );
}

export default Header;
