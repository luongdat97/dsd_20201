import React, { Component } from 'react';
import GoogleMapReact from 'google-map-react';
import StyleVideoSurveillance, { droneHoverStyle, droneStyle } from "./index.style";
import { Row, Col, Button, Popover, Input, Space, Table, Steps } from 'antd';
import Highlighter from 'react-highlight-words';
import { SearchOutlined } from '@ant-design/icons';
var axios = require('axios');
const { Step } = Steps;

class DroneListPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      
      center: {
        lat: 20.91507,
        lng: 105.74766
      },
      zoom: 16,
      activeDroneData: [],
      isLoadedActiveDroneData: false,
      dronePlaces: [
        { id: 0, position: { lat: 20.91507, lng: 105.74766 } },
        { id: 1, position: { lat: 20.91907, lng: 105.74766 } },
        { id: 2, position: { lat: 20.91707, lng: 105.74966 } },
      ],
      selectedDroneId: null,

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
    let droneInfo = this.state.dronePlaces.find(droneInfo => droneInfo.id == droneId % 3)
    this.setState({ selectedDroneId: droneId, center: droneInfo.position });
  }

  setActiveDroneData = () => {
    let url = 'http://skyrone.cf:6789/droneState/getAllDroneActiveRealTime';

    let config = {
      method: 'get',
      url: url,
      headers: {}
    };
    axios(config)
      .then((response) => {
        let activeDroneData = response.data.map((data, index) => ({
          key: index,
          ...data
        }));
        activeDroneData.forEach((logData) => {
          for (let key in logData) {
            if (logData[key] == null) logData[key] = '';
          }
        });
        console.log('haaaaaaaaaaaaaaaa')
        console.log(activeDroneData)
        this.setState({ activeDroneData: activeDroneData, isLoadedActiveDroneData: true });
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  componentDidMount() {
    this.setActiveDroneData();
  }

  render() {
    return (
      <div style={{ background: '#ffffff' }}>
        <StepSurveillance currentStep={2} />
        <Row gutter={15}>
          <Col span={4}>

            <h3>Chọn drone cần quan sát</h3>
            <DroneList
              onCenterChange={this.onCenterChange}
              onSelectedDroneIdChange={this.onSelectedDroneIdChange}
              activeDroneData={this.state.activeDroneData}
            />
            <div style={{display: 'flex', justifyContent: 'flex-end', marginTop: 15}}>
              <a href="/tree-video-surveillance/drone-path"><Button type="primary">Tiếp theo</Button></a>
            </div>
            

          </Col>
          <Col span={20}>
            <div>
              <DroneInfoMap
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
        >
          <DroneIcon
            id={1}
            lat={20.91507}
            lng={105.74766}
            checked={0 == this.props.selectedDroneId}
          />
          <DroneIcon
            id={2}
            lat={20.91907}
            lng={105.74766}
            checked={1 == this.props.selectedDroneId}
          />
          <DroneIcon
            id={3}
            lat={20.91707}
            lng={105.74966}
            checked={2 == this.props.selectedDroneId}
          />
        </GoogleMapReact>
      </div>
    );
  }
}

class DroneList extends React.Component {
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

  onSelectedDroneKeyChange = droneKey => {
    this.props.onSelectedDroneIdChange(droneKey);
  };

  render() {

    const columns = [
      {
        title: 'Drone',
        dataIndex: 'name',
        key: 'name',
        render: text => <a>{text}</a>,
        ...this.getColumnSearchProps('name'),
      },

    ];

    const data = this.props.activeDroneData.map((drone) => ({
      key: drone.key,
      name: drone.name
    }))

    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        this.onSelectedDroneKeyChange(selectedRowKeys)
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
        <h3>Drone DR01</h3>
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
  render() {
    return (
      <Steps current={this.props.currentStep} style={{ marginBottom: 15 }}>
        <Step title="Chọn khu vực" />
        <Step title="Chọn miền giám sát" />
        <Step title="Chọn drone" />
        <Step title="Giám sát" />
      </Steps>
    )
  }
}

export default DroneListPage;