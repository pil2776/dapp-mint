import React from 'react';
import { logout, useGetAccountInfo } from '@elrondnetwork/dapp-core';
import { Navbar as BsNavbar, NavItem, Nav } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';
import { dAppName } from 'config';
import { routeNames } from 'routes';
import { ReactComponent as ElrondLogo } from './../../../assets/img/elrond.svg';

const Navbar = () => {
  const { address } = useGetAccountInfo();

  const handleLogout = () => {
    logout(`${window.location.origin}/unlock`);
  };

  const isLoggedIn = Boolean(address);

  return (
    <BsNavbar className='bg-light border-bottom px-4 py-3'>
      <div className='container-fluid'>
        <Link
          className='d-flex align-items-center navbar-brand mr-0'
          to={isLoggedIn ? routeNames.dashboard : routeNames.home}
        >
          <ElrondLogo className='elrond-logo' />
          <span className='dapp-name text-muted'>{dAppName}</span>
        </Link>

        <Nav className='ml-auto'>
          {isLoggedIn && (
            <NavItem>
              <span style={{padding:'0px 10px'}} > {address.substring(0,10) + '....' + address.substring(address.length-10)} 
              </span>              
              
              {/* <Button variant="light">Light</Button>  */}
              <Button variant="dark" onClick={handleLogout}>Close</Button>{' '}
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
