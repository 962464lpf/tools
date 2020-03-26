import React, {Component} from 'react'
import {HashRouter as Router} from 'react-router-dom'

import './style.scss'
import {Layout, Icon} from 'antd';

import HeaderCom from '../../components/Header/HeaderCom'
import NavMenu from '../../components/NavMenu/NavMenu'
import LayoutCount from '../../components/LayoutContent/LayoutContent'

const {Sider, Content} = Layout;


class LayoutPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      collapsed: false
    }
  }

  toggleCollapsed = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    })
  }

  render() {
    return (
      <Router>
        <div className='layout-page'>
          <HeaderCom> </HeaderCom>
          <div className='content'>
            <Icon type={this.state.collapsed ? 'arrow-right' : 'arrow-left'} onClick={this.toggleCollapsed}
                  className={this.state.collapsed ? 'spread' : 'folding'}></Icon>
            <Layout>
              <Sider className='left' trigger={null} collapsible collapsed={this.state.collapsed}>
                <NavMenu collapsed={this.state.collapsed}> </NavMenu>
              </Sider>
              <Content className='right'>
                <LayoutCount> </LayoutCount>
              </Content>
            </Layout>
          </div>
        </div>
      </Router>
    );
  }
}

export default LayoutPage;
