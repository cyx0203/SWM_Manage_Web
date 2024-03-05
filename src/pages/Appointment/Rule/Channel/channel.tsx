import { Fragment, useEffect, useRef, useState } from 'react';
import { DomRoot, Ajax, KeepAlive } from '@/components/PageRoot';
import { Card, Tag, Popconfirm, message, Space, Table, Typography } from 'antd';
import { LockOutlined, PlusCircleOutlined, MinusCircleOutlined } from '@ant-design/icons';
import SmartTop from '@/components/SmartTop';
import Edit from './edit';

const { Text } = Typography;

const Channel = () => {

  // 查询条件
  const topRef = useRef(null);
  const queryArea: any = useRef(null);
  const [deptKV, setDeptKV] = useState([]);
  const [registerTypeKV, setRegisterTypeKV] = useState([]);
  const [channelKV, setChannelKV] = useState([]);
  // 查询结果
  const [ruleList, setRuleList] = useState(null);


  const [editVisible, setEditVisible] = useState(false);
  const [record, setRecord] = useState(null);

  //查询所有科室
  const queryDeptInit = () => {
    Ajax.Post('AptUrl', '/manage/schDept.selectKV',
      {
        hospitalId: localStorage.getItem('hospitalId'),
      },
      (ret: any) => {
        setDeptKV([{
          'value': '##',
          'txt': '所有科室'
        }, ...ret.list])
      }
    );
  }

  //查询所有号类
  const queryRegisterTypeInit = () => {
    Ajax.Post('AptUrl', '/manage/com.selectRegisterType',
      {
        hospitalId: localStorage.getItem('hospitalId'),
      },
      (ret: any) => {
        setRegisterTypeKV([{
          'value': '##',
          'txt': '所有号别'
        }, ...ret.list])
      }
    );
  }

  //查询所有渠道
  const queryChannelInit = () => {
    Ajax.Post('AptUrl', '/manage/com.selectChannel',
      {
        hospitalId: localStorage.getItem('hospitalId'),
      },
      (ret: any) => {
        setChannelKV(ret.list)
      }
    );
  }

  //查询渠道可视排班规则
  const queryRule = (params) => {
    const query = { ...queryArea.current, ...params };
    Ajax.Post('AptUrl', '/manage/ruleChannelSchedule.selectAll',
      {
        ...query,
        hospitalId: localStorage.getItem('hospitalId'),
      },
      (ret: any) => {
        setRuleList(ret.list)
      }
    );
  }

  useEffect(() => {
    queryDeptInit();
    queryRegisterTypeInit();
    queryChannelInit();
    queryRule(null);
  }, []);

  //删除规则
  const removeRule = (row) => {
    Ajax.Post('AptUrl', '/manage/ruleChannelSchedule.deleteById',
      {
        id: row.id,
      },
      (ret: any) => {
        message.success('删除规则成功');
        queryRule(null);
      }
    );
  }

  //获取科室名称
  const getDeptName = (value) => {
    for (const item of deptKV) {
      if (value === item.value) {
        return item.txt
      }
    }
    return "未知科室";
  }

  //获取渠道名称
  const getChannelName = (value) => {
    for (const item of channelKV) {
      if (value === item.value) {
        return item.txt
      }
    }
    return "未知渠道";
  }

  //获取号别名称
  const getRegisterTypeName = (value) => {
    for (const item of registerTypeKV) {
      if (value === item.value) {
        return item.txt
      }
    }
    return "未知号别";
  }

  //格式化渠道列表
  const formatChannelList = (value) => {
    return (
      <Fragment>
        {value.split(',').map(item => {
          return <span key={item}>{getChannelName(item)}<br /></span>
        })}
      </Fragment>
    )
  }

  //格式化科室列表
  const formatDeptNameList = (value) => {
    if (value == "##") return <Tag color="blue">所有科室</Tag>;
    return (
      <Fragment>
        {value.split(',').map(item => {
          return <span key={item}>{getDeptName(item)}<br /></span>
        })}
      </Fragment>)
  }

  //格式化号别列表
  const formatRegisterTypeList = (value) => {
    if (value == "##") return <Tag color="blue">所有号别</Tag>;
    return (
      <Fragment>
        {value.split(',').map(item => {
          return <span key={item}>{getRegisterTypeName(item)}<br /></span>
        })}
      </Fragment>)
  }

  //SmartTop点击查询
  const topSubmit = (params = {}) => {
    queryArea.current = params;
    queryRule(null)
  }

  //查询条件
  const getFields = () => {
    return [{
      type: 'select',
      label: '渠道',
      style: { width: 250 },
      field: 'queryChannelId',
      placeholder: '请选择查询渠道...',
      showSearch: true,
      allowClear: true,
      options: channelKV,
    }, {
      type: 'select',
      label: '科室',
      style: { width: 250 },
      field: 'queryDeptId',
      placeholder: '请选择查询科室...',
      showSearch: true,
      allowClear: true,
      options: deptKV,
    }, {
      type: 'button',
      buttonList: [{
        type: 'primary',
        htmlType: 'submit',
        buttonText: '查询',
        style: { marginLeft: 8 }
      }, {
        buttonText: '新建规则',
        style: { marginLeft: 8 },
        onClick: () => {
          setRecord(null);
          setEditVisible(true);
        }
      }]
    }]
  }

  const tableColumns: any = [{
    title: '规则标识',
    dataIndex: 'allow',
    width: 100,
    align: 'center',
    render: (value, row, index) => (
      value === '1' ? <Tag color='green'><PlusCircleOutlined /> 允许</Tag> : <Tag color='red'><MinusCircleOutlined /> 排斥</Tag>
    )
  }, {
    title: '渠道',
    dataIndex: 'channelIdList',
    render: (value) => formatChannelList(value)
  }, {
    title: '科室',
    dataIndex: 'deptIdList',
    render: (value) => formatDeptNameList(value)
  }, {
    title: '号别',
    dataIndex: 'registerTypeList',
    render: (value) => formatRegisterTypeList(value)
  }, {
    title: '创建人',
    dataIndex: 'createUser',
    render: (value) => value ? value : '-'
  }, {
    title: '创建时间',
    dataIndex: 'createTimeFormat',
    render: (value) => value ? value : '-'
  }, {
    title: '操作',
    key: 'action',
    align: 'center',
    render: (value, row, index) => (
      row.isLock === '1' ?
        <Text disabled><LockOutlined /> 不可编辑</Text> :
        <Space>
          <Fragment>
            <a onClick={() => { setRecord(row); setEditVisible(true) }}>编辑</a>
            <Popconfirm title="确认删除记录吗?" onConfirm={() => removeRule(row)}>
              <a>删除</a>
            </Popconfirm>
          </Fragment >
        </Space>
    ),
  },
  ]

  return (
    <DomRoot>
      {/* 查询条件区域 */}
      <Card>
        <SmartTop handleSubmit={topSubmit} getFields={getFields} onRef={topRef}><div /></SmartTop>
      </Card>
      {/* 表格 */}
      <Card style={{ marginTop: 8 }}>
        <Table
          bordered
          size="small"
          columns={tableColumns}
          dataSource={ruleList || []}
          pagination={false}
        />
      </Card>
      {/* 编辑弹出框 */}
      <Edit
        visible={editVisible}
        record={record}
        channelKV={channelKV}
        deptKV={deptKV}
        registerTypeKV={registerTypeKV}
        onClose={() => setEditVisible(false)}
        onOk={() => {
          setEditVisible(false);
          queryRule(null);
        }}
      />
    </DomRoot>
  )
}

export default () => (
  <KeepAlive>
    <Channel />
  </KeepAlive>
)
