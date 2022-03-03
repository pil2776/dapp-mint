import React from 'react';
import axios from 'axios';
import { contractAddress, servers } from 'config';

class NftCollection extends React.Component {
  state = {
    collections: []
  }

  componentDidMount() {
   
    axios.get(servers+"collections?size=1&creator="+contractAddress)
    .then(res => {
        res.data.sort(function(a, b) {
        return a.timestamp > b.timestamp;
      });

      const collections = res.data[0];

      this.setState({ collections });
    })
  }

  render(){    
    return (
      <legend style={{fontSize: "0.9rem", paddingBottom: "10px", textAlign: "right"}}>
         { this.state.collections.collection }    
      </legend>
    )
  }
}

export default NftCollection;
