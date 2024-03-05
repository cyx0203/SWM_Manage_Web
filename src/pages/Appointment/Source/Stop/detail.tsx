import { Fragment, useEffect, useState } from "react";
import { Modal, Descriptions, Table, Tag } from "antd";
import _ from "@umijs/deps/compiled/lodash";
import Notice from './notice';
import { CalendarOutlined } from "@ant-design/icons";

export default (props) => {

  const { visible, record, patientList, onClose, queryAfterEdit } = props;
  const [editVisible, setEditVisible] = useState(false);
  const [editRecord, setEditRecord] = useState(false);

  useEffect(() => {
  }, []);

  //定义表格抬头
  const tableColumns: any = [{
    title: '序号',
    align: 'center',
    width: '5%',
    render: (value, row, index) => (
      index + 1
    ),
  }, {
    title: '患者ID',
    width: '10%',
    dataIndex: 'userId',
  }, {
    title: '姓名',
    width: '10%',
    dataIndex: 'userName',
  }, {
    title: '联系电话',
    width: '15%',
    dataIndex: 'userPhone',
  }, {
    title: '通知状态',
    dataIndex: 'tip',
    width: '10%',
    render: (value) => (
      value === '1' ? <Tag color="green">已通知</Tag> : <Tag color="red">未通知</Tag>
    )
  }, {
    title: '信息反馈',
    width: '25%',
    dataIndex: 'remark',
  }, {
    title: '操作',
    key: 'action',
    align: 'center',
    width: '10%',
    render: (value, row, index) => (
      <Fragment>
        <a onClick={() => { setEditRecord(row); setEditVisible(true); }}>回访</a>
      </Fragment >
    )
  }
  ]

  const alertMessage = () => {
    return (
      <span>
        {record && record.deptName}/{record && record.typeName}/{record && record.doctName}
        <CalendarOutlined style={{ marginLeft: 10 }} /> {record && record.aptDate}
      </span >)
  }

  return (
    <Modal
      open={visible}
      title='预约患者列表'
      onCancel={onClose}
      maskClosable={false}
      footer={null}
      destroyOnClose
      width={1000}
    >
      <Descriptions title={alertMessage()} style={{ marginBottom: 5 }} />
      <Table
        size='small'
        columns={tableColumns}
        dataSource={patientList}
        bordered
        pagination={false}
      />
      {/* 编辑弹出框 */}
      <Notice
        visible={editVisible}
        row={editRecord}
        onClose={() => setEditVisible(false)}
        onOk={() => {
          setEditVisible(false);
          queryAfterEdit();
        }}
      />
    </Modal>
  );
}