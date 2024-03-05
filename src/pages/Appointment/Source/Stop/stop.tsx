import { Fragment, useEffect, useRef, useState } from 'react';
import { DomRoot, Ajax, KeepAlive } from '@/components/PageRoot';
import { Card, Table, Tag } from 'antd';
import moment from 'moment';
import SmartTop from '@/components/SmartTop';
import Detial from './detail';

const Stop = () => {

  const [stopRecordList, setStopRecordList] = useState(null);
  const [patientList, setPatientList] = useState(null);
  const [visible, setVisible] = useState(false);
  const [record, setRecord] = useState(null);
  // 预先查询的基础数据-科室医生号别
  const [deptList, setDeptList] = useState(null);
  const [docList, setDocList] = useState(null);
  const [registerTypeList, setRegisterTypeList] = useState(null);
  const [args, setArgs] = useState(null);

  // 查询条件区域 
  const queryArea: any = useRef({ date: [moment().subtract(30, "d"), moment()] });
  const TopRef = useRef(null);

  // 查询停诊记录
  const queryStopRecord = (params = {}) => {
    const query = { ...queryArea.current, ...params };
    Ajax.Post('AptUrl', '/manage/srcStopRecord.selectAll',
      {
        ...query,
        startDate: moment(query.date[0]).format('YYYY-MM-DD'),
        endDate: moment(query.date[1]).format('YYYY-MM-DD'),
        hospitalId: localStorage.getItem('hospitalId'),
      },
      (ret: any) => {
        setStopRecordList(ret.list)
      }
    );
  }

  // 查询所有科室
  const queryDepartment = () => {
    Ajax.Post('AptUrl', '/manage/schDept.selectKV',
      {
        hospitalId: localStorage.getItem('hospitalId'),
      },
      (ret: any) => {
        setDeptList(ret.list);
      }
    );
  }

  // 查询所有号别
  const queryRegisterType = () => {
    Ajax.Post('AptUrl', '/manage/com.selectRegisterType',
      {
        hospitalId: localStorage.getItem('hospitalId'),
      },
      (ret: any) => {
        setRegisterTypeList(ret.list)
      }
    );
  }

  // 查询所有排班医生
  const queryDoctor = () => {
    Ajax.Post('AptUrl', '/manage/com.selectDoctor',
      {
        hospitalId: localStorage.getItem('hospitalId'),
      },
      (ret: any) => {
        setDocList(ret.list)
      }
    );
  }

  // 查询所有患者列表
  const queryPatientList = (row) => {
    const query = { ...args, ...row };
    console.log('qury', query);
    Ajax.Post('AptUrl', '/manage/srcStopNotice.selectById',
      {
        recordId: query && query.id,
      },
      (ret: any) => {
        setArgs(query);
        setPatientList(ret.list);
        setVisible(true);
      }
    );
  }

  // 编辑备注后刷新表格
  const queryAfterEdit = () => {
    setVisible(false);
    queryPatientList(null);
  }

  //SmartTop点击查询
  const topSubmit = (params = {}) => {
    queryArea.current = params;
    queryStopRecord(null)
  }

  useEffect(() => {
    queryDepartment();
    queryRegisterType();
    queryDoctor();
    queryStopRecord(null);
  }, []);

  const getFields = () => {
    return [
      {
        type: 'range-picker',
        style: { width: '300px' },
        field: 'date',
        label: '日期',
        required: true,
        initialValue: [moment().subtract(30, "d"), moment()],
      },
      {
        type: 'select',
        label: '科室',
        style: { width: '180px' },
        field: 'deptId',
        placeholder: '请选择科室...',
        showSearch: true,
        allowClear: true,
        options: deptList,
      },
      {
        type: 'select',
        label: '号类',
        style: { width: '200px' },
        field: 'registerTypeId',
        placeholder: '请选择号类...',
        showSearch: true,
        allowClear: true,
        options: registerTypeList,
      },
      {
        type: 'select',
        label: '医生',
        style: { width: '150px' },
        field: 'doctorId',
        placeholder: '请选择医生...',
        showSearch: true,
        allowClear: true,
        options: docList,
      },
      {
        type: 'button',
        buttonList: [
          {
            type: 'primary',
            htmlType: 'submit',
            buttonText: '查询',
            style: { marginLeft: 8 }
          }
        ]
      }
    ]
  }

  const tableColumns: any = [{
    title: '序号',
    align: 'center',
    width: 70,
    render: (value, row, index) => (
      index + 1
    ),
  }, {
    title: '排班日期',
    render: (value, row, index) => (
      row.aptDate + ' ' + (row.noon === '1' ? '上午' : '下午')
    )
  }, {
    title: '科室名称',
    dataIndex: 'deptName',
  }, {
    title: '号别',
    dataIndex: 'typeName',
  }, {
    title: '医生姓名',
    dataIndex: 'doctName',
  }, {
    title: '通知门办时间',
    dataIndex: 'noticeTime',
  }, {
    title: '通知门办方式',
    dataIndex: 'noticeType',
  }, {
    title: '原因',
    dataIndex: 'reason',
  }, {
    title: '类型',
    dataIndex: 'stopType',
    render: (value) => (
      value === '1' ? <Tag color="red">停诊</Tag> : <Tag color="green">停号</Tag>
    )
  }, {
    title: '状态/号序',
    dataIndex: 'reboot',
    render: (value, row, index) => (
      row.stopType === '1' ? 
      (row.reboot === '1' ? <Tag color="green">已恢复</Tag> : <Tag color="red">已停诊</Tag>) :
      row.startOrder + ' - ' + row.endOrder 
    )
  }, {
    title: '创建用户',
    dataIndex: 'createUser',
  }, {
    title: '创建时间',
    dataIndex: 'createTimeFormat',
  }, {
    title: '操作',
    key: 'action',
    align: 'center',
    width: '10%',
    render: (value, row, index) => (
      <Fragment>
        <a onClick={() => { queryPatientList(row); setRecord(row); }}>患者列表</a>
      </Fragment >
    )
  }]

  return (
    <DomRoot>
      {/* 查询条件区域 */}
      <Card>
        <SmartTop handleSubmit={topSubmit} getFields={getFields} onRef={TopRef}><div /></SmartTop>
      </Card>
      {/* 表格 */}
      <Card style={{ marginTop: 8 }}>
        {stopRecordList &&
          <Table
            bordered
            size="small"
            columns={tableColumns}
            dataSource={stopRecordList}
          />
        }
        {/* 编辑弹出框 */}
        <Detial
          visible={visible}
          record={record}
          patientList={patientList}
          queryAfterEdit={() => queryAfterEdit()}
          onClose={() => setVisible(false)}
        />
      </Card>
    </DomRoot>
  )
}

export default () => (
  <KeepAlive>
    <Stop />
  </KeepAlive>
)
