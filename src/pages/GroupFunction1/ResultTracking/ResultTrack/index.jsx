import React from "react";
import { Table, Tag } from 'antd';

export default function ResultTracking() {
    return <TrackResult></TrackResult>
}

function TrackResult() {
    return (
        <div>
            <h2>Theo dõi kết quả xử lý sự cố</h2>
            <Table columns={columns} dataSource={data} onChange={onChange} />
        </div>
    )
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
        title: 'Loại sự cố',
        dataIndex: 'problemType',
        sorter: {
            compare: (a, b) => a.problemType - b.problemType,
        },
    },
    {
        title: 'Người điều phối',
        dataIndex: 'orderPerson',
        sorter: {
            compare: (a, b) => a.orderPerson - b.orderPerson,
        },
    },
    {
        title: 'Người xử lý',
        dataIndex: 'processPerson',
        sorter: {
            compare: (a, b) => a.processPerson - b.processPerson,
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
        title: 'Trạng thái xử lý',
        dataIndex: 'processStatus',
        sorter: {
            compare: (a, b) => a.processStatus - b.processStatus,
        },
        render: processStatus => <Tag color={processStatus == "Hoàn thành"?"green":"volcano"}>{processStatus}</Tag>,
    },
    {
        title: 'Báo cáo',
        dataIndex: 'reportUrl',
        render: reportUrl => <a href={reportUrl}>Báo cáo</a>,
    },
];

const data = [
    {
        order: '1',
        problemType: 'Sâu bệnh',
        orderPerson: 'Nguyễn Văn Anh',
        processPerson: 'Nguyễn Văn Nam',
        deadline: '23/11/2020 - 25/11/2020',
        processStatus: 'Hoàn thành',
        reportUrl: "/tree-result-tracking/tree-problem-report",
    },
    {
        order: '2',
        problemType: 'Sâu bệnh',
        orderPerson: 'Nguyễn Văn Anh',
        processPerson: 'Nguyễn Văn Nam',
        deadline: '23/11/2020 - 25/11/2020',
        processStatus: 'Hoàn thành',
        reportUrl: "/tree-result-tracking/tree-problem-report",
    },
    {
        order: '3',
        problemType: 'Ngập úng',
        orderPerson: 'Nguyễn Văn Anh',
        processPerson: 'Nguyễn Văn Nam',
        deadline: '23/11/2020 - 25/11/2020',
        processStatus: 'Hoàn thành',
        reportUrl: "/tree-result-tracking/tree-problem-report",
    },
    {
        order: '4',
        problemType: 'Chặt phá',
        orderPerson: 'Nguyễn Văn Anh',
        processPerson: 'Nguyễn Văn Nam',
        deadline: '23/11/2020 - 25/11/2020',
        processStatus: 'Hoàn thành',
        reportUrl: "/tree-result-tracking/tree-problem-report",
    },
    {
        order: '5',
        problemType: 'Gãy đổ',
        orderPerson: 'Nguyễn Văn Anh',
        processPerson: 'Nguyễn Văn Nam',
        deadline: '23/11/2020 - 25/11/2020',
        processStatus: 'Chưa hoàn thành',
        reportUrl: "/tree-result-tracking/tree-problem-report",
    },
];
function onChange(pagination, filters, sorter, extra) {
    console.log('params', pagination, filters, sorter, extra);
}