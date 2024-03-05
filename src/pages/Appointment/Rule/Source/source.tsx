import { Fragment, useEffect, useRef, useState } from 'react';
import { DomRoot, Ajax, KeepAlive } from '@/components/PageRoot';
import { Card, Table, Tag, Popconfirm, message, Space, Modal, Popover } from 'antd';
import SmartTop from '@/components/SmartTop';

import Edit from './edit';
import Detail from './detail';
import { EyeOutlined } from '@ant-design/icons';

const Source = () => {

  // 预先查询的基础数据-科室、医生
  const [deptList, setDeptList] = useState(null);
  const [doctorList, setDoctorList] = useState(null);
  const [sourceList, setSourceList] = useState(null);
  const [registerTypeList, setRegisterTypeList] = useState(null);
  const [visible, setVisible] = useState(false);
  const [detailVisible, setDetailVisible] = useState(false);
  const [record, setRecord] = useState(null);
  let TopRef = useRef(null);

  //查询号源规则
  const querySource = (keywords) => {
    Ajax.Post('AptUrl', '/manage/ruleSource.selectById',
      {
        ...keywords,
        hospitalId: localStorage.getItem('hospitalId'),
      },
      (ret: any) => {
        setSourceList(ret.list)
      }
    );
  }

  //删除号源规则
  const deleteSource = (row) => {
    if(row.List != null && row.List.length > 0){
      message.success('号源已生成，建议进行编辑停用');
      return;
    }
    Ajax.Post('AptUrl', '/manage/ruleSource.deleteById',
      {
        oid: row.id,
      },
      (ret: any) => {
        message.success('删除规则成功');
        querySource(null);
      }
    );
  }

  //查询所有科室
  const queryDept = () => {
    Ajax.Post('AptUrl', '/manage/schDept.selectKV',
      {
        hospitalId: localStorage.getItem('hospitalId'),
      },
      (ret: any) => {
        let deptArr = [];
        deptArr.push({
          'value': '##',
          'txt': '通用科室'
        });
        setDeptList([...deptArr, ...ret.list])
      }
    );
  }

  // 查询所有医生
  const queryDoctor = () => {
    Ajax.Post('AptUrl', '/manage/com.selectDoctor',
      {
        hospitalId: localStorage.getItem('hospitalId'),
      },
      (ret: any) => {
        let docArr = [];
        docArr.push({
          'value': '##',
          'txt': '默认医生'
        });
        setDoctorList([...docArr, ...ret.list])
      }
    );
  }

  //查询所有号类
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

  //获取科室名称
  const getDeptName = (value) => {
    if (deptList) {
      for (const dept of deptList) {
        if (value == dept.value) {
          return dept.txt;
        }
      }
    }
    return "未知科室";
  }

  //获取医生姓名
  const getDoctorName = (value) => {
    if (doctorList) {
      for (const doctor of doctorList) {
        if (value == doctor.value) {
          return doctor.txt;
        }
      }
    }
    return "未知科室";
  }

  //格式化科室列表
  const formatDeptNameList = (value) => {
    if (value == "##") return <Tag color="blue">通用科室</Tag>;
    return (
      <Fragment>
        {value.split(',').map(item => {
          if (item !== '')
            return <span key={item}>{getDeptName(item)}<br /></span>
          return ''
        })}
      </Fragment>
    )
  }

  //格式化医生列表
  const formatDoctorList = (value) => {
    if (value == "##") return <Tag color="blue">通用医生</Tag>;
    return (
      <Fragment>
        {value.split(',').map(item => {
          if (item !== '')
            return <span key={item}>{getDoctorName(item)}<br /></span>
          return ''
        })}
      </Fragment>
    )
  }

  //格式化号源列表
  const formatSource = (value) => {
    if (value.length === 0) return '无数据';
    return (
      <Fragment>
        {value.map(item => {
          if (item !== '')
            return <span>{item.stime.substring(0, 2)}:{item.stime.substring(2)} -
              {item.etime.substring(0, 2)}:{item.etime.substring(2)}号源数 :
              {item.sourceNum}个<br /></span>
          return ''
        })}
      </Fragment>
    )
  }

  //获取号源总数
  const getSourceNum = (value) => {
    if (value.length === 0) return '0';
    let num = 0;
    value.map(item => {
      num += item.sourceNum;
    })
    return num;
  }

  useEffect(() => {
    queryDept();
    queryDoctor();
    queryRegisterType();
    querySource(null);
  }, []);

  const getFields = () => {
    return [
      {
        type: 'select',
        label: '查询科室',
        style: { width: '250px' },
        field: 'deptId',
        placeholder: '请选择查询科室...',
        showSearch: true,
        allowClear: true,
        options: deptList,
      },
      {
        type: 'select',
        label: '号别',
        style: { width: '250px' },
        field: 'registerType',
        placeholder: '请选择查询号别...',
        showSearch: true,
        allowClear: true,
        options: registerTypeList,
      },
      {
        type: 'select',
        label: '医生',
        style: { width: '250px' },
        field: 'doctorId',
        placeholder: '请选择查询医生...',
        showSearch: true,
        allowClear: true,
        options: doctorList,
      },
      {
        type: 'select',
        label: '是否启用',
        style: { width: '250px' },
        field: 'active',
        placeholder: '请选择查询是否启用...',
        showSearch: true,
        allowClear: true,
        options: [
          {
            txt: '启用',
            value: '1',
          }, {
            txt: '停用',
            value: '0',
          },
        ],
      },
      {
        type: 'button',
        buttonList: [
          {
            type: 'primary',
            htmlType: 'submit',
            buttonText: '查询',
            style: { marginLeft: 8 }
          },
          {
            buttonText: '新建规则',
            style: { marginLeft: 8 },
            onClick: () => {
              setRecord(null);
              setVisible(true);
            }
          }
        ]
      }
    ]
  }

  const tableColumns: any = [{
    title: '序号',
    width: '5%',
    render: (value, row, index) => (
      index + 1
    ),
  },
  {
    title: '绑定科室',
    width: '12%',
    dataIndex: 'deptIdList',
    render: (text) => (
      formatDeptNameList(text)
    )
  },
  {
    title: '号别',
    width: '12%',
    render: (value, row, index) => (
      row.registerTypeName ? row.registerTypeName :
        row.registerType === '###' ? <Tag color="green">协和专家</Tag> : <Tag color="blue">通用号别</Tag>
    )
  },
  {
    title: '医生',
    width: '12%',
    dataIndex: 'doctorIdList',
    render: (text) => (
      formatDoctorList(text)
    )
  },
  {
    title: '全天号源数量',
    width: '8%',
    render: (value, row, index) => (
      <Popover content={formatSource(row.List)} trigger="hover" placement="rightTop">
        <span style={{ cursor: 'pointer' }}>{getSourceNum(row.List)} <EyeOutlined style={{ color: 'orange' }} /></span>
      </Popover>
    ),
  },
  {
    title: '创建人',
    dataIndex: 'createUser',
    width: '12%',
  },
  {
    title: '创建时间',
    width: '12%',
    dataIndex: 'createTime'
  },
  {
    title: '状态',
    width: '12%',
    dataIndex: 'active',
    align: 'center',
    render: (text) => (
      text === '1' ? <Tag color="green">启用</Tag> : <Tag color="red">停用</Tag>
    )
  },
  {
    title: '操作',
    key: 'action',
    align: 'center',
    width: '12%',
    render: (value, row, index) => (
      row.registerType === '##'?
        <Space>
          <Fragment>
            <a onClick={() => { setRecord(row); setDetailVisible(true) }}>编辑时段</a>
          </Fragment>
        </Space>
        :
        <Space>
          <Fragment>
            <a onClick={() => { setRecord(row); setVisible(true) }}>编辑</a>
            <a onClick={() => { setRecord(row); setDetailVisible(true) }}>编辑时段</a>
            <Popconfirm title="确认删除记录吗?" onConfirm={() => deleteSource(row)}>
              <a>删除</a>
            </Popconfirm>
          </Fragment >
        </Space>
    ),
  },
  ]

  // 编辑规则、添加规则等操作后，关闭明细弹出框，重新查询规则
  const queryAfterEdit = () => {
    querySource(null);
    setDetailVisible(false);
  }

  return (
    <DomRoot>
      {/* 查询条件区域 */}
      <Card>
        <SmartTop handleSubmit={querySource} getFields={getFields} onRef={TopRef}><div /></SmartTop>
      </Card>
      {/* 表格 */}
      <Card style={{ marginTop: 8 }}>
        {sourceList &&
          <Table
            bordered
            size="small"
            columns={tableColumns}
            dataSource={sourceList}
            pagination={false}
          />
        }
      </Card>
      {/* 预约明细 */}
      <Modal
        open={detailVisible}
        onCancel={() => setDetailVisible(false)}
        width={1100}
        footer={null}
        destroyOnClose
      >
        <Detail record={record} queryAfterEdit={() => queryAfterEdit()} />
      </Modal>
      {/* 增加规则弹出框 */}
      <Edit
        visible={visible}
        record={record}
        doctorList={doctorList}
        deptList={deptList}
        registerTypeList={registerTypeList}
        onClose={() => setVisible(false)}
        onOk={() => {
          setVisible(false);
          querySource(null);
        }}
      />
    </DomRoot>
  )
}

export default () => (
  <KeepAlive>
    <Source />
  </KeepAlive>
)
