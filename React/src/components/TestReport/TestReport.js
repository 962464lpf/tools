import React, { Component } from 'react'

export class TestReport extends Component {
  constructor(props) {
    super(props)
  
    this.state = {
       
    }
  }

  componentDidMount () {
    console.log(this.props)
  }
  
  render() {
    return (
      <div>
        <p>测试报告</p>
      </div>
    )
  }
}

export default TestReport
