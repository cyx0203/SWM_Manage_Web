import { useEffect, useState, useRef } from 'react';
import { DomRoot, Ajax, KeepAlive } from '@/components/PageRoot';
import { Card, Table, Alert } from 'antd';
import SmartTop from '@/components/SmartTop';
import moment from 'moment';
import Util from './util';

const StatTable = () => {

  // 查询条件区域 
  const topRef = useRef(null);
  const queryArea: any = useRef({ date: [moment(), moment()] });
  const [deptKV, setDeptKV] = useState(null);
  // 查询结果集
  const [tableData, setTableData] = useState(null);

  // 查询统计结果集
  const queryTable = (params = {}) => {
    const query = { ...queryArea.current, ...params };
    Ajax.Post('AptUrl', '/manage/stat.selectStatForTable',
      {
        startDate: moment(query.date[0]).format('YYYYMMDD'),
        endDate: moment(query.date[1]).format('YYYYMMDD'),
        hospitalId: localStorage.getItem('hospitalId'),
        ...query,
      },
      (ret: any) => {
        setTableData(ret.list)
      }
    );
  }

  //SmartTop点击查询
  const topSubmit = (params = {}) => {
    queryArea.current = params;
    queryTable(null)
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

  useEffect(() => {
    queryDepartment();
    queryTable(null);
  }, [])

  // 查询条件区域配置
  const getFields = () => {
    return [{
      type: 'range-picker',
      style: { width: 250 },
      field: 'date',
      label: '日期',
      required: true,
      message: '请输入查询日期',
      initialValue: [moment(), moment()],
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

  const getColumns: any = [{
    title: '科室编号',
    dataIndex: 'deptId',
    render: (value, row) => {
      return {
        children: value,
        props: {
          rowSpan: row.rowSpan
        },
      };
    },
  }, {
    title: '科室名称',
    dataIndex: 'deptName',
    render: (value, row) => {
      return {
        children: value,
        props: {
          rowSpan: row.rowSpan
        },
      };
    },
  }, {
    title: '挂号类别',
    dataIndex: 'registerTypeName',
    render: (value, row) => (
      (value.indexOf('专家号') > -1 || value.indexOf('中医') > -1) ?
        <span>{value}（{row.docName}）</span> : value
    ),
  }, {
    title: '挂号人次',
    dataIndex: 'count',
    render: (value, row, index) => (
      value ? value : '-'
    )
  }, {
    title: '科室合计',
    dataIndex: 'sum',
    render: (value, row) => {
      return {
        children: value,
        props: {
          rowSpan: row.rowSpan
        },
      };
    },
  }]

  const alertMessage = () => {
    const query = { ...queryArea.current };
    const startDate = moment(query.date[0]).format('YYYY-MM-DD');
    const endDate = moment(query.date[1]).format('YYYY-MM-DD');
    return (
      <span>
        统计日期：{startDate === endDate ? startDate : <span>{startDate} 至 {endDate}</span>} / 
        挂号人次总计：{tableData ? Util.countRegisterNum(tableData) : '-'}
      </span>)
  }

  return (
    <DomRoot>
      {/* 查询条件区域 */}
      <Card>
        <SmartTop handleSubmit={topSubmit} getFields={getFields} onRef={topRef}><div /></SmartTop>
      </Card>
      {/* 表格 */}
      <Card style={{ marginTop: 8 }}>
        <Alert message={alertMessage()} type="info"
          style={{ marginBottom: 10 }} />
        <Table
          bordered
          size="small"
          columns={getColumns}
          dataSource={Util.formatTableData(tableData) || []}
          pagination={false}
        />
      </Card>
    </DomRoot>
  )
}

export default () => (
  <KeepAlive>
    <StatTable />
  </KeepAlive>
)