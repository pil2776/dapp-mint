import * as React from 'react';
import {
  transactionServices,
  useGetAccountInfo,
  useGetPendingTransactions,
  refreshAccount,
  useGetNetworkConfig
} from '@elrondnetwork/dapp-core';
import {
  Address,
  AddressValue,
  Type,
  TypedValue,
  BooleanValue,
  BytesValue,
  ContractFunction,
  ProxyProvider,
  Query,
  BytesType,
  Transaction,
  GasLimit,
  GasPrice,  
  TransactionPayload,
  Balance,
  ChainID,
  TransactionVersion,
  U8Value
} from '@elrondnetwork/erdjs';
import { faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import moment from 'moment';
import { contractAddress, servers } from 'config';
import axios from 'axios';

import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card'
import NftPlaceElrond from './../../../assets/img/Elrond-NFT-space.jpg';
import PersonList from 'api/PersonList';
import NftList from 'api/NftList';

const Actions = () => {
  const account = useGetAccountInfo();
  const { hasPendingTransactions } = useGetPendingTransactions();
  const { network } = useGetNetworkConfig();
  const { address } = account;

  const [secondsLeft, setSecondsLeft] = React.useState<number>();
  const [hasPing, setHasPing] = React.useState<boolean>();
  const /*transactionSessionId*/ [, setTransactionSessionId] = React.useState<
      string | null
    >(null);

  const mount = () => {
    if (secondsLeft) {
      const interval = setInterval(() => {
        setSecondsLeft((existing) => {
          if (existing) {
            return existing - 1;
          } else {
            clearInterval(interval);
            return 0;
          }
        });
      }, 1000);
      return () => {
        clearInterval(interval);
      };
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useEffect(mount, [hasPing]);

  React.useEffect(() => {
    const query = new Query({
      address: new Address(contractAddress),
      func: new ContractFunction('getTimeToPong'),
      args: [new AddressValue(new Address(address))]
      
    });
    const proxy = new ProxyProvider(network.apiAddress);
    proxy
      .queryContract(query)
      .then(({ returnData }) => {
        const [encoded] = returnData;
        switch (encoded) {
          case undefined:
            setHasPing(true);
            break;
          case '':
            setSecondsLeft(0);
            setHasPing(false);
            break;
          default: {
            const decoded = Buffer.from(encoded, 'base64').toString('hex');
            setSecondsLeft(parseInt(decoded, 16));
            setHasPing(false);
            break;
          }
        }
      })
      .catch((err) => {
        console.error('Unable to call VM query', err);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasPendingTransactions]);

  const { sendTransactions } = transactionServices;

  const sendPingTransaction = async () => {
    const pingTransaction = {
      value: '1000000000000000000',
      data: 'ping',
      receiver: contractAddress
    };
    await refreshAccount();

    const { sessionId /*, error*/ } = await sendTransactions({
      transactions: pingTransaction,
      transactionsDisplayInfo: {
        processingMessage: 'Processing Ping transaction',
        errorMessage: 'An error has occured during Ping',
        successMessage: 'Ping transaction successful'
      },
      redirectAfterSign: false
    });
    if (sessionId != null) {
      setTransactionSessionId(sessionId);
    }
  };

  const sendPongTransaction = async () => {
    const pongTransaction = {
      value: '0',
      data: 'pong',
      receiver: contractAddress
    };
    await refreshAccount();

    const { sessionId /*, error*/ } = await sendTransactions({
      transactions: pongTransaction,
      transactionsDisplayInfo: {
        processingMessage: 'Processing Pong transaction',
        errorMessage: 'An error has occured during Pong',
        successMessage: 'Pong transaction successful'
      },
      redirectAfterSign: false
    });
    if (sessionId != null) {
      setTransactionSessionId(sessionId);
    }
  };

  const sendMintTransaction = async () => {
    
    const func = new ContractFunction("mint");
    //const args = [BytesValue.fromHex('0x01')];
    const args = [new U8Value(1)];
    
    console.log("args.length" + args.length);

    const payload = TransactionPayload.contractCall()
      .setFunction(func)
      .setArgs(args)      
      .build();

    const transaction = new Transaction({
        receiver: new Address(contractAddress),
        value: Balance.egld(1),
        gasLimit: new GasLimit(30000000),
        data: payload,
        chainID: new ChainID('D')
        
    });
    
    console.log("transaction.getChainID() " + transaction.getChainID());
    
    
    await refreshAccount();

    const { sessionId /*, error*/ } = await sendTransactions({
      transactions: transaction,
      transactionsDisplayInfo: {
        processingMessage: 'Processing Pong transaction',
        errorMessage: 'An error has occured during Pong',
        successMessage: 'Pong transaction successful'
      },
      redirectAfterSign: false/*,
      sendTransaction P*/

    });
    if (sessionId != null) {
      setTransactionSessionId(sessionId);
    }
    console.log('Mint');
  };

  const sendDebugQuery = async () => {
  
    console.log('getDurationTimestamp');

    const query = new Query({
      address: new Address(contractAddress),
      func: new ContractFunction('getDurationTimestamp')
      /*args: [BytesValue.fromHex('0x01')]*/
    });
    const proxy = new ProxyProvider(network.apiAddress);
    proxy
      .queryContract(query)
      .then(({ returnData }) => {
        const [encoded] = returnData;
        console.log('return data getDurationTimestamp : ' + returnData)
        console.log('return data getDurationTimestamp [encoded] : ' + encoded)
        console.log('return data getDurationTimestamp parseint[encoded] : ' + parseInt(encoded))
        
        /*switch (encoded) {
          case undefined:
            setHasPing(true);
            break;
          case '':
            setSecondsLeft(0);
            setHasPing(false);
            break;
          default: {
            const decoded = Buffer.from(encoded, 'base64').toString('hex');
            setSecondsLeft(parseInt(decoded, 16));
            setHasPing(false);
            break;
          }
        }*/
      })
      .catch((err) => {
        console.error('Unable to call VM query', err);
      });
  }

 
  const pongAllowed = secondsLeft === 0 && !hasPendingTransactions;
  const notAllowedClass = pongAllowed ? '' : 'not-allowed disabled';

  const timeRemaining = moment()
    .startOf('day')
    .seconds(secondsLeft || 0)
    .format('mm:ss');




    
    const ComponentPil = (props : any) => {
      const [loading, setLoading] = React.useState(false);
      const [data, setData] = React.useState();
      const [error, setError] = React.useState();
    
      React.useEffect(() => {
        (async () => {
          setLoading(true);
          try {

            const res = await fetch(`https://petstore.swagger.io/v2/pet/${props.id}`, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
              },
              credentials: 'include',
            });
            const data = await res.json();
            

            setData(data);
            } catch (err) {
              //setError(err);
            } 
            setLoading(false);
        })();
      }, [props.id]);
    
      return (
            <div className="App">
              {/* <img src={data.image} alt={data.name} />*/}
              <h3>{data}</h3> 
              {/* <ul>
                <li>
                  <strong>id:</strong> {data.id}
                </li>
                <li>
                  <strong>status:</strong> {data.status}
                </li>
              </ul> */}
            </div>
          );
    };




    // const PetDetails = (props : any) => {
    //   // useOperation is called right away as an effect
    //   // const { loading, error, data } = useOperation('getPetById', props.id);
    //   const { loading, error, data } = useOperation('listPets');
    //   // useOperationMethod returns a method you can call
    //   const [deletePetById, deleteState] = useOperationMethod('deletePetById');
    
    //   if (loading || !data) {
    //     return <div>Loading...</div>;
    //   }
    
    //   if (error) {
    //     return <div>Error: {error}</div>;
    //   }
    
    //   return (
    //     <div className="App">
    //       <img src={data.image} alt={data.name} />
    //       <h3>{data.collection}</h3>
    //       <ul>
    //         <li>
    //           <strong>id:</strong> {data.id}
    //         </li>
    //         <li>
    //           <strong>status:</strong> {data.status}
    //         </li>
    //       </ul>
    //       <button onClick={() => deletePetById(data.id)} disabled={deleteState.loading}>
    //         Delete
    //       </button>
    //       {deleteState.response && <p>Success!</p>}
    //       {deleteState.error && <p>Error deleting pet: {deleteState.error}</p>}
    //     </div>
    //   );
    // };

  return (
    <>
     <input type="number" min={1} max={10}></input>       
     <button > Mint </button>
    
      {/* <ComponentPil id={1} /> */}
      <NftList server={servers}></NftList>
      {/* <PersonList ></PersonList>
       */}

     <Card style={{ width: '18rem' }}>
     
      <Card.Header>Collection : </Card.Header>
        
      <Card.Img variant="top" src={NftPlaceElrond}/>
      <Card.Body>
        <Card.Text>
          Click on the following button to mint one or several NFTs using our Smart Contract.
        </Card.Text>
        <Button variant="dark" size="lg" onClick={sendMintTransaction}>Buy</Button>{' '}
     
        {/* <Button variant="primary">Go somewhere</Button> */}
      </Card.Body>
    </Card>
     
     
     <div className='d-flex mt-4 justify-content-center'>       
            
      
      {hasPing !== undefined && (
        <>
          {hasPing && !hasPendingTransactions ? (
            <div className='action-btn' onClick={sendPingTransaction}>
              <button className='btn'>
                <FontAwesomeIcon icon={faArrowUp} className='text-primary' />
              </button>
              <a href='/' className='text-white text-decoration-none'>
                Ping
              </a>
              
            </div>
            
            
            

          ) 
            : (
            <>
              <div className='d-flex flex-column'>
                <div
                  {...{
                    className: `action-btn ${notAllowedClass}`,
                    ...(pongAllowed ? { onClick: sendPongTransaction } : {})
                  }}
                >
                  <button className={`btn ${notAllowedClass}`}>
                    <FontAwesomeIcon
                      icon={faArrowDown}
                      className='text-primary'
                    />
                  </button>
                  <span className='text-white'>
                    {pongAllowed ? (
                      <a href='/' className='text-white text-decoration-none'>
                        Pong
                      </a>
                    ) : (
                      <>Pong</>
                    )}
                  </span>
                </div>
                {!pongAllowed && !hasPendingTransactions && (
                  <span className='opacity-6 text-white'>
                    {timeRemaining} until able to Pong
                  </span>
                )}
              </div>
            </>
          )}
        </>
      )     
      }
    </div>
    </>
   
  );
};

export default Actions;
