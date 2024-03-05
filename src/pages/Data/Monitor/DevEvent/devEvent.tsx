import { DomRoot, KeepAlive, Ajax } from "@/components/PageRoot";
import SmartTable from "@/components/SmartTable";
import { Card } from "antd";
import { useEffect, useState, useRef } from "react";
import moment from "moment";
import SmartTop from "@/components/SmartTop";


const DevEvent = () => {
  const [records, setRecord] = useState(null);
  const args: any = useRef({ date: [moment(), moment()] });

  const queryRecords = (params) => {
    const query = { ...args.current, ...params };

    
    Ajax.Post('DataUrl', '/manage/desEvent.selectAll',
      {
        
        hospitalId: localStorage.getItem("hospitalId"),
        startDate: query.date && moment(query.date[0]).format('YYYYMMDD'),
        endDate: query.date && moment(query.date[1]).format('YYYYMMDD'),
        ...query
      },
      (ret: any) => {
        setRecord(ret);
      }
    );
  }
  

  const searchHandle = (params) => {
    args.current = params;
    queryRecords(null);
  }

  
  useEffect(() => {
    queryRecords(null);
  },[]);


  const columns: any = [
    {
      title: '设备编号',
      dataIndex: 'devId',
      key: 'devId',
      width: 200
    },
    {
      title: '部件名称',
      dataIndex: 'catName',
      key: 'catName',
      width: 200
    },
    {
      title: '故障类型',
      dataIndex: 'type',
      key: 'type',
      width: 200,
    },
    {
      title: '问题描述',
      dataIndex: 'title',
      key: 'title',
      width: 250
    },
    {
      title: '发生时间',
      dataIndex: 'startTime',
      key: 'startTime',
      width: 150
    },
    {
      title: '解决时间',
      dataIndex: 'dealTime',
      key: 'dealTime',
      width: 150,
    },
    {
      title: '耗时',
      dataIndex: 'tlTotal',
      key: 'tlTotal',
      width: 150,
    }
  ];

  const getFields = () => {
    return [
     {
        type: 'range-picker',
        style: { width: '250px' },
        field: 'date',
        label: '日期',
        initialValue: [moment(), moment()],
      },
      {
        type: 'input',
        style: { width: '180px' },
        placeholder: '设备编号',
        field: 'devId',
        label: '设备编号'
      },
      {
        type: 'button',
        buttonList: [
          {
            type: 'primary',
            htmlType: 'submit',
            buttonText: '查询',
            style: { marginLeft: '8px' }
          },
         
        ]
      }
    ]
  }



  return (
    <DomRoot>
       <Card>
        <SmartTop handleSubmit={searchHandle} getFields={getFields}><div /></SmartTop>
      </Card>
      <Card>
        <SmartTable
          bordered
          dataSource={records || []}
          columns={columns}
          handleChange={(params: any) => queryRecords(params)}
         />
      </Card>
    </DomRoot>
  )
};

export default () => (
  <KeepAlive>
    <DevEvent />
  </KeepAlive>
)