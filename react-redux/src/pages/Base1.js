import React, { Component } from 'react'
import {addAfterNameAction, addBeforeNameAction} from '../redux/actions'
import {connect} from 'react-redux'

export class Base1 extends Component {
  constructor(props) {
    super(props)
  
    this.state = {
       
    }
  }

  changeName = (type) => {
    if (type === 'before') {
      this.props.addBeforeNameAction('before')
    } else {
      this.props.addAfterNameAction('after')

    }
  }
  
  render() {
    return (
      <div>
        <p>Base1</p>
        <p>{this.props.name}</p>
        <button onClick={this.changeName.bind(this, 'before')}>beforeName</button>
        <button onClick={this.changeName.bind(this, 'after')}>afterName</button>

      </div>
    )
  }
}

const mapState = (state) => ({
  name: state.changeNameAction
})



export default connect(mapState, {addBeforeNameAction, addAfterNameAction})(Base1)
