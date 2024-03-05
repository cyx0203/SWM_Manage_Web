import { Fragment, useEffect, useState, useRef } from 'react';
import { DomRoot, Ajax, KeepAlive } from '@/components/PageRoot';
import { Card, Tag, Popover } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import SmartTop from "@/components/SmartTop";
import SmartTable from "@/components/SmartTable";
import moment from 'moment';
import Detail from './detail';

const Order = () => {

  const [orderList, setOrderList] = useState(null);
  const [deptKV, setDeptKV] = useState(null);
  // 查询条件区域 
  const topRef = useRef(null);
  const queryArea: any = useRef({ date: [moment(), moment()] });

  const queryOrder = (params = {}) => {
    const query = { ...queryArea.current, ...params };
    Ajax.Post('AptUrl', '/manage/srcOrder.selectAll',
      {
        startDate: moment(query.date[0]).format('YYYYMMDD'),
        endDate: moment(query.date[1]).format('YYYYMMDD'),
        ...query,
      },
      (ret: any) => {
        setOrderList(ret)
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
        setDeptKV(ret.list);
      }
    );
  }

  const topSubmit = (params = {}) => {
    queryArea.current = params;
    queryOrder(null)
  }

  useEffect(() => {
    queryDepartment();
    queryOrder(null);
  }, []);

  // 患者信息详情
  const popContentForUser = (item) => {
    return (
      <Fragment>
        患者编号：{item.userId}<br />
        患者姓名：{item.userName}<br />
        身份证号：{item.idcard}<br />
        手机号码：{item.userPhone}
      </Fragment>)
  }

  const getColumns: any = [{
    title: '订单编号',
    dataIndex: 'orderNo',
  }, {
    title: '渠道',
    dataIndex: 'custName',
  }, {
    title: '预约日期',
    dataIndex: 'date',
    render: (value, row, index) => (
      <span>{value.substring(0, 4)}-{value.substring(4, 6)}-{value.substring(6, 8)}
        {row.noon === '1' ? ' 上午' : ' 下午'}</span>
    )
  }, {
    title: '科室',
    dataIndex: 'deptName',
  }, {
    title: '号别',
    dataIndex: 'regTypeName',
  }, {
    title: '医生',
    dataIndex: 'docName',
    render: (value, row, index) => (
      value ? value : '-'
    )
  }, {
    title: '患者编号',
    dataIndex: 'userId',
  }, {
    title: '患者姓名',
    dataIndex: 'userName',
    render: (value, row, index) => (
      <Popover content={popContentForUser(row)} trigger="hover" placement="rightTop">
        <span style={{ cursor: 'pointer' }}>{value} <EyeOutlined style={{ color: 'orange' }} /></span>
      </Popover>
    )
  }, {
    title: '支付方式',
    dataIndex: 'payName',
  }, {
    title: '挂号费（元）',
    dataIndex: 'payFee',
    align: 'right'
  }, {
    title: '创建时间',
    dataIndex: 'createTimeFormat',
  }, {
    title: '订单状态',
    dataIndex: 'status',
    render: (value) => (
      value === '2' ? <Tag color='green'>已预约</Tag> :
        value === '3' ? <Tag color='red'>已取消</Tag> :
          value === '9' ? <Tag color='blue'>已就诊</Tag> : <Tag color='red'>未定义</Tag>
    )
  },
  ]

  // 查询条件区域配置
  const getQueryFields = () => {
    return [{
      type: 'range-picker',
      style: { width: 250 },
      field: 'date',
      label: '预约日期',
      required: true,
      message: '请输入查询日期',
      initialValue: [moment(), moment()],
    }, {
      type: 'select',
      label: '渠道',
      style: { width: 250 },
      field: 'custId',
      placeholder: '请选择渠道...',
      showSearch: true,
      allowClear: true,
      options: [{
        txt: '窗口-HIS',
        value: '001',
      }, {
        txt: '自助机-源启',
        value: '002',
      }, {
        txt: '线上-医依帮',
        value: '003',
      }],
    }, {
      type: 'select',
      label: '科室',
      style: { width: 250 },
      field: 'queryDeptId',
      placeholder: '请选择查询科室...',
      showSearch: true,
      options: deptKV,
      allowClear: true,
    }, {
      type: 'input',
      style: { width: 250 },
      placeholder: '请输入患者编号/姓名',
      field: 'userInfo',
      label: '患者信息'
    }, {
      type: 'button',
      buttonList: [{
        type: 'primary',
        htmlType: 'submit',
        buttonText: '查询',
        style: { marginLeft: 8 }
      }
      ]
    }]
  }

  return (
    <DomRoot>
      {/* 查询条件区域 */}
      <Card>
        <SmartTop handleSubmit={topSubmit} getFields={getQueryFields} onRef={topRef}><div /></SmartTop>
      </Card>
      {/* 表格 */}
      <Card style={{ marginTop: 8 }}>
        <SmartTable
          bordered
          dataSource={orderList || []}
          columns={getColumns}
          expandable={{
            expandedRowRender: record => <Detail record={record} />,
          }}
          handleChange={(params: any) => queryOrder(params)}
        />
      </Card>
    </DomRoot>
  )
}

export default () => (
  <KeepAlive>
    <Order />
  </KeepAlive>
)
