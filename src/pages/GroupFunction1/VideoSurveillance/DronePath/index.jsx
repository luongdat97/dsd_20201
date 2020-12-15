import React, { Component } from 'react';
import GoogleMapReact from 'google-map-react';
import StyleVideoSurveillance, { droneHoverStyle, droneStyle, treeHoverStyle, treeStyle } from "./index.style";
import { Row, Col, Modal, Button, Popover, Image, Radio, Steps, Space, Select, Empty } from 'antd';
import { IMAGES } from '../../../../constants';
import ReactPlayer from 'react-player'
import captureVideoFrame from "capture-video-frame";

const { Option } = Select;
const {Step} = Steps;

class VideoSurveillance extends Component {
  constructor(props) {
    super(props);
    this.state = {
      center: {
        lat: 20.91507,
        lng: 105.74766
      },
      zoom: 16,
      dronePlaces: [
        { id: 1, position: { lat: 20.91507, lng: 105.74766 } },
        { id: 2, position: { lat: 20.91907, lng: 105.74766 } },
        { id: 3, position: { lat: 20.91707, lng: 105.74966 } }
      ],
      selectedDroneId: '',
      display: 'map',
      video: {
        captureFrame: null,
        playing: false,
      },
      capturedImages: []
    };
  
  }

  onCenterChange = (center) => {
    this.setState({ center: center });
  }
  onZoomChange = (zoom) => {
    this.setState({ zoom: zoom });
  }
  onBoundsChange = (center, zoom) => {
    this.setState({ center: center, zoom: zoom });
  }
  onSelectedDroneIdChange = (droneId) => {
    let droneInfo = this.state.dronePlaces.find(droneInfo => droneInfo.id == droneId)
    this.setState({ selectedDroneId: droneId, center: droneInfo.position });
  }
  onDisplayChange = (display) => {
    this.setState({display: display});
  }

  delCapturedImage = (imgUrl) => {
    let newCapturedImages = [...this.state.capturedImages];
    let index = newCapturedImages.indexOf(imgUrl);
    if (index !== -1) {
      newCapturedImages.splice(index, 1);
      this.setState({capturedImages: newCapturedImages});
    }
  }

  render() {

    return (
      <div style={{ background: '#ffffff' }}>
        <StepSurveillance currentStep={2} />
        <Row direction="horizontal">
          <Col span={4} style={{paddingRight: 15}}>

            <Space direction="vertical">
              <h3>Drone DR043 </h3>
              <h3>Vị trí hiện tại:</h3>
              <p>
                <span>Kinh độ: 100</span>
                <br />
                <span>Vĩ độ: 80</span>
              </p>
              
              {this.state.display==="video" && 
                <Button onClick={() => {
                  const frame = captureVideoFrame(this.player.getInternalPlayer())
                  this.setState((prevState) => ({
                     video: { ...prevState.video, captureFrame: frame.dataUri },
                    capturedImages: [...this.state.capturedImages, frame.dataUri]
                  }))
                }}> <i class="far fa-camera"></i> Chụp ảnh vị trí hiện tại</Button>
              }
              
              {this.state.video.captureFrame && this.state.display==="video" && 
                <div>
                  <Space direction="vertical">
                    <Image src={this.state.video.captureFrame} width='100%' />
                    <ReportProblem imgProblemUrl={this.state.video.captureFrame}></ReportProblem>
                  </Space>
                </div>
              }
              
            </Space>

          </Col>
          <Col span={20}>
            <Radio.Group defaultValue='map' buttonStyle="solid" onChange={(e) => { this.onDisplayChange(e.target.value); console.log(e) }}>
              <Radio.Button value='map'><i class="far fa-map"></i> Xem bản đồ</Radio.Button>
              <Radio.Button value='video'><i class="far fa-video"></i> Theo dõi Video </Radio.Button>
              <Radio.Button value='image'><i class="far fa-image"></i> Ảnh chụp được </Radio.Button>

            </Radio.Group>
            <div style={{ display: this.state.display === 'map' ? 'block' : 'none' }}>
              <DroneInfoMap
                center={this.state.center}
                zoom={this.state.zoom}
                selectedDroneId={this.state.selectedDroneId}
                onBoundsChange={this.onBoundsChange}
                onSelectedDroneIdChange={this.onSelectedDroneIdChange}
              />
            </div>
            <div style={{ display: this.state.display === 'video' ? 'block' : 'none' }}>

              <ReactPlayer
                ref={player => { this.player = player }}
                url="https://phan-tan-enable-cors.herokuapp.com/https://drive.google.com/uc?export=download&id=1QhHp-mSPtFQMvPAImvE2M7-LmeqbQ_sj"
                playing={this.state.video.playing}
                width='100%'
                height='auto'
                controls
                config={{
                  file: {
                    attributes: {
                      crossorigin: 'anonymous'
                    }
                  }
                }}
              />
            </div>
            <div style={{ display: this.state.display === 'image' ? 'block' : 'none', marginTop: 15 }}>
              {this.state.capturedImages.length ? null: <Empty style={{marginTop: 200}}></Empty>}
              <CapturedImage imgUrls={this.state.capturedImages} delCapturedImage = {this.delCapturedImage}/>
            </div>
          </Col>
        </Row>
      </div>
    )
  }
};

class DroneInfoMap extends Component {
  constructor(props) {
    super(props);
  }

  createMapOptions(maps) {
    // next props are exposed at maps
    // "Animation", "ControlPosition", "MapTypeControlStyle", "MapTypeId",
    // "NavigationControlStyle", "ScaleControlStyle", "StrokePosition", "SymbolPath", "ZoomControlStyle",
    // "DirectionsStatus", "DirectionsTravelMode", "DirectionsUnitSystem", "DistanceMatrixStatus",
    // "DistanceMatrixElementStatus", "ElevationStatus", "GeocoderLocationType", "GeocoderStatus", "KmlLayerStatus",
    // "MaxZoomStatus", "StreetViewStatus", "TransitMode", "TransitRoutePreference", "TravelMode", "UnitSystem"
    return {
      mapTypeId: maps.MapTypeId.SATELLITE,
    };
  }
  handleApiLoaded = (map, maps) => {

    const flightPlanCoordinates = [
      { lat: 20.91607, lng: 105.74166 },
      { lat: 20.91507, lng: 105.74766 },
      { lat: 20.91707, lng: 105.75366 },
      { lat: 20.91807, lng: 105.76366 },
    ];
    const flightPath = new maps.Polyline({
      path: flightPlanCoordinates,
      geodesic: true,
      strokeColor: "#FF0000",
      strokeOpacity: 1.0,
      strokeWeight: 4,
    });

    flightPath.setMap(map);
  };
  render() {
    return (
      // Important! Always set the container height explicitly
      <div style={{ height: '100vh', width: '100%' }}>
        <GoogleMapReact
          bootstrapURLKeys={{ key: "AIzaSyAkeBYx0fsFBioJeXada8dJAd3eVrDtYTI" }}
          center={this.props.center}
          zoom={this.props.zoom}
          onBoundsChange={this.props.onBoundsChange}
          options={this.createMapOptions}
          hoverDistance={20}
          yesIWantToUseGoogleMapApiInternals
          onGoogleApiLoaded={({ map, maps }) => this.handleApiLoaded(map, maps)}
        >
          <TreeIcon
            id={2}
            lat={20.91507}
            lng={105.74766}
          />
          <TreeIcon
            id={2}
            lat={20.91607}
            lng={105.74166}
          />
          <TreeIcon
            id={2}
            lat={20.91707}
            lng={105.75366}
          />
          <TreeIcon
            id={2}
            lat={20.91807}
            lng={105.76366}
          />
          <DroneIcon
            id={1}
            lat={20.91607}
            lng={105.74966}
            checked={1 == this.props.selectedDroneId}
          />
        </GoogleMapReact>
      </div>
    );
  }
}

class DroneIcon extends Component {
  render() {
    const droneStyleCss = this.props.checked ? droneHoverStyle : droneStyle;
    return (
      <StyleVideoSurveillance>
        <div>
          <DronePopover droneStyleCss={droneStyleCss}></DronePopover>
        </div>
      </StyleVideoSurveillance>
    )
  }
}

class DronePopover extends React.Component {
  state = {
    visible: false,
  };

  hide = () => {
    this.setState({
      visible: false,
    });
  };

  handleVisibleChange = visible => {
    this.setState({ visible });
  };

  render() {
    const content = (
      <div>
        <h4>Drone DR01</h4>
        <p>Vị trí: 20.912, 105.23</p>
      </div>
    );
    return (
      <Popover
        content={content}
        title="Drone"
        visible={this.state.visible}
        onVisibleChange={this.handleVisibleChange}
      >
        <i className="fas fa-drone-alt drone-icon" style={{ ...this.props.droneStyleCss }}></i>
      </Popover>
    );
  }
}

class TreeIcon extends Component {
  render() {
    const treeStyleCss = this.props.checked ? treeHoverStyle : treeStyle;
    return (
      <StyleVideoSurveillance>
        <div>
          <TreePopover treeStyleCss={treeStyleCss}></TreePopover>
        </div>
      </StyleVideoSurveillance>
    )
  }
}

class TreePopover extends React.Component {
  state = {
    visible: false,
  };

  hide = () => {
    this.setState({
      visible: false,
    });
  };

  handleVisibleChange = visible => {
    this.setState({ visible });
  };

  render() {
    const content = (
      <div>
        <h4>Cây trồng bị gãy đổ</h4>
        <p>Vị trí: 20.912, 105.23</p>
        <TreeDetail hidePopover={this.hide} />
      </div>
    );
    return (
      <Popover
        content={content}
        title="Sự cố"
        visible={this.state.visible}
        onVisibleChange={this.handleVisibleChange}
      >
        <i className="fas fa-tree-alt drone-icon" style={{ ...this.props.treeStyleCss }}></i>
      </Popover>
    );
  }
}

class TreeDetail extends React.Component {
  state = { visible: false };

  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  handleOk = e => {
    console.log(e);
    this.setState({
      visible: false,
    });
  };

  handleCancel = e => {
    console.log(e);
    this.setState({
      visible: false,
    });
  };

  render() {
    return (
      <>
        <Button type="primary" onClick={() => { this.showModal(); this.props.hidePopover() }}>
          Xem chi tiết
        </Button>
        <Modal
          title="Tình trạng cây trồng"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          style={{ zIndex: "100 !important" }}
          width={1000}
        >
          <h4>Loại sự cố: cây trồng bị gãy đổ</h4>
          <p>Mức độ: nghiêm trọng</p>
          <p>Vị trí tọa độ: 41.40338, 2.17403</p>
          <p>Hình ảnh thu thập từ drone:</p>
          <Image
            width={700}
            src='https://drive.google.com/uc?export=view&id=11KHIYQZ8I4jGnM0yXtPvRphPuqluKb9K'
          />
        </Modal>
      </>
    );
  }
}

class ReportProblem extends React.Component {
  state = { visible: false };

  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  handleOk = e => {
    Modal.success({
      content: 'Bạn đã báo cáo sự cố thành công!',
    });
    console.log(e);
    this.setState({
      visible: false,
    });
  };

  handleCancel = e => {
    console.log(e);
    this.setState({
      visible: false,
    });
  };

  render() {
    return (
      <>
        <Button type="primary" onClick={() => { this.showModal(); }}>
          Báo cáo sự cố
        </Button>
        <Modal
          title="Báo cáo sự cố"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          style={{ zIndex: "100 !important" }}
          width={700}
        >
          <Space direction="vertical">
            <div>
              <h4>Chọn loại sự cố:</h4>
              <Select defaultValue="Loại sự cố" style={{ width: 120 }}>
                <Option value="1">Gãy đổ</Option>
                <Option value="2">Ngập úng</Option>
                <Option value="3">Khô héo</Option>
                <Option value="4">Sâu bệnh</Option>
                <Option value="5">Chặt phá</Option>
              </Select>
            </div>
            <div>
              <h4>Chọn mức độ cảnh báo:</h4>
              <Select defaultValue="Mức độ" style={{ width: 120 }}>
                <Option value="1">Nghiêm trọng</Option>
                <Option value="2">Trung bình</Option>
                <Option value="3">Bình thường</Option>

              </Select>
            </div>
            <div>
              <p>Vị trí tọa độ: 41.40338, 2.17403</p>
            </div>
          </Space>
          <p>Hình ảnh thu thập từ drone:</p>
          <Image
            width="100%"
            src={this.props.imgProblemUrl}
          />
        </Modal>
      </>
    );
  }
}

class CapturedImage extends React.Component {
  constructor(props){
    super(props);
  }
  render() {
    const listImage = this.props.imgUrls.map((imgUrl) =>   
        <Col span={6}> <Image src={imgUrl} width="100%"></Image>
          <div style={{display: 'flex'}}>
            <div>Ảnh</div>
            <div style={{marginLeft: 'auto'}}>
              <Button onClick={(e) => this.props.delCapturedImage(imgUrl)}>Xóa</Button>
              <ReportProblem imgProblemUrl={imgUrl}></ReportProblem>
            </div>
            
          </div>
          
        </Col>
    )
    return(
      <div>
        <Row gutter={[16, 16]}>
          {listImage}
          
        </Row>
      </div>
    );
    
  }
}

class StepSurveillance extends React.Component {
  render(){
    return(
      <Steps current={this.props.currentStep} style={{marginBottom: 15}}>
        <Step title="Chọn miền giám sát" />
        <Step title="Chọn drone" />
        <Step title="Giám sát" />
      </Steps>
    )
  }
}

export default VideoSurveillance;
