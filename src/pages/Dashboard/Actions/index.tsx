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
  U8Value,
  Egld
} from '@elrondnetwork/erdjs';
import { faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import moment from 'moment';
import { contractAddress} from 'config';
import axios from 'axios';


import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card'
import { Container, Row, Col } from 'react-bootstrap'
import NftPlaceElrond from './../../../assets/img/Elrond-NFT-space.jpg';
import PersonList from 'api/PersonList';
import NftList from 'api/NftList';
import NftCollection from 'api/NftCollection';
import nftOnMarket from './../../../assets/img/nft-gif.gif';

const Actions = () => {
  const account = useGetAccountInfo();
  const { hasPendingTransactions } = useGetPendingTransactions();
  const { network } = useGetNetworkConfig();
  const { address } = account;

  const [secondsLeft, setSecondsLeft] = React.useState<number>();
  const [leftToMint, setleftToMint] = React.useState<number>();
 
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
        console.log("getTimeToPong");
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


  React.useEffect(() => {
    console.log('getTotalTokensLeft');

    const query = new Query({
      address: new Address(contractAddress),
      func: new ContractFunction('getTotalTokensLeft')
      /*args: [BytesValue.fromHex('0x01')]*/
    });
    const proxy = new ProxyProvider(network.apiAddress);
    proxy
      .queryContract(query)
      .then(({ returnData }) => {       
        const [encoded] = returnData;
        let decoded = Buffer.from(encoded, 'base64').toString('hex');
        setleftToMint(parseInt(decoded));
        console.log(decoded)        
      })
      .catch((err) => {
        console.error('Unable to call VM query', err);
      });      
    // eslint-disable-next-line react-hooks/exhaustive-deps
  } ,[]);



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
        processingMessage: 'Processing Mint transaction',
        errorMessage: 'An error has occured during Mint',
        successMessage: 'Mint transaction successful'
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
  
    console.log('getTotalTokensLeft');

    const query = new Query({
      address: new Address(contractAddress),
      func: new ContractFunction('getTotalTokensLeft')
      /*args: [BytesValue.fromHex('0x01')]*/
    });
    const proxy = new ProxyProvider(network.apiAddress);
    proxy
      .queryContract(query)
      .then(({ returnData }) => {       
        const [encoded] = returnData;
        let decoded = Buffer.from(encoded, 'base64').toString('hex');
        setleftToMint(parseInt(decoded));
        console.log(decoded)        
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

  return (
    <>
   <div className="d-flex justify-content-center">
        <Card className="custom-card-color" style={{ width: '20rem' }}>     
          <Card.Header className="custom-card-header" >         
            <NftCollection > </NftCollection>
          </Card.Header>        
          <Card.Img className="custom-card-img-top" custom-variant="top" src={NftPlaceElrond}/>
          <Card.Body>
            <Card.Text style={{color: "white"}}>
              Click on the following button to mint one or several NFTs using our Smart Contract.
            </Card.Text>
            <div className="d-grid gap-2">
              <Button className="custom-bt-color" variant="light"  onClick={sendMintTransaction}>Buy (1 egld)</Button>{' '}
            </div>
            {/*  <Button variant="primary">Go somewhere</Button> */}
          </Card.Body>
        </Card> 
        </div>

      {/* <Col><img className="custom-img-show" src={nftOnMarket} alt="loading..." /></Col>
       */}
   
    
    
     {/* <input type="number" min={1} max={10}></input>       
     <button  onClick={sendDebugQuery} > Mint </button>    
     */}

  
 
    
     {/* <div className='d-flex mt-4 justify-content-center'> 
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
    </div>*/}
    </> 
   
  );
};

export default Actions;
