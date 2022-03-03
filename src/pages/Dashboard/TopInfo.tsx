import * as React from 'react';
import { useGetAccountInfo, DappUI, useGetNetworkConfig } from '@elrondnetwork/dapp-core';

import { contractAddress } from 'config';
import {
  Address,
  ContractFunction,
  ProxyProvider,
  Query,  
} from '@elrondnetwork/erdjs';

const TopInfo = () => {
  const { address, account } = useGetAccountInfo();
  const { network } = useGetNetworkConfig();
  const [leftToMint, setleftToMint] = React.useState<number>();
 
  React.useEffect(() => {  
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
     
        setleftToMint(Number("0x"+decoded));
      })
      .catch((err) => {
        console.error('Unable to call VM query', err);
      });      
    // eslint-disable-next-line react-hooks/exhaustive-deps
  } ,[]);

  return (
    <div className='custom-info text-center' data-testid='topInfo'>
      <div className='mb-4'>
        <span className='opacity-9 mr-1'>Contract address:</span>
        <a href = {'https://devnet-explorer.elrond.com/accounts/' + contractAddress} >        
          <span data-testid='contractAddress'> {contractAddress}</span>
        </a>
      </div>
      <div>
      <div className='mb-4'>
        <span className='opacity-9 mr-1'>Your Account balance:</span>
        <span>
          <DappUI.Denominate value={account.balance} data-testid='balance' />
        </span>
      </div>
      </div>
      <div>
      <div className='mb-4'>
        <span className='opacity-9 mr-1'>Left to mint : </span>

        {/*improvement : get the total amount of token in the collection*/}
        <span data-testid='leftToMint'> {leftToMint} / 50</span>     
      </div>
      </div>      
    </div>
  );
};

export default TopInfo;
