import React, { Component } from 'react';
import './style.scss'



class ContentTitle extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div className='content-title pl20'>
        <img src={this.props.src} alt="" />
        <span>{this.props.title}</span>
      </div>
    );
  }
}

export default ContentTitle;