import React, { Component } from 'react'
import './style.scss'
import { createHashHistory } from 'history'



const history = createHashHistory()

class FunModuleItem extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  jumpRoute(src) {
    alert(src)
    history.push(src)
  }

  render() {

    const module = this.props.funModule.module.map((item, index) => {
      return (
        <div className={index % 2 === 0 ? 'left fl pl20 pr20' : 'right fl pl20 pr20'} key={item.id}>
          <p className='curp' onClick={(e) => this.jumpRoute(item.name)}>
          <img src={item.src} alt="" />
          <span>{item.name}</span>
          </p>
        </div>
      )
    })


    return (
      <div className='fun-module-item'>
        <p className='title'>
          <span>{this.props.funModule.title}</span>
        </p>
        <div className='content clearfix'>
          {module}
        </div>
      </div>
    )
  }
}

export default FunModuleItem