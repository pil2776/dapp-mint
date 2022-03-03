import * as React from 'react';
import {
  transactionServices,
  useGetAccountInfo,
  refreshAccount,
  useGetNetworkConfig
} from '@elrondnetwork/dapp-core';
import {
  Address,
  ContractFunction, 
  Transaction,
  GasLimit,
  TransactionPayload,
  Balance,
  ChainID,
  U8Value,
} from '@elrondnetwork/erdjs';


import { contractAddress} from 'config';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card'
import NftPlaceElrond from './../../../assets/img/Elrond-NFT-space.jpg';
import NftCollection from 'api/NftCollection';


const Actions = () => {
    
  const /*transactionSessionId*/ [, setTransactionSessionId] = React.useState<string | null>(null);
  
  const { sendTransactions } = transactionServices; 

  const sendMintTransaction = async () => {
    
    const func = new ContractFunction("mint");
    const args = [new U8Value(1)];
  
    const payload = TransactionPayload.contractCall()
      .setFunction(func)
      .setArgs(args)      
      .build();

    const transaction = new Transaction({
        receiver: new Address(contractAddress),
        value: Balance.egld(1),
        gasLimit: new GasLimit(300000000),
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
          </Card.Body>
      </Card> 
    </div> 
    </>    
  );
};

export default Actions;
