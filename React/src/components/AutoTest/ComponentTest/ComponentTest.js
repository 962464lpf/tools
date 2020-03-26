import React, { Component } from 'react'
import './style.scss'


import { Table } from 'antd'
import { GET } from '../../../Public/require'

class ComponentTest extends Component {
  constructor(props) {
    super(props)
    this.state = {
      componentData: []
    }
  }

  componentDidMount() {
    let url = 'component/getTempById'
    let params = {
      isScenesTemplate: 1
    }
    GET(url, params).then(res => {
      let data = res.data.result_value
      data.forEach(item => {
        item.key = item.id
      })
      this.setState({
        componentData: res.data.result_value
      })
    })
  }

  onChange = (page, pageSize) => {
    console.log(page, pageSize);
  }
  onShowSizeChange(current, pageSize) {
    console.log(current, pageSize)
  }

  operate = (text) => {
    console.log(this.props.history)
    console.log(text)
  }

  // eslint-disable-next-line no-dupe-class-members


  render() {
    const columns = [
      {
        title: '组件名称',
        dataIndex: 'scenesName',
        key: 'name',
        render: text => <b href="#">{text}</b>,
      },
      {
        title: '属性',
        dataIndex: 'categoryName',
        key: 'categoryName',
      },
      {
        title: '描述',
        dataIndex: 'scenesDes',
        key: 'scenesDes',
      },
      {
        title: '操作',
        key: 'action',
        render: (text, record) => (
          <div>
            <span className='curp mr20' onClick={(e) => this.operate(text)}>
              删除
          </span >
            <span className='curp'>
              修改
          </span >
          </div>
        )
      }];

    const pagination = {
      pageSizeOptions: ['10', '20', '30', '40'],
      defaultCurrent: 3,
      total: this.state.componentData.length,
      showQuickJumper: true,
      showSizeChanger: true
    }

    return (
      <Table columns={columns} dataSource={this.state.componentData} pagination={{ ...pagination, onChange: this.onChange, onShowSizeChange: this.onShowSizeChange }} />
    )
  }
}

export default ComponentTest