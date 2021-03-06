import React, { Component } from 'react';
import GoogleMapReact from 'google-map-react';
import { Row, Col, Button, Input, Space, Steps, Table, message } from 'antd';
import Highlighter from 'react-highlight-words';
import { SearchOutlined } from '@ant-design/icons';
var axios = require('axios');
const { Step } = Steps;

class VideoSurveillance extends Component {
  constructor(props) {
    super(props);
    this.state = {
      areaListData: null,
      isLoadedAreaListData: false,
      center: {
        lat: 20.91507,
        lng: 105.74766
      },
      zoom: 12,
      selectedAreaKey: null,
      selectedAreaId: null,
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
  onSelectedAreaKeyChange = (areakey) => {
    let areaInfo = this.state.areaListData.find(areaInfo => areaInfo.key == areakey)
    this.setState({ selectedAreaKey: areakey, selectedAreaId: areaInfo._id, center: { lat: areaInfo.startPoint.latitude, lng: areaInfo.startPoint.longitude } });
  }
  setAreaListData() {
    let url = 'https://monitoredzoneserver.herokuapp.com/area?page=0';

    let config = {
      method: 'get',
      url: url,
      headers: {}
    };
    axios(config)
      .then((response) => {
        let areaListData = response.data.content.monitoredArea.map((data, index) => ({
          key: index,
          ...data
        }));
        areaListData.forEach((logData) => {
          for (let key in logData) {
            if (logData[key] == null) logData[key] = '';
          }
        });
        this.setState({ areaListData: areaListData, isLoadedAreaListData: true, center: {lat: areaListData[1].startPoint.latitude, lng: areaListData[1].startPoint.longitude} });
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  componentDidMount() {
    this.setAreaListData();
  }
  
  render() {
    const error = () => {
      message.error('Bạn chưa chọn khu vực nào !');
    };

    return (
      <div style={{ background: '#ffffff' }}>
        <StepSurveillance currentStep={0} />
        <Row gutter={10}>
          <Col span={4}>

            <h3>Chọn khu vực cần theo dõi</h3>

            <AreaList
              onCenterChange={this.onCenterChange}
              onSelectedAreaKeyChange={this.onSelectedAreaKeyChange}
              selectedAreaKey={this.state.selectedAreaKey}
              areaListData={this.state.areaListData}
              isLoadedAreaListData={this.state.isLoadedAreaListData}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 15 }}>
              {this.state.selectedAreaKey !== null ? <Button type="primary"><a href={'/tree-video-surveillance/zone-monitor?selectedAreaId=' + this.state.selectedAreaId}>Tiếp theo</a></Button> : null}
              {!(this.state.selectedAreaKey !== null) && <Button type="primary" onClick={error}>Tiếp theo</Button>}
            </div>

          </Col>
          <Col span={20}>
            <div>
              {this.state.isLoadedAreaListData &&
                <AreaListMap
                  center={this.state.center}
                  zoom={this.state.zoom}
                  selectedAreaKey={this.state.selectedAreaKey}
                  onBoundsChange={this.onBoundsChange}
                  onSelectedAreaKeyChange={this.onSelectedAreaKeyChange}
                  areaListData={this.state.areaListData}
                />
              }

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
      listRectangle: [],
      selectedAreaKey: null,
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
  componentWillReceiveProps(nextProps) {
    this.setState({ areaListData: nextProps.areaListData })
  }
  handleApiLoaded = (map, maps) => {
    let infoWindow = new maps.InfoWindow();
    let reactangleArray = [];
    if (this.props.areaListData) {
      reactangleArray = this.props.areaListData.map((data) => {
        let rectangle = new maps.Rectangle({
          strokeColor: "#FF0000",
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: "#FF0000",
          fillOpacity: 0.2,
          map,
          bounds: {
            north: data.startPoint.latitude,
            south: data.endPoint.latitude,
            east: data.endPoint.longitude,
            west: data.startPoint.longitude,
          },
        });
        rectangle.setMap(map);
        rectangle.addListener("click", () => {
          this.props.onSelectedAreaKeyChange(data.key);
          const ne = rectangle.getBounds().getNorthEast();
          const sw = rectangle.getBounds().getSouthWest();

          const contentString =
            `
              <div>Tên khu vực: ${data.name} </div>
              <div>Mã khu vực: ${data.code} </div>
            `

          // Set the info window's content and position.
          infoWindow.setContent(contentString);
          infoWindow.setPosition(ne);

          infoWindow.open(map);
        } );
        return ({ key: data.key, rectangle: rectangle })
      });
    }
    this.setState({ listRectangle: [...this.state.listRectangle, ...reactangleArray] });
  };

  onSelectedAreaKeyChange = (areakey) => {

    let selectedRectangle = this.state.listRectangle.find((area) => area.key == areakey);
    this.state.listRectangle && this.state.listRectangle.map((rectangleData) => {
      rectangleData.rectangle.setOptions({ fillColor: '#FF0000', strokeColor: '#FF0000' });
    });

    selectedRectangle && selectedRectangle.rectangle.setOptions({ fillColor: '#1890ff', strokeColor: '#1890ff' });


  }
  render() {
    this.onSelectedAreaKeyChange(this.props.selectedAreaKey);
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
        </GoogleMapReact>
      </div>
    );
  }
}

class AreaList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchText: '',
      searchedColumn: '',
    };
  
  }
  
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

  onSelectedAreaKeyChange = areaKey => {
    this.props.onSelectedAreaKeyChange(areaKey);
  };

  onSelectChange = selectedRowKeys => {
    this.onSelectedAreaKeyChange(selectedRowKeys[0]);
  };

  render() {
    this.state.selectedRowKeys = this.props.selectedAreaKey;
    const columns = [
      {
        title: 'Khu vực',
        dataIndex: 'name',
        key: 'name',
        render: text => <a>{text}</a>,
        ...this.getColumnSearchProps('name'),
      },

    ];
    let data = null;
    if (this.props.areaListData) {
      data = this.props.areaListData.map(data => ({
        key: data.key,
        name: data.name,
      }));
    }

        const rowSelection = {
            selectedRowKeys: [this.state.selectedRowKeys],
            onChange: this.onSelectChange,
            type: 'radio'
          };
    
    return (
      <div>
        <Table 
          columns={columns} 
          dataSource={data} 
          loading={!this.props.isLoadedAreaListData} 
          size="small" 
          rowSelection={{...rowSelection} }
          bordered={false} 
          scroll={{ y: 500 }} 
          pagination={false} 
        />
      </div>

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

export default VideoSurveillance;


