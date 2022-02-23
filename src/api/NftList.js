import React from 'react';
import axios from 'axios';

class NftList extends React.Component {
  state = {
    nfts: []
  }

  componentDidMount() {

    const server = this.props.server;
//https://devnet-api.elrond.com/collections?size=1&creator=erd1qqqqqqqqqqqqqpgqpfpzdydn6f4hcya8rzqvuecpgdyezg5snepsthwevy
    axios.get(server+"nfts")
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
