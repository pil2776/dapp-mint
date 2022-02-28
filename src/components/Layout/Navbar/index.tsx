import React from 'react';
import { logout, useGetAccountInfo } from '@elrondnetwork/dapp-core';
import { Navbar as BsNavbar, NavItem, Nav } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';
import { dAppName } from 'config';
import { routeNames } from 'routes';
import { ReactComponent as ElrondLogo } from './../../../assets/img/elrond.svg';
// import  { ReactComponent as PilzLogo } from './../../../assets/img/IMG_LOGO_FULL_TRANSPARENT_CROPPED_BLACK.svg';
import  PilzLogo  from './../../../assets/img/IMG_LOGO_FULL_TRANSPARENT_CROPPED_WHITE&BLACK.png';
const Navbar = () => {
  const { address } = useGetAccountInfo();

  const handleLogout = () => {
    logout(`${window.location.origin}/unlock`);
  };

  const isLoggedIn = Boolean(address);

  return (
    <BsNavbar className=' custom-navbar px-4 py-3'>
      <div className='container-fluid'>
        <Link
          className='d-flex align-items-center navbar-brand mr-0'
          to={isLoggedIn ? routeNames.dashboard : routeNames.home}
        >
          {/* <ElrondLogo className='elrond-logo' /> */}
          {/* //<PilzLogo  className='pilz-logo'/>
          */}
          
          <img className='custom-logo-img' src={PilzLogo} ></img> 


          <span className='dapp-name text-light'>{dAppName}</span>
        </Link>

        <Nav className='ml-auto'>
          {isLoggedIn && (
            <NavItem>
                         
              <span className="custom-nav-wallet text-light"> {address.substring(0,10) + '....' + address.substring(address.length-10)} 
              </span>  
              
              {/* <Button variant="light">Light</Button>  */}
              <Button className="custom-nav-bt-color" variant="light" onClick={handleLogout}>Close</Button>{' '}
              {/* <button className='btn btn-link' onClick={handleLogout}>
                Close
              </button> */}
            </NavItem>
          )}
        </Nav>
      </div>
    </BsNavbar>
  );
};

export default Navbar;
