import React from 'react';
import axios from 'axios';
import { contractAddress, servers, creator } from 'config';

class NftList extends React.Component {
  state = {
    nfts: []
  }

  componentDidMount() {

    
//https://devnet-api.elrond.com/collections?size=1&creator=erd1qqqqqqqqqqqqqpgqpfpzdydn6f4hcya8rzqvuecpgdyezg5snepsthwevy
    axios.get(servers+"nfts")
    .then(res => {
      const nfts = res.data;
      this.setState({ nfts });
    })
  }

  render() {
    return (
      <ul>
           { this.state.nfts.map(nft => <li>{ nft.collection }</li>) }
    
     
        {/* {this.state.persons.filter(person => (person.id == 1).map(name => (
          <li>
            {name}
          </li>
        )))}  */}
      </ul>
    )
  }
}

export default NftList;
