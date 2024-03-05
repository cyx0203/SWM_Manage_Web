import { useEffect } from "react";
import { Modal, Descriptions, Divider, Table } from "antd";
import _ from "@umijs/deps/compiled/lodash";

export default (props) => {

  const { visible, record, guardianList, onClose } = props;

  useEffect(() => {
  }, []);

  //定义表格抬头
  const tableColumns: any = [{
    title: '关系',
    dataIndex: 'relationname',
  },
  {
    title: '姓名',
    dataIndex: 'name',
  },
  {
    title: '联系电话',
    dataIndex: 'phone',
  },
  {
    title: '住址',
    dataIndex: 'address',
  },
  ]

  return (
    <Modal
      open={visible}
      title='患者信息详情'
      onCancel={onClose}
      footer={null}
      destroyOnClose
      width={800}
    >
      <Descriptions title="关联就诊介质" style={{ marginBottom: 5 }}>
        <Descriptions.Item label="电子健康卡号">{record ? record.health_card_no : ""}</Descriptions.Item>
        <br />
        <br />
        <Descriptions.Item label="社保卡号">{record ? record.social_card_no : ""}</Descriptions.Item>
        <br />
        <br />
        <Descriptions.Item label="就诊卡号">{record ? record.card_no : ""}</Descriptions.Item>
      </Descriptions>
      <Divider style={{ marginBottom: 5 }} />
      <Descriptions title="基本信息" style={{ marginBottom: 5 }}>
        <Descriptions.Item label="患者ID">{record ? record.patient_id : ""}</Descriptions.Item>
        <Descriptions.Item label="身份证号">{record ? record.idno : ""}</Descriptions.Item>
        <Descriptions.Item label="国籍">{record ? record.countryname : ''}</Descriptions.Item>
        <Descriptions.Item label="姓名">{record ? record.patient_name : ""}</Descriptions.Item>
        <Descriptions.Item label="性别">{record ? record.patient_sexname : ""}</Descriptions.Item>
        <Descriptions.Item label="生日">{record ? record.birthDay : ""}</Descriptions.Item>
        <Descriptions.Item label="民族">{record ? record.nationname : ''}</Descriptions.Item>
        <Descriptions.Item label="血型">{record ? record.bloodname : ""}</Descriptions.Item>
        <Descriptions.Item label="婚姻状况">{record ? record.marriagename : ""}</Descriptions.Item>
        <Descriptions.Item label="联系方式">{record ? record.phone : ""}</Descriptions.Item>
        <Descriptions.Item label="职业">{record ? record.occname : ''}</Descriptions.Item>
        <Descriptions.Item label="工作单位">{record ? record.work_company : ''}</Descriptions.Item>
        <Descriptions.Item label="工作电话">{record ? record.work_phone : ''}</Descriptions.Item>
        <Descriptions.Item label="家庭住址">{record ? ((record.provincename ? record.provincename : "") + (record.cityname ? record.cityname : "") + (record.areaname ? record.areaname : "") + (record.full_addr ? record.full_addr : "")) : ""}</Descriptions.Item>
      </Descriptions>
      <Divider style={{ marginBottom: 5 }} />
      <Descriptions title="家庭联系人信息" style={{ marginBottom: 5 }} />
      <Table
        size='small'
        columns={tableColumns}
        dataSource={guardianList}
        bordered
        pagination={false}
      />
    </Modal>
  );
}