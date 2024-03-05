import { Fragment, useEffect, useRef, useState } from 'react';
import { DomRoot, Ajax, KeepAlive } from '@/components/PageRoot';
import { Card, Tag, Popconfirm, message, Space } from 'antd';
import Edit from './edit';
import SmartTop from '@/components/SmartTop';
import SmartTable from '@/components/SmartTable';

const RegType = () => {

  const [registerRuleList, setRegisterRuleList] = useState(null);
  const [deptList, setDeptList] = useState(null);
  const [registerTypeList, setRegisterTypeList] = useState(null);
  const [custList, setCustList] = useState(null);
  const [editVisible, setEditVisible] = useState(false);
  const [record, setRecord] = useState(null);
  const queryArea: any = useRef(null);

  let TopRef = useRef(null);

  //查询号类规则
  const queryRule = (params) => {
    const query = { ...queryArea.current, ...params };
    Ajax.Post('AptUrl', '/manage/ruleRegType.selectByKeyWords',
      {
        ...query,
        hospitalId: localStorage.getItem('hospitalId'),
      },
      (ret: any) => {
        setRegisterRuleList(ret)
      }
    );
  }

  //删除号类规则
  const deleteSource = (row) => {
    Ajax.Post('AptUrl', '/manage/ruleRegType.deleteById',
      {
        oid: row.id,
      },
      (ret: any) => {
        message.success('删除规则成功');
        queryRule(null);
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
          'txt': '所有科室'
        });
        setDeptList([...deptArr, ...ret.list])
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

  //查询所有渠道
  const queryCust = () => {
    Ajax.Post('AptUrl', '/manage/com.selectChannel',
      {
        hospitalId: localStorage.getItem('hospitalId'),
      },
      (ret: any) => {
        const custArr = [];
        custArr.push({
          'value': '##',
          'txt': '所有渠道'
        });
        setCustList([...custArr, ...ret.list])
      }
    );
  }

  //获取科室名称
  const getDeptName = (value) => {
    if (deptList) {
      for (let i = 0; i < deptList.length; i++) {
        if (value == deptList[i].value) {
          return deptList[i].txt;
        }
      }
    }
    return "未知科室";
  }

  //获取渠道名称
    const getChannelName = (value) => {
      if (custList) {
        for (let i = 0; i < custList.length; i++) {
          if (value == custList[i].value) {
            return custList[i].txt;
          }
        }
      }
      return "未知渠道";
    }

  //格式化科室列表
  const formatDeptNameList = (value) => {
    if (value == "##") return <Tag color="blue">所有科室</Tag>;
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

  //格式化渠道列表
  const formatChannelList = (value) => {
    if (value == "##") return <Tag color="blue">所有渠道</Tag>;
    return (
      <Fragment>
        {value.split(',').map(item => {
          if (item !== '')
            return <span key={item}>{getChannelName(item)}<br /></span>
          return ''
        })}
      </Fragment>
    )
  }

  useEffect(() => {
    queryDept();
    queryRegisterType();
    queryCust();
    queryRule(null);
  }, []);

  
  //SmartTop点击查询
  const topSubmit = (params = {}) => {
    queryArea.current = params;
    queryRule(null)
  }

  //查询条件
  const getFields = () => {
    return [
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
        label: '渠道',
        style: { width: '250px' },
        field: 'custId',
        placeholder: '请选择查询渠道...',
        showSearch: true,
        allowClear: true,
        options: custList,
      },
      {
        type: 'select',
        label: '查询科室',
        style: { width: '250px' },
        field: 'deptId',
        placeholder: '请选择查询科室...',
        showSearch: true,
        options: deptList,
        allowClear: true,
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
              setEditVisible(true);
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
    title: '号别',
    width: '15%',
    dataIndex: 'registerTypeName',
    render: (text) => (
      text ? text : <Tag color="blue">通用号别</Tag>
    )
  },
  {
    title: '渠道',
    width: '15%',
    dataIndex: 'channelIdList',
    render: (text) => (
      formatChannelList(text)
    )
  },
  {
    title: '科室',
    width: '15%',
    dataIndex: 'deptIdList',
    render: (text) => (
      formatDeptNameList(text)
    )
  },
  {
    title: '创建人',
    dataIndex: 'createUser',
    width: '8%',
  },
  {
    title: '创建时间',
    width: '12%',
    dataIndex: 'createTime'
  },
  {
    title: '状态',
    width: '8%',
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
    width: '8%',
    render: (value, row, index) => (
      row.registerType === '##' ?
        <Fragment>
          <a onClick={() => { setRecord(row); setEditVisible(true) }}>编辑</a>
        </Fragment>
        :
        <Space>
          <Fragment>
            <a onClick={() => { setRecord(row); setEditVisible(true) }}>编辑</a>
            <Popconfirm title="确认删除记录吗?" onConfirm={() => deleteSource(row)}>
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
        <SmartTop handleSubmit={topSubmit} getFields={getFields} onRef={TopRef}><div /></SmartTop>
      </Card>
      {/* 表格 */}
      <Card style={{ marginTop: 8 }}>
        <SmartTable
          bordered
          dataSource={registerRuleList || []}
          columns={tableColumns}
          handleChange={(params: any) => queryRule(params)}
        />
      </Card>
      {/* 编辑弹出框 */}
      <Edit
        visible={editVisible}
        record={record}
        deptList={deptList}
        custList={custList}
        registerTypeList={registerTypeList}
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
    <RegType />
  </KeepAlive>
)
