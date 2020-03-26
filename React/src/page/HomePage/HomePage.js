import React, {Component} from 'react';
import './style.scss'
import {Layout} from 'antd'

import HeaderCom from '../../components/Header/HeaderCom'
import ContentCom from '../../components/HomeContent/ContentCom'
import FooterCom from '../../components/Footer/FooterCom'


const {Header, Footer, Content} = Layout

class HomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className='home-page'>
        <Header>
          <HeaderCom></HeaderCom>
        </Header>
        <Content>
          <ContentCom> </ContentCom>
        </Content>
        <Footer>
          <FooterCom> </FooterCom>
        </Footer>
      </div>
    );
  }
}

export default HomePage;
