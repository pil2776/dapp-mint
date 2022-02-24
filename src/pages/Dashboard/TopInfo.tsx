import * as React from 'react';
import { useGetAccountInfo, DappUI, useGetNetworkConfig } from '@elrondnetwork/dapp-core';

import { contractAddress } from 'config';
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

const TopInfo = () => {
  const { address, account } = useGetAccountInfo();
  const { network } = useGetNetworkConfig();
  const [leftToMint, setleftToMint] = React.useState<number>();
 
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


  return (
    <div className='text-dark text-left' data-testid='topInfo'>
      <div className='mb-4'>
        <span className='opacity-6 mr-1'>Contract address:</span>
        <span data-testid='contractAddress'> {contractAddress}</span>
      </div>
      <div>
      <div className='mb-4'>
        <span className='opacity-6 mr-1'>Your Account balance:</span>
        <span>
          <DappUI.Denominate value={account.balance} data-testid='balance' />
        </span>
      </div>
      </div>
      <div>
      <div className='mb-4'>
        <span className='opacity-6 mr-1'>Left to mint : </span>
        <span data-testid='leftToMint'> {leftToMint} / 10</span>     
      </div>
      </div>      
    </div>
  );
};

export default TopInfo;
