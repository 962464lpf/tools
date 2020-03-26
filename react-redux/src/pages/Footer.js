import React, { Component } from 'react'
import '../style/footer.scss'
import {createHashHistory} from 'history'
const history = new createHashHistory()
export class Footer extends Component {
  constructor(props) {
    super(props)
  
    this.state = {
       
    }
  }

  jump = (path) => {
    history.push(path)
  }
  
  render() {
    return (
      <div className='footer'>
        <p onClick={this.jump.bind(this, '/base/base1')}>base1</p>
        <p onClick={this.jump.bind(this, '/base/base2')}>base2</p>
        <p onClick={this.jump.bind(this, '/base/base3')}>base3</p>
      </div>
    )
  }
}

export default Footer
