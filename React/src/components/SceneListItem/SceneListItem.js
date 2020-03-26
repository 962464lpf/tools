import React, { Component } from 'react'
import './style.scss'



class SceneListItem extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  render() {
    return (
      <div className="scene-list-item">
        <p>{this.props.itemInfo.name}</p>
        <img src={this.props.itemInfo.src} alt="" />
      </div>
    )
  }
}

export default SceneListItem