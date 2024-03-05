import { useEffect, useRef, useState } from 'react';
import { DomRoot, Ajax, KeepAlive } from '@/components/PageRoot';
import { Card, Tag } from 'antd';
import moment from 'moment';
import SmartTop from '@/components/SmartTop';
import SmartTable from '@/components/SmartTable';


const Add = () => {

  const [addInfoList, setAddInfoList] = useState(null);
  const TopRef = useRef(null);
  // 查询条件区域 
  const queryArea: any = useRef({ date: [moment().subtract(30, "d"), moment()] });

  //查询加号记录
  const queryAddInfo = (params = {}) => {
    const query = { ...queryArea.current, ...params };
    Ajax.Post('AptUrl', '/manage/srcAddRecord.selectByKeyWords',
      {
        ...query,
        startDate: moment(query.date[0]).format('YYYY-MM-DD'),
        endDate: moment(query.date[1]).format('YYYY-MM-DD'),
        hospitalId: localStorage.getItem('hospitalId'),
      },
      (ret: any) => {
        setAddInfoList(ret);
      }
    );
  }

  //SmartTop点击查询
  const topSubmit = (params = {}) => {
    queryArea.current = params;
    queryAddInfo(null)
  }

  useEffect(() => {
    queryAddInfo(null);
  }, []);

  //定义查询条件
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

  //定义表格抬头
  const tableColumns: any = [{
    title: '序号',
    align: 'center',
    width: 70,
    render: (value, row, index) => (
      index + 1
    ),
  },
  {
    title: '预约日期',
    dataIndex: 'date'
  },
  {
    title: '科室',
    dataIndex: 'deptName',
  },
  {
    title: '号别',
    dataIndex: 'registerTypeName',
  },
  {
    title: '医生',
    dataIndex: 'docName',
  },
  {
    title: '午别',
    dataIndex: 'noon',
    render: (text) => (
      text == "1" ? <Tag color='green'>上午</Tag> : <Tag color='blue'>下午</Tag>
    )
  },
  {
    title: '加号时段',
    render: (value, row, index) => (
      row.stime ? row.stime + '-' + row.etime : ''
    )
  },
  {
    title: '加号数量',
    dataIndex: 'addNum'
  },
  {
    title: '开始序号',
    dataIndex: 'startOrder'
  },
  {
    title: '结束序号',
    dataIndex: 'endOrder'
  },
  {
    title: '操作员',
    dataIndex: 'createUser'
  },
  {
    title: '操作时间',
    dataIndex: 'createTime'
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
          dataSource={addInfoList || []}
          columns={tableColumns}
          handleChange={(params: any) => queryAddInfo(params)}
        />
      </Card>
    </DomRoot>
  )
}

export default () => (
  <KeepAlive>
    <Add />
  </KeepAlive>
)
