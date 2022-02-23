import React from 'react';
import axios from 'axios';

class PersonList extends React.Component {
  state = {
    persons: []
  }

  componentDidMount() {
    axios.get(`https://jsonplaceholder.typicode.com/users`)
    .then(res => {
      const persons = res.data;
      this.setState({ persons });
    })
  }

  render() {
    return (
      <ul>
           { this.state.persons.map(person => <li>{ person.name }</li>) }
    
     
        {/* {this.state.persons.filter(person => (person.id == 1).map(name => (
          <li>
            {name}
          </li>
        )))}  */}
      </ul>
    )
  }
}

export default PersonList;
