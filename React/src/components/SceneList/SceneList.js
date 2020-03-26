import React, { Component } from 'react';
import './style.scss'
import { Row, Col } from 'antd'
import SceneListItem from '../SceneListItem/SceneListItem'



import sceneSrc1 from '../../images/icon-scene-1.png'
import sceneSrc2 from '../../images/icon-scene-2.png'
import sceneSrc3 from '../../images/icon-scene-3.png'

import sceneSrc4 from '../../images/icon-scene-4.png'


class SceneList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sceneList: [
        {
          id: 1,
          src: sceneSrc1,
          name: '场景1'
        },
        {
          id: 2,
          src: sceneSrc2,
          name: '场景2'
        },
        {
          id: 3,
          src: sceneSrc3,
          name: '场景3'
        },
        {
          id: 4,
          src: sceneSrc4,
          name: '场景4'
        }
      ]
    };
  }

  enterScene(index) {
    alert(index)
  }
  render() {

    const sceneList = this.state.sceneList.map((item => {
      return (
        <Col span={4} key={item.id}>
          <div className='gutter-box curp' onClick={(e) => this.enterScene(item.id, e)}>
            <SceneListItem itemInfo={item}></SceneListItem>
          </div>
        </Col>
      )
    }))

    return (
      <div className='pt20 pb20 pl20 pr20 sceneList'>
        <Row gutter={16}>
          {sceneList}
        </Row>
      </div>
    )
  }
}

export default SceneList;

