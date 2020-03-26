import React, { Component } from 'react'
import develoging from '../../images/devp.png'



class Developing extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <img src={develoging} alt="" style={{ width: '100%', height: '100%' }}></img>
    );
  }
}

export default Developing;