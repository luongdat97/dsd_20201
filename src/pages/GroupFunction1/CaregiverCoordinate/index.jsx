import React from "react";
import { Table, Tag, Modal, Button, DatePicker, Image } from 'antd';
import { IMAGES } from '../../../constants';
const { RangePicker } = DatePicker;
export default function CaregiverCoordinate() {
    return <CoordinateCaregiver></CoordinateCaregiver>
}

class ProblemDetail extends React.Component {
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
          <Button type="primary" onClick={() => {this.showModal();}}>
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

class CoordinateCaregiver extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            data : [
                {
                    key: '0',
                    order: '1',
                    problemType: 'Sâu bệnh',
                    problemId: 'SC01',
                    problemInfo: 'Xem chi tiết',
                    processPerson: '',
                    deadline: '',
                    processStatus: 'Chưa điều phối',
                    reportUrl: "/problem-report",
                },
                {
                    key: '1',
                    order: '2',
                    problemType: 'Sâu bệnh',
                    problemId: 'SC02',
                    problemInfo: 'Nguyễn Văn Nam',
                    processPerson: 'Trần Thị Thảo',
                    deadline: '23/11/2020 - 25/11/2020',
                    processStatus: 'Đã điều phối',
                    reportUrl: "/problem-report",
                },
                {
                    key: '2',
                    order: '3',
                    problemType: 'Ngập úng',
                    problemId: 'SC03',
                    problemInfo: 'Nguyễn Văn Nam',
                    processPerson: 'Trần Thị Thảo',
                    deadline: '23/11/2020 - 25/11/2020',
                    processStatus: 'Đã điều phối',
                    reportUrl: "/problem-report",
                },
                {
                    key: '3',
                    order: '4',
                    problemType: 'Chặt phá',
                    problemId: 'SC04',
                    proceproblemInfossPerson: 'Nguyễn Văn Nam',
                    processPerson: '',
                    deadline: '',
                    processStatus: 'Chưa điều phối',
                    reportUrl: "/problem-report",
                },
                {
                    key: '4',
                    order: '5',
                    problemType: 'Gãy đổ',
                    problemId: 'SC05',
                    problemInfo: 'Nguyễn Văn Nam',
                    processPerson: '',
                    deadline: '',
                    processStatus: 'Chưa điều phối',
                    reportUrl: "/problem-report",
                },
            ],
        };
    }
    updateData = (index, processPerson, deadline, processStatus) => {
        console.log("kkkkkkkkkkk " +index);
        this.state.data[index].processPerson = processPerson;
        this.state.data[index].deadline = deadline;
        this.state.data[index].processStatus = processStatus;
        this.setState({data: this.state.data});
    }
    render() {
        const columns = [
            {
                title: 'Stt',
                dataIndex: 'order',
                sorter: {
                    compare: (a, b) => a.order - b.order,
                },
            },
            {
                title: 'Loại sự cố',
                dataIndex: 'problemType',
                sorter: {
                    compare: (a, b) => a.problemType - b.problemType,
                },
            },
            {
                title: 'Mã sự cố',
                dataIndex: 'problemId',
                sorter: {
                    compare: (a, b) => a.orderPerson - b.orderPerson,
                },
            },
            {
                title: 'Thông tin sự cố',
                dataIndex: 'problemInfo',
                sorter: {
                    compare: (a, b) => a.processPerson - b.processPerson,
                },
                render: problemInfo => <ProblemDetail/>
            },
            {
                title: 'Người xử lý',
                dataIndex: 'processPerson',
                sorter: {
                    compare: (a, b) => a.deadline - b.deadline,
                },
            },
            {
                title: 'Hạn công việc',
                dataIndex: 'deadline',
                sorter: {
                    compare: (a, b) => a.deadline - b.deadline,
                },
            },
            {
                title: 'Trạng thái điều phối',
                dataIndex: 'processStatus',
                sorter: {
                    compare: (a, b) => a.processStatus - b.processStatus,
                },
                render: processStatus => <Tag color={processStatus == "Đã điều phối" ? "green" : "volcano"}>{processStatus}</Tag>,
            },
            {
                title: 'Điều phối',
                dataIndex: 'key',
                render: key => <OrderModal index={key}  updateData = {this.updateData}/>,
            },
        ];
        return (
            <div>
                <h2>Điều phối xử lý sự cố</h2>
                <Table columns={columns} dataSource={this.state.data} onChange={onChange}/>
            </div>
        )
    }
}


function onChange(pagination, filters, sorter, extra) {
    console.log('params', pagination, filters, sorter, extra);
}

const columns = [
    {
        title: 'Stt',
        dataIndex: 'order',
        sorter: {
            compare: (a, b) => a.order - b.order,
        },
    },
    {
        title: 'Người xử lý',
        dataIndex: 'processPerson',
        sorter: {
            compare: (a, b) => a.problemType - b.problemType,
        },
    },
    {
        title: 'Mã Id',
        dataIndex: 'personId',
        sorter: {
            compare: (a, b) => a.orderPerson - b.orderPerson,
        },
    },
    {
        title: 'Trạng thái hoạt động',
        dataIndex: 'personStatus',
        sorter: {
            compare: (a, b) => a.processPerson - b.processPerson,
        },
        render: personStatus => <Tag color={personStatus == "Đang chờ điều phối" ? "green" : "volcano"}>{personStatus}</Tag>,
    },
];
const data = [
    {
        key: '1',
        order: '1',
        processPerson: 'Trần Văn An',
        personId: 'NXL01',
        personStatus: 'Đang xử lý sự cố'
    },
    {
        key: '2',
        order: '2',
        processPerson: 'Hoàng Văn Hùng',
        personId: 'NXL02',
        personStatus: 'Đang xử lý sự cố'
    },
    {
        key: '3',
        order: '3',
        processPerson: 'Trần Thị Nhàn',
        personId: 'NXL03',
        personStatus: 'Đang chờ điều phối'
    },
    {
        key: '4',
        order: '4',
        processPerson: 'Trần Văn Đức',
        personId: 'NXL04',
        personStatus: 'Đang chờ điều phối'
    },
    {
        key: '5',
        order: '5',
        processPerson: 'Trần Văn Kiên',
        personId: 'NXL05',
        personStatus: 'Đang xử lý sự cố'
    },
];

class OrderModal extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            visible: false,
            RangePicker: '',
            personName: '',
        }
    }
    setPersonName(personName){
        this.setState({
            personName: personName,
        });
    }
    setRangePicker(RangePicker){
        this.setState({
            RangePicker: RangePicker,
        }); 
    }
    showModal = () => {
        this.setState({
            visible: true,
        });
    };

    handleOk = e => {
        const index = this.props.index;
        this.props.updateData(index, this.state.personName, this.state.RangePicker, 'Đã điều phối');
        Modal.success({
            content: 'Bạn đã điều phối thành công',
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

    onRangePickerChange = (dates, dateStrings) => {
        this.setRangePicker(dateStrings[0] + ' - ' + dateStrings[1]);
    }

    render() {
        const rowSelection = {
            onChange: (selectedRowKeys, selectedRows) => {
                console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
                this.setPersonName(selectedRows[0].processPerson);
            },
        };
        return (
            <>
                <Button type="primary" onClick={this.showModal}>
                    Điều phối
                </Button>
                <Modal
                    title="Điều phối người xử lý cho sự cố Sâu bệnh SC003 "
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    width={1000}
                >
                    <div>
                        <span>Chọn thời gian xử lý: </span>
                        <RangePicker onChange={this.onRangePickerChange} format='DD/MM/YYYY'/>
                    </div>

                    <br />
                    <span>Chọn người xử lý sự cố:</span>
                    <Table
                        columns={columns}
                        dataSource={data}
                        onChange={onChange}
                        rowSelection={{
                            type: 'radio',
                            ...rowSelection,
                        }}
                    />
                </Modal>
            </>
        );
    }
}
