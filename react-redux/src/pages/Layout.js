import React, { Component } from 'react'
import {  Route,  } from 'react-router-dom'

import Footer from './Footer'
import Base1 from './Base1'
import Base2 from './Base2'
import Base3 from './Base3'
// import {} from ''

export class Layout extends Component {
  constructor(props) {
    super(props)
  
    this.state = {
       
    }
  }
  
  render() {
    return (
      <div className='layout'>
        <div>header</div>
        <div>
          <Route path='/base/base1' component={Base1}></Route>
          <Route path='/base/base2' component={Base2}></Route>
          <Route path='/base/base3' component={Base3}></Route>
        </div>
        <div>
          <Footer></Footer>
        </div>
      </div>
    )
  }
}

export default Layout
