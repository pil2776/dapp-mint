import * as React from 'react';
import { Link } from 'react-router-dom';
import { dAppName } from 'config';
import { routeNames } from 'routes';

const Home = () => {
  return (
    <div className='custom-test d-flex flex-fill align-items-center container'>
      <div className='row w-100 pt-3'>
        <div className='col-12 col-md-8 col-lg-5 mx-auto'>
          <div className='card shadow-sm rounded p-4 border-0'>
            <div className='card-body text-center'>
              <h2 className='mb-3' data-testid='title'>
                {dAppName}
              </h2>

              <p className='mb-3'>
                This is a mint dapp sample.
                <br /> Login using your Elrond wallet (Devnet).
              </p>

              <Link
                to={routeNames.unlock}
                className='custom-btn btn  mt-3 text-white'
                data-testid='loginBtn'
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
