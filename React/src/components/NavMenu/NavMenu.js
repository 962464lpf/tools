import React, { Component } from 'react'
import './style.scss'
import axios from 'axios'
import { createHashHistory } from 'history'


import { Menu, Icon } from 'antd';
const SubMenu = Menu.SubMenu;
const history = createHashHistory()


class NavMenu extends Component {
  constructor(props) {
    super(props)
    this.state = {
      menuData: [],
      selectedKeys: ['1-1'],
      openKeys: ['1']
    }
    this.rootSubmenuKeys = ['1', '2', '3', '4', '5', '6']
  }

  onOpenChange = (openKeys) => {
    const latestOpenKey = openKeys.find(key => this.state.openKeys.indexOf(key) === -1)
    if (this.rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
      this.setState({ openKeys });
    } else {
      this.setState({
        openKeys: latestOpenKey ? [latestOpenKey] : [],
      });
    }
  }

  jumpRoute = (path) => {
    history.push(path)
  }
  componentDidMount() {
    axios.get('./menudataCn.json').then(data => {
      let menuData = data.data.data
      this.setState({
        menuData
      })
    })
  }



  render() {
    return (
      <div className="nav-menu" >

        <Menu openKeys={this.state.openKeys}
          mode="inline" theme="light" onOpenChange={this.onOpenChange}>
          {
            this.state.menuData.map(item => {
              if (item.children && item.children.length) {
                return (
                  <SubMenu key={item.id} title={<span><Icon type={item.icon} /><span>{item.name}</span></span>}>
                    {
                      item.children.map((childItem) => {
                        let menuItem
                        if (!childItem.children) {
                          menuItem = <Menu.Item key={childItem.id} onClick={(e) => this.jumpRoute(childItem.path)}>{childItem.name}</Menu.Item>
                        } else {
                          // 暂时没有三级
                        }
                        return menuItem
                      })
                    }
                  </SubMenu>
                )
              } else {
                return (
                  <Menu.Item key={item.id}>
                    <Icon type={item.icon} />
                    <span>{item.name}</span>
                  </Menu.Item>
                )
              }
            })
          }
        </Menu>
      </div>
    )
  }
}

export default NavMenu