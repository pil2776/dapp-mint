import React from 'react';

const Footer = () => {
  return (
    <footer className='text-center mt-2 mb-3'>
      <div>
        <a
          {...{
            target: '_blank'
          }}
          className='d-flex align-items-center'
          href='https://elrond.com/'
        >
        </a>
      </div>
    </footer>
  );
};

export default Footer;
