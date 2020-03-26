import React, { Component } from 'react';
import { Table, Button } from 'antd'
import './TaskList.scss'
import { GET } from '../../../Public/require'
import {createHashHistory} from 'history'
const history = createHashHistory()

class TaskList extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      taskList:[]
     };
  }
  
  getTaskList(){
    GET('/scenes/getTaskList').then(res=>{
      this.setState({
        taskList: res.data.result_value
      })
    })
  }

  checkReport = (id) => {
    console.log(id)
    history.push('/bed/autotest/testreport')
  }

  componentDidMount(){
    this.getTaskList()
  }
  render() {
    const data = this.state.taskList
    const arr = [1,2,3,4,5,6]
    const liItem = arr.map((num) =>{
      return <li>{num}</li>
    })
    const columns = [
      {
        title: '任务ID',
        dataIndex: 'id',
        key: 'id'
      },
      {
        title: '任务名称',
        dataIndex: 'taskName',
        key: 'taskName',
      },
      {
        title: '执行人',
        dataIndex: 'taskManager',
        key: 'taskManager',
      },
      {
        title: '执行日期',
        dataIndex: 'createTime',
        key: 'createTime',
      },
      {
        title: '执行状态',
        dataIndex: 'status',
        key: 'status',
      },
      {
        title: '操作',
        key: 'rowKey',
        render: (rowKey) => (
          <span>
            <Button onClick={this.checkReport.bind(this, rowKey)}>查看报告</Button>
          </span>
        ),
      },
    ];
    return (
      <div>
        <Table columns={columns} dataSource={data} rowKey={record=>record.id}/>
        {
          data.length>0?(
            <h3>有数据！！！</h3>
          ):(
            <h3>没有数据！！！</h3>
          )
        }
        <ul>
          {liItem}
        </ul>
      </div>
    );
  }
}

export default TaskList;