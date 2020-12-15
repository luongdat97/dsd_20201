import React, { Component } from 'react';
import GoogleMapReact from 'google-map-react';
import StyleVideoSurveillance, { droneHoverStyle, droneStyle } from "./index.style";
import { Row, Col, Button, Popover, Input, Space, Table, Modal, Image } from 'antd';
import Highlighter from 'react-highlight-words';
import { SearchOutlined } from '@ant-design/icons';

class DroneListPage extends Component {
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
        { id: 3, position: { lat: 20.91707, lng: 105.74966 } },
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
    let droneInfo = this.state.dronePlaces.find(droneInfo => droneInfo.id == droneId % 3 + 1)
    this.setState({ selectedDroneId: droneId, center: droneInfo.position });
  }

  render() {
    return (
      <div style={{ background: '#ffffff' }}>
        <Row gutter={15}>
          <Col span={4}>

            <h5>Đối tượng giám sát</h5>
            <DroneList
              onCenterChange={this.onCenterChange}
              onSelectedDroneIdChange={this.onSelectedDroneIdChange}
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
          bootstrapURLKeys={{ key: "AIzaSyDUJI3UXw2arRqiUIIYaANQtMurg6__hnI" }}
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
            checked={1 == this.props.selectedDroneId}
          />
          <DroneIcon
            id={2}
            lat={20.91907}
            lng={105.74766}
            checked={2 == this.props.selectedDroneId}
          />
          <DroneIcon
            id={3}
            lat={20.91707}
            lng={105.74966}
            checked={3 == this.props.selectedDroneId}
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
        title: 'Cây trồng',
        dataIndex: 'name',
        key: 'name',
        render: text => <a>{text}</a>,
        ...this.getColumnSearchProps('name'),
      },

    ];

    const data = [
      {
        key: '1',
        name: 'TREE01',
      },
      {
        key: '2',
        name: 'TREE02',
      },
      {
        key: '3',
        name: 'TREE03',
      },
    ];
    for (let i = 4; i < 100; i++) {
      data.push({ key: i + '', name: 'TREE0' + i })
    }
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
    const content = (
      <div>
        <h6>Cây trồng bị gãy đổ</h6>       
        <p>Vị trí: 20.912, 105.23</p>
        <TreeDetail />
      </div>
    );
    return (
      <StyleVideoSurveillance>
        <div>
          
          <TreePopover droneStyleCss={droneStyleCss}></TreePopover>
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
        <h6>Cây trồng bị gãy đổ</h6>       
        <p>Vị trí: 20.912, 105.23</p>
        <TreeDetail hidePopover={this.hide}/>
      </div>
    );
    return (
      <Popover
        content={content}
        title="Sự cố"
        visible={this.state.visible}
        onVisibleChange={this.handleVisibleChange}
      >
        <i className="fas fa-tree-alt drone-icon" style={{ ...this.props.droneStyleCss }}></i>
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
        <Button type="primary" onClick={() => {this.showModal(); this.props.hidePopover()}}>
          Xem chi tiết
        </Button>
        <Modal
          title="Tình trạng cây trồng"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          style={{zIndex: "100 !important"}}
          width={1000}
        >
          <h6>Loại sự cố: cây trồng bị gãy đổ</h6>
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

export default DroneListPage;