import React, { Component } from 'react';
import './Footer.scss'
import {connect} from 'react-redux'

class FooterCom extends Component {
  constructor(props) {
    super(props);
    this.state = {  };
  }
  componentDidMount () {
    console.log(this.props)
  }
  render() {
    return (
      <footer>{this.props.custom.brand}</footer>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    custom:state.changeCustom
  }
}

export default connect(
  mapStateToProps,

)(FooterCom);