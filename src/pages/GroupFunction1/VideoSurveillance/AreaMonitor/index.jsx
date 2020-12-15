import React, { Component } from 'react';
import GoogleMapReact from 'google-map-react';
import StyleVideoSurveillance, { droneHoverStyle, droneStyle } from "./index.style";
import { Row, Col, Button, Popover, Input, Space, Steps, Table } from 'antd';
import Highlighter from 'react-highlight-words';
import { SearchOutlined } from '@ant-design/icons';

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
      areaPlaces: [
        { id: 1, position: { lat: 20.916897987239217, lng: 105.74661286520765 } },
        { id: 2, position: { lat: 20.916897987239217, lng: 105.75661286520765 } },
        { id: 3, position: { lat: 20.916897987239217, lng: 105.76661286520765 } },
        { id: 4, position: { lat: 20.916897987239217, lng: 105.77661286520765 } },
        { id: 5, position: { lat: 20.916897987239217, lng: 105.78661286520765 } },
        
      ],
      selectedDroneId: '',
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
    let droneInfo = this.state.areaPlaces.find(droneInfo => droneInfo.id == droneId % 5 + 1)
    this.setState({ selectedDroneId: droneId, center: droneInfo.position });
  }

  render() {
    return (
      <div style={{ background: '#ffffff' }}>
        <StepSurveillance currentStep={0} />
        <Row gutter={10}>
          <Col span={4}>

            <h5>Chọn miền giám sát cần theo dõi</h5>

            <AreaList
              onCenterChange={this.onCenterChange}
              onSelectedDroneIdChange={this.onSelectedDroneIdChange}
            />
            <div style={{display: 'flex', justifyContent: 'flex-end', marginTop: 15}}>
              <a href="/tree-video-surveillance/drone-list"><Button type="primary">Tiếp theo</Button></a>
            </div>
            
          </Col>
          <Col span={20}>
            <div>
              <AreaListMap
                center={this.state.center}
                zoom={this.state.zoom}
                selectedDroneId={this.state.selectedDroneId}
                onBoundsChange={this.onBoundsChange}
                onSelectedDroneIdChange={this.onSelectedDroneIdChange}
              />
            </div>
          </Col>
        </Row>
      </div>
    )
  }
};


class AreaListMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listRectangle: []
    }
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

  addRectange = (rectangle) => {
    this.setState({ listRectangle: [...this.state.listRectangle, rectangle] })
  }

  handleApiLoaded = (map, maps) => {
    const rectangle1 = new maps.Rectangle({
      strokeColor: "#FF0000",
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: "#FF0000",
      fillOpacity: 0.2,
      map,
      bounds: {
        north: 20.916897987239217,
        south: 20.913570713572852,
        east: 105.75032504248426,
        west: 105.74661286520765,
      },
    });
    const rectangle2 = new maps.Rectangle({
      strokeColor: "#FF0000",
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: "#FF0000",
      fillOpacity: 0.2,
      map,
      bounds: {
        north: 20.916897987239217,
        south: 20.913570713572852,
        east: 105.76032504248426,
        west: 105.75661286520765,
      },
    });
    const rectangle3 = new maps.Rectangle({
      strokeColor: "#FF0000",
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: "#FF0000",
      fillOpacity: 0.2,
      map,
      bounds: {
        north: 20.916897987239217,
        south: 20.913570713572852,
        east: 105.77032504248426,
        west: 105.76661286520765,
      },
    });
    const rectangle4 = new maps.Rectangle({
      strokeColor: "#FF0000",
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: "#FF0000",
      fillOpacity: 0.2,
      map,
      bounds: {
        north: 20.916897987239217,
        south: 20.913570713572852,
        east: 105.78032504248426,
        west: 105.77661286520765,
      },
    });
    const rectangle5 = new maps.Rectangle({
      strokeColor: "#FF0000",
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: "#FF0000",
      fillOpacity: 0.2,
      map,
      bounds: {
        north: 20.916897987239217,
        south: 20.913570713572852,
        east: 105.79032504248426,
        west: 105.78661286520765,
      },
    });
    
    rectangle1.setMap(map);
    rectangle2.setMap(map);
    rectangle3.setMap(map);
    rectangle4.setMap(map);
    rectangle5.setMap(map);

  };

  render() {
    return (
      // Important! Always set the container height explicitly
      <div style={{ height: '100vh', width: '100%' }}>
        <GoogleMapReact
          bootstrapURLKeys={{ key: "AIzaSyDUJI3UXw2arRqiUIIYaANQtMurg6__hnI"}}
          center={this.props.center}
          zoom={this.props.zoom}
          onBoundsChange={this.props.onBoundsChange}
          options={this.createMapOptions}
          hoverDistance={20}
          yesIWantToUseGoogleMapApiInternals
          onGoogleApiLoaded={({ map, maps }) => this.handleApiLoaded(map, maps)}
        >
        </GoogleMapReact>
      </div>
    );
  }
}





class AreaList extends React.Component {
  state = {
    searchText: '',
    searchedColumn: '',
    
  };

  getColumnSearchProps = dataIndex => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={node => {
            this.searchInput = node;
          }}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }}>
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
    onFilter: (value, record) =>
      record[dataIndex]
        ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
        : '',
    onFilterDropdownVisibleChange: visible => {
      if (visible) {
        setTimeout(() => this.searchInput.select(), 100);
      }
    },
    render: text =>
      this.state.searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[this.state.searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });

  handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    this.setState({
      searchText: selectedKeys[0],
      searchedColumn: dataIndex,
    });
  };

  handleReset = clearFilters => {
    clearFilters();
    this.setState({ searchText: '' });
  };

  onSelectedDroneKeyChange = areaKey => {
    this.props.onSelectedDroneIdChange(areaKey);
  };

  render() {
    const columns = [
      {
        title: 'Miền giám sát',
        dataIndex: 'name',
        key: 'name',
        render: text => <a>{text}</a>,
        ...this.getColumnSearchProps('name'),
      },

    ];

    const data = [
      {
        key: '1',
        name: 'MGS01',
      },
      {
        key: '2',
        name: 'MGS02',
      },
      {
        key: '3',
        name: 'MGS03',
      },
    ];
    for (let i = 4; i < 100 ; i++){
      data.push({key: i+'', name: 'MGS0' + i})
    }
    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        this.onSelectedDroneKeyChange(selectedRowKeys);
        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
      },
    };
    return (
      <div>
        <Table columns={columns} dataSource={data} size="small" rowSelection={{ type: "radio", ...rowSelection }} bordered={false} scroll={{ y: 500 }} pagination={false} />
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
        <h6>Drone DR01</h6>
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

// class DroneInfoMap extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       listRectangle: []
//     }
//   }

//   createMapOptions(maps) {
//     // next props are exposed at maps
//     // "Animation", "ControlPosition", "MapTypeControlStyle", "MapTypeId",
//     // "NavigationControlStyle", "ScaleControlStyle", "StrokePosition", "SymbolPath", "ZoomControlStyle",
//     // "DirectionsStatus", "DirectionsTravelMode", "DirectionsUnitSystem", "DistanceMatrixStatus",
//     // "DistanceMatrixElementStatus", "ElevationStatus", "GeocoderLocationType", "GeocoderStatus", "KmlLayerStatus",
//     // "MaxZoomStatus", "StreetViewStatus", "TransitMode", "TransitRoutePreference", "TravelMode", "UnitSystem"
//     return {
//       mapTypeId: maps.MapTypeId.SATELLITE,
//     };
//   }

//   addRectange = (rectangle) => {
//     this.setState({ listRectangle: [...this.state.listRectangle, rectangle] })
//   }

//   handleApiLoaded = (map, maps) => {
//     let drawingManager = new maps.drawing.DrawingManager({
//       drawingMode: maps.drawing.OverlayType.RECTANGLE,
//       drawingControl: true,
//       drawingControlOptions: {
//         position: maps.ControlPosition.TOP_CENTER,
//         drawingModes: [
//           maps.drawing.OverlayType.RECTANGLE,
//         ],
//       },

//       rectangleOptions: {
//         fillColor: "#ffff00",
//         fillOpacity: 0.1,
//         strokeWeight: 5,
//         clickable: true,
//         editable: true,
//         zIndex: 1,
//       },
//     }
//     );
//     maps.event.addDomListener(drawingManager, 'rectanglecomplete', function (rectangle) {
//       console.log(rectangle)
//       drawingManager.setDrawingMode(null);
//       rectangle.addListener("rightclick", () => rectangle.setMap(null));
//     })
//     drawingManager.setMap(map);
//   };

//   render() {
//     return (
//       // Important! Always set the container height explicitly
//       <div style={{ height: '100vh', width: '100%' }}>
//         <GoogleMapReact
//           bootstrapURLKeys={{ key: "AIzaSyDUJI3UXw2arRqiUIIYaANQtMurg6__hnI", libraries: 'drawing' }}
//           center={this.props.center}
//           zoom={this.props.zoom}
//           onBoundsChange={this.props.onBoundsChange}
//           options={this.createMapOptions}
//           hoverDistance={20}
//           yesIWantToUseGoogleMapApiInternals
//           onGoogleApiLoaded={({ map, maps }) => this.handleApiLoaded(map, maps)}
//         >
//         </GoogleMapReact>
//       </div>
//     );
//   }
// }
