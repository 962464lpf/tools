import React, { Component } from 'react';
import {createHashHistory} from 'history'
import './Header.scss'
import {Row, Col} from 'antd'
import { connect } from 'react-redux'


const history = createHashHistory()
class HeaderCom extends Component {
  constructor(props) {
    super(props);//修改this指向
    this.state = {  };
  }

  routingHop (route) {
    history.push(route)
  }

  changeName = () => {
    this.props.changeNamess('lpf')
  }
  componentDidMount () {
    console.log(this.props)
  }

  render() {
    return (
      <header>
        <Row>
          <Col span={8}>
            <div onClick={(e) => this.routingHop('/')}>{this.props.custom.logo}</div>
          </Col>
          <Col span={8} offset={8}>
            <div className='fr mr20' >
              <span className='pr20 sep curp'>{this.props.name.name}</span>
              <span className='pr20 pl20 sep curp' onClick={this.changeName}>改变name</span>  
              <span className='pr20 pl20 sep curp' onClick={(e) => this.routingHop('/bed/custom')}>定制首页</span>
              <span className='pr20 pl20 sep curp'>English</span>
              <span className='pr20 pl20 curp' onClick={(e) => this.routingHop('/loginOut')}>注销</span>
            </div>
          </Col>
        </Row>
      </header>
    );
  }
}


const mapStateToProps = (state) => {
  return {
    name: state.changeName,
    custom:state.changeCustom
  }
}
const mapDispatchToProps = (dispatch) => {
  return {
    changeNamess: (name) => {
      dispatch({ type: 'DECREMENT', name })
    }
  }
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HeaderCom);