import React from 'react';
import { AuthenticatedRoutesWrapper } from '@elrondnetwork/dapp-core';
import { useLocation } from 'react-router-dom';
import routes, { routeNames } from 'routes';
import Footer from './Footer';
import Navbar from './Navbar';
import NftPlaceElrond from './../../assets/img/darkblue.jpg';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { search } = useLocation();

  var sectionStyle = {
    /*width: "100%",
    height: "auto",
    backgroundImage: `url(${NftPlaceElrond})`,
    backgroundRepeat: "no-repeat",
    background: "url(${NftPlaceElrond}) no-repeat center center fixed",*/
    backgroundSize: 'cover',
    backgroundImage: `url(${NftPlaceElrond})`,
    backgroundRepeat: "no-repeat",
    backgroundOrigin: "center",
    backgroundClip: "center",
    backgroundAttachment:"fixed",
    height: "100%",
    overflow: "hidden"
  };



  return (
    <>
  
    <div className='d-flex flex-column flex-fill wrapper' >
     
      <div style={ sectionStyle } >  

      <Navbar />
      <main className='d-flex flex-fill flex-grow-1'>
        <AuthenticatedRoutesWrapper
          routes={routes}
          unlockRoute={`${routeNames.unlock}${search}`}>
          {children}
        </AuthenticatedRoutesWrapper>
      </main>
      <Footer />
     
     </div> 

    </div>
    </>
    
  );
};

export default Layout;
