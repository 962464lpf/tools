import React, { Component } from 'react';
import './Custom.scss'
// import axios from 'axios'
import { connect } from 'react-redux'
import { Form, Icon, Input, Button } from 'antd';
class Custom extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      
     };
  }
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.changeCustom(values)
      }
    });
  };
  componentDidMount () {
    const {logo,brand} =this.props.custom
    this.props.form.setFieldsValue({
      logo,brand
    })
    // axios.post().then(res=>{
      
    // })
  }
  render() {
    const { getFieldDecorator} = this.props.form;
    return (
      <div>
       <Form onSubmit={this.handleSubmit} className="login-form">
          <Form.Item label='项目标题'>
          {getFieldDecorator('logo', {
            rules: [{ required: true, message: '请输入项目标题!' }],
          })(
            <Input
              prefix={<Icon type="apple" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="请输入项目标题"
            />,
          )}
          </Form.Item>
          <Form.Item label='版权信息'>
          {getFieldDecorator('brand', {
            rules: [{ required: true, message: '请输入版权信息!' }],
          })(
            <Input
              prefix={<Icon type="twitter" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="请输入版权信息"
            />,
          )}
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" className="login-form-button">
              提交
            </Button>
          </Form.Item>
        </Form>
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    custom:state.changeCustom
  }
}
const mapDispatchToProps = (dispatch) => {
  return {
    changeCustom: (custom) => {
      dispatch({ type: 'all', custom })
    }
  }
}

const CustomPage = Form.create({ name: '' })(Custom);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CustomPage)
