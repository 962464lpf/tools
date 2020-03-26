import React, { Component } from 'react';
import { Carousel } from 'antd'
import './style.scss'
import banner1 from '../../images/banner1.png'
import banner2 from '../../images/banner2.png'
import banner3 from '../../images/banner3.png'
import banner4 from '../../images/banner4.png'

class CarouselCom extends Component {
  constructor(props) {
    super(props);
    this.state = {  };
  }

  render() {
    const bannerArr = [banner1, banner2, banner3, banner4]
    return (
      <Carousel className='my-carouse'>
        {
          bannerArr.map(item => {
            return (
              <div key={item} className='my-carouse-item'>
                <img src={item} alt="" />
              </div>
            )
          })
        }
      </Carousel>
    );
  }
}

export default CarouselCom;