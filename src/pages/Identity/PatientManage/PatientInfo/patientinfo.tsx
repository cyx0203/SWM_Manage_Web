import { Fragment, useEffect, useState } from 'react';
import { DomRoot, Ajax, KeepAlive } from '@/components/PageRoot';
import { Card, Table, Input, Divider, message, Tag, Popconfirm } from 'antd';
import Edit from './edit';
import Detial from './detial';

const { Search } = Input;

const PatientInfo = () => {

  const [patientInfoList, setPatientInfoList] = useState(null);
  const [guardianList, setGuardianList] = useState(null);
  const [guardianInfo, setGuardianInfo] = useState(null);
  const [regionInfoList, setRegionInfoList] = useState(null);
  const [editVisible, setEditVisible] = useState(false);
  const [detialVisible, setDetialVisible] = useState(false);
  const [record, setRecord] = useState(null);

  //查询患者信息
  const queryPatientInfo = (keywords) => {
    Ajax.Post('IdentityUrl', '/identity/idnPatientInfo.select',
      {
        ...keywords,
      },
      (ret: any) => {
        setPatientInfoList(ret.list)
      }
    );
  }
  //查询基础
  const queryCodeInfo = () => {
    Ajax.Post('IdentityUrl', '/manage/dictRegion.select',
      {
      },
      (ret: any) => {
        setRegionInfoList(ret.list);
      }
    );
  }
  useEffect(() => {
    queryCodeInfo();
    queryPatientInfo(null);
  }, []);

  //停用患者信息
  const stopRecord = (row) => {
    Ajax.Post('IdentityUrl', '/manage/idnPatient.stopById',
      {
        id: row.id
      },
      (ret: any) => {
        message.success('停用成功');
        queryPatientInfo(null);
      }
    );
  }

  //启用患者信息
  const startRecord = (row) => {
    Ajax.Post('IdentityUrl', '/manage/idnPatient.startById',
      {
        id: row.id
      },
      (ret: any) => {
        message.success('启用成功');
        queryPatientInfo(null);
      }
    );
  }

  //查询联系人信息
  const queryGuardianEidt = (row) => {
    Ajax.Post('IdentityUrl', '/identity/idnPatientInfo.selectGuardian',
      {
        id: row && row.id
      },
      (ret: any) => {
        setGuardianInfo(ret.editdata);
        setEditVisible(true)
      }
    );
  }
  //查询联系人信息
  const queryGuardian = (row) => {
    Ajax.Post('IdentityUrl', '/manage/idnGuardian.selectById',
      {
        id: row && row.id
      },
      (ret: any) => {
        setGuardianList(ret.list);
        setDetialVisible(true);
      }
    );
  }
  //定义表格抬头
  const tableColumns: any = [{
    title: '患者ID',
    dataIndex: 'patient_id',
  }, {
    title: '身份证号',
    dataIndex: 'idno',
  }, {
    title: '是否实名',
    dataIndex: 'real_flag',
    render: (text) => (
      text === '0' ? '已实名' : '未实名'
    )
  }, {
    title: '姓名',
    dataIndex: 'patient_name',
  }, {
    title: '性别',
    dataIndex: 'patient_sexname'
  }, {
    title: '电话',
    dataIndex: 'phone',
  }, {
    title: '状态',
    dataIndex: 'status',
    render: (text) => (
      text === '0' ? <Tag color="green">有效</Tag> : <Tag color="red">停用</Tag>
    )
  }, {
    title: '创建时间',
    dataIndex: 'createTimeFormat'
  },
  {
    title: '操作',
    key: 'action',
    align: 'center',
    width: 200,
    render: (value, row, index) => (
      row.status === '0' ?
        <Fragment>
          <a onClick={() => { setRecord(row); queryGuardian(row); }}>详情</a>
          <Divider type="vertical" />
          <a onClick={() => { setRecord(row); queryGuardianEidt(row); }}>编辑</a>
          <Divider type="vertical" />
          <Popconfirm title="确认停用用户吗?" onConfirm={() => stopRecord(row)} >
            <a>停用</a>
          </Popconfirm>
        </Fragment> :
        <Fragment>
          <a onClick={() => { setRecord(row); queryGuardian(row); setRecord(row); }}>详情</a>
          <Divider type="vertical" />
          <a onClick={() => { setRecord(row); queryGuardianEidt(row); }}>编辑</a>
          <Divider type="vertical" />
          <Popconfirm title="确认启用用户吗?" onConfirm={() => startRecord(row)} >
            <a>启用</a>
          </Popconfirm>
        </Fragment>
    ),
  },
  ]

  return (
    <DomRoot>
      {/* 查询条件区域 */}
      <Card>
        <Search
          placeholder="请输入患者姓名/身份证号/患者ID..."
          enterButton="查询"
          style={{ width: 400 }}
          onSearch={value => queryPatientInfo({ keywords: value })}
        />
      </Card>
      {/* 表格 */}
      <Card style={{ marginTop: 8 }}>
        {patientInfoList &&
          <Table
            bordered
            size="small"
            columns={tableColumns}
            dataSource={patientInfoList}
          />
        }
      </Card>
      {/* 编辑弹出框 */}
      <Edit
        visible={editVisible}
        record={record}
        regionInfoList={regionInfoList}
        guardianInfo={guardianInfo}
        onClose={() => setEditVisible(false)}
        onOk={() => {
          setEditVisible(false);
          queryPatientInfo(null);
        }}
      />
      {/* 编辑弹出框 */}
      <Detial
        visible={detialVisible}
        record={record}
        guardianList={guardianList}
        onClose={() => setDetialVisible(false)}
      />
    </DomRoot>
  )
}

export default () => (
  <KeepAlive>
    <PatientInfo />
  </KeepAlive>
)
