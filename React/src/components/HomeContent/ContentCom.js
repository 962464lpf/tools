import React, { Component } from 'react';
import './style.scss'
import CarouselCom from '../Carousel/CarouselCom'
import ContentTitle from '../ContentTitle/ContentTitle'
import SceneList from '../SceneList/SceneList'
import FunModule from '../FunMoule/FunModule'


import sceneSrc from '../../images/list-index.png'
import funSrc from '../../images/href-index.png'


class ContentCom extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }
  render() {
    return (
      <div>
        <CarouselCom></CarouselCom>
        <div>
          <ContentTitle title='场景列表' src={sceneSrc}></ContentTitle>
          <SceneList></SceneList>
        </div>
        <div>
          <ContentTitle title='功能模块' src={funSrc}></ContentTitle>
          <FunModule></FunModule>
        </div>
      </div>
    );
  }
}

export default ContentCom;