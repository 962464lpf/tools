import React, { Component } from 'react'
import './style.scss'
import { Row, Col } from 'antd'
import FunModuleItem from '../FunModuleItem/FunModuleItem'

import icon from '../../images/href-index.png'


class FunModule extends Component {
  constructor(props) {
    super(props)
    this.state = {
      autoTest: {
        title: '自动化测试',
        module: [
          {
            name: '场景测试',
            src: icon,
            id: 1
          },
          {
            name: '我的测试任务',
            src: icon,
            id: 2
          },
          {
            name: '组件测试',
            src: icon,
            id: 3
          }
        ]
      },
      testManage: {
        title: '测试管理',
        module: [
          {
            name: '测试例管理',
            src: icon,
            id: 1
          },
          {
            name: '测试对象管理',
            src: icon,
            id: 2
          },
          {
            name: '测试任务管理',
            src: icon,
            id: 3
          },
          {
            name: '测试工具管理',
            src: icon,
            id: 4
          }
        ]
      },
      testDesign: {
        title: '自动化测试设计',
        module: [
          {
            name: '场景测试设计',
            src: icon,
            id: 1
          },
          {
            name: '组件测试设计',
            src: icon,
            id: 2
          }
        ]
      }
    }
  }
  render() {
    return (
      <div className="pt20 pb20 pl20 pr20 fun-module">
        <Row gutter={16}>
          <Col span={8}>
            <div className='gutter-box'>
              <FunModuleItem funModule={this.state.autoTest}></FunModuleItem>
            </div>
          </Col>
          <Col span={8}>
            <div className='gutter-box'>
              <FunModuleItem funModule={this.state.autoTest}></FunModuleItem>
            </div>
          </Col>
          <Col span={8}>
            <div className='gutter-box'>
              <FunModuleItem funModule={this.state.autoTest}></FunModuleItem>
            </div>
          </Col>
        </Row>
      </div >
    )
  }
}

export default FunModule
