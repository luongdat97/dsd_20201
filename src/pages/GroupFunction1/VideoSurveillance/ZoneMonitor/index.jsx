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
      zoneListData: null,
      areaData: null,
      isLoadedZoneListData: false,
      center: {
        lat: 20.91507,
        lng: 105.74766
      },
      zoom: 12,
      selectedZoneKey: null,
      selectedZoneId: null,
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
  onSelectedZoneKeyChange = (zonekey) => {
    let zoneInfo = this.state.zoneListData.find(zoneInfo => zoneInfo.key == zonekey)
    this.setState({ selectedZoneKey: zonekey, selectedZoneId: zoneInfo._id, center: { lat: zoneInfo.startPoint.latitude, lng: zoneInfo.startPoint.longitude } });
  }

  setAreaData = () => {
    let url = 'https://monitoredzoneserver.herokuapp.com/area/areainfo/' + this.props.selectedAreaId;

    let config = {
      method: 'get',
      url: url,
      headers: {
        projectType: 'CAY_TRONG',
        token: 'f5134fcb341b492ea9776485fbd62890',
      }
    };
    axios(config)
      .then((response) => {
        let areaData = response.data.content.area;
        this.setState({ areaData: areaData, center: {lat: areaData.startPoint.latitude, lng: areaData.startPoint.longitude}});
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  setZoneListData() {
    let url = 'https://monitoredzoneserver.herokuapp.com/monitoredzone/area/' + this.props.selectedAreaId;

    let config = {
      method: 'get',
      url: url,
      headers: {
        projectType: 'CAY_TRONG',
        token: 'f5134fcb341b492ea9776485fbd62890',
      }
    };
    axios(config)
      .then((response) => {
        let zoneListData = response.data.content.zone.map((data, index) => ({
          key: index,
          ...data
        }));
        zoneListData.forEach((logData) => {
          for (let key in logData) {
            if (logData[key] == null) logData[key] = '';
          }
        });
        this.setState({ zoneListData: zoneListData, isLoadedZoneListData: true });
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  componentDidMount() {
    this.setZoneListData();
    this.setAreaData();
  }
  
  render() {
    const error = () => {
      message.error('Bạn chưa chọn khu vực nào !');
    };
    const areaName = this.state.areaData ? this.state.areaData.name : null;

    return (
      <div style={{ background: '#ffffff' }}>
        <StepSurveillance currentStep={1} areaName={areaName} />
        <Row gutter={10}>
          <Col span={4}>

            <h3>Chọn miền giám sát cần theo dõi</h3>
            <p>Khu vực hiện tại: {areaName}</p>

            <ZoneList
              onCenterChange={this.onCenterChange}
              onSelectedZoneKeyChange={this.onSelectedZoneKeyChange}
              selectedZoneKey={this.state.selectedZoneKey}
              zoneListData={this.state.zoneListData}
              isLoadedZoneListData={this.state.isLoadedZoneListData}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 15 }}>
              {this.state.selectedZoneKey !== null ? <Button type="primary"><a href={'/tree-video-surveillance/drone-list?selectedZoneId=' + this.state.selectedZoneId}>Tiếp theo</a></Button> : null}
              {!(this.state.selectedZoneKey !== null) && <Button type="primary" onClick={error}>Tiếp theo</Button>}
            </div>

          </Col>
          <Col span={20}>
            <div>
              {this.state.isLoadedZoneListData &&
                <ZoneListMap
                  center={this.state.center}
                  zoom={this.state.zoom}
                  selectedZoneKey={this.state.selectedZoneKey}
                  onBoundsChange={this.onBoundsChange}
                  onSelectedZoneKeyChange={this.onSelectedZoneKeyChange}
                  zoneListData={this.state.zoneListData}
                  areaData={this.state.areaData}
                />
              }

            </div>
          </Col>
        </Row>
      </div>
    )
  }
};


class ZoneListMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listRectangle: [],
      selectedZoneKey: null,
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
    this.setState({ zoneListData: nextProps.zoneListData })
  }
  handleApiLoaded = (map, maps) => {
    let worldCoords = [
      new maps.LatLng(-85.1054596961173, -180),
      new maps.LatLng(85.1054596961173, -180),
      new maps.LatLng(85.1054596961173, 180),
      new maps.LatLng(-85.1054596961173, 180),
      new maps.LatLng(-85.1054596961173, 0)];
  
      let startPoint = this.props.areaData.startPoint;
      let endPoint = this.props.areaData.endPoint;
      
      const rectangleCoords = [
        { lat: startPoint.latitude, lng: startPoint.longitude },
        { lat: endPoint.latitude, lng: startPoint.longitude },
        { lat: endPoint.latitude, lng: endPoint.longitude },
        { lat: startPoint.latitude, lng: endPoint.longitude },
        
      ];
    
  
  
      // Construct the polygon.
      let poly = new maps.Polygon({
          paths: [worldCoords, rectangleCoords],
          strokeColor: '#000000',
          strokeOpacity: 0.2,
          strokeWeight: 1,
          fillColor: '#000000',
          fillOpacity: 0.35
      });
      poly.setMap(map);
  

    let infoWindow = new maps.InfoWindow();
    let reactangleArray = [];
    if (this.props.zoneListData) {
      reactangleArray = this.props.zoneListData.map((data) => {
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
          this.props.onSelectedZoneKeyChange(data.key);
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

  onSelectedZoneKeyChange = (zonekey) => {

    let selectedRectangle = this.state.listRectangle.find((zone) => zone.key == zonekey);
    this.state.listRectangle && this.state.listRectangle.map((rectangleData) => {
      rectangleData.rectangle.setOptions({ fillColor: '#FF0000', strokeColor: '#FF0000' });
    });

    selectedRectangle && selectedRectangle.rectangle.setOptions({ fillColor: '#1890ff', strokeColor: '#1890ff' });


  }
  render() {
    this.onSelectedZoneKeyChange(this.props.selectedZoneKey);
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

class ZoneList extends React.Component {
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

  onSelectedZoneKeyChange = zoneKey => {
    this.props.onSelectedZoneKeyChange(zoneKey);
  };

  onSelectChange = selectedRowKeys => {
    this.onSelectedZoneKeyChange(selectedRowKeys[0]);
  };

  render() {
    this.state.selectedRowKeys = this.props.selectedZoneKey;
    const columns = [
      {
        title: 'Miền giám sát',
        dataIndex: 'name',
        key: 'name',
        render: text => <a>{text}</a>,
        ...this.getColumnSearchProps('name'),
      },

    ];
    let data = null;
    if (this.props.zoneListData) {
      data = this.props.zoneListData.map(data => ({
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
          loading={!this.props.isLoadedZoneListData} 
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
        <Step title="Chọn khu vực" description={'Khu vực ' + this.props.areaName} />
        <Step title="Chọn miền giám sát" />
        <Step title="Chọn drone" />
        <Step title="Giám sát" />
      </Steps>
    )
  }
}

export default VideoSurveillance;


