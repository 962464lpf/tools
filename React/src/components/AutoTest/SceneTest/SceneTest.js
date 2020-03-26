import React, { Component } from 'react'
import { createHashHistory } from 'history'
import './style.scss'
import { Row, Col } from 'antd'
import { GET, GetFile } from '../../../Public/require'


const history = createHashHistory()





class SceneTest extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sceneList: []
    }
  }

  testScene = (scene) => {
    console.log(scene)
    history.push('/bed/autotest/compList', scene)
  }

  getIconList = () => {
    this.state.sceneList.forEach(item => {
      let urlIcon = 'testcase/downloadImage'
      let paramsIcon = {
        userId: 1005,
        sessionid: '2eb209b9-1a94-4a60-ad70-7d5d482a4c10',
        path: item.icon,
        ifIcon: 1
      }
      GetFile(urlIcon, paramsIcon).then(res => {
        let blob = new Blob([res.data], { type: 'image/jpeg' })
        let url = window.URL.createObjectURL(blob)
        item.iconSrc = url
        this.setState({
          sceneList: this.state.sceneList
        })
      })
    })
  }
  getScenesList = () => {
    let url = 'scenes/getScenesListByFilters'
    let params = {
      filterStr: {

      }
    }
    GET(url, params).then(res => {
      let data = res.data.result_value.scenesInfoList
      this.setState({
        sceneList: data
      })
      this.getIconList()
    })
  }
  componentDidMount() {
    this.getScenesList()
    console.log(this.props.scene)
  }


  render() {
    return (
      <div className='scene-test'>
        <Row gutter={16}>
          {
            this.state.sceneList.map(item => {
              return (
                <Col className="gutter-row" span={4} key={item.scenesName}>
                  <div className="gutter-box curp" onClick={() => this.testScene(item)}>
                    <img src={item.iconSrc} alt="" />
                    <p>{item.scenesName}</p>
                  </div>
                </Col>
              )
            })
          }

        </Row>
      </div>
    )
  }
}




export default SceneTest