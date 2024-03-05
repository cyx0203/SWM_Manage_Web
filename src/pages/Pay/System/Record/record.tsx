import { useEffect, useState } from 'react';
import { DomRoot, Ajax, KeepAlive } from '@/components/PageRoot';
import { Table, Space, Form,Input, Button } from 'antd';


const Record = () => {
  const [datasource, setDatasource] = useState([]); //商户与渠道关系数据

  //查询所有数据
  const queryData = () =>{
    //先查询所有操作记录,pay表
    Ajax.Post('PayUrl', '/manage/payOperateRecord.selectAll',
    {
    },
    (ret: any) => {
         //加工数组，每条记录增加key
        const newList = ret.list.map((item)=>{
            return {...item,key:item.orderId}
        })
        setDatasource(newList);
    }
    );
  }

  //查询按钮的点击事件，模糊查询
  const onFinish = (values: any) => {
    Ajax.Post('PayUrl', '/manage/payOperateRecord.selectById',
    {
        operId : values.operId,
        orderTrace : values.orderTrace,
        orderId : values.orderId
    },
    (ret: any) => {
         //加工数组，每条记录增加key
        const newList = ret.list.map((item)=>{
            return {...item,key:item.orderId}
        })
        setDatasource(newList);
    }
    );

  };

  useEffect(() => {
    queryData();
  }, []);

  //目录的列表配置
  const columns = [
    {
      title: '管理员工号',
      dataIndex: 'operId',
      key: 'operId',
    },
    {
      title: '原始订单号',
      dataIndex: 'orderTrace',
      key: 'orderTrace',
    },
    {
      title: '订单号',
      dataIndex: 'orderId',
      key: 'orderId',
    },
    {
      title: '操作类型',
      dataIndex: 'opTime',
      key: 'opTime',
      render: (_, row) => (
        row.opTime == 1 ? '退款' : row.opTime == 2 ? '调账' : '手动对账'
      ),
    }
  ];

  return (
    <DomRoot>
        <Space direction="vertical" size="large" style={{
          width: '100%',
        }}>
            <Form
                name="searchForm"
                layout="inline"
                onFinish={onFinish}
                >
                    <Form.Item name="operId" label="管理员工号" >
                        <Input placeholder="请输入管理员工号..."/>
                    </Form.Item>
                    <Form.Item name="orderTrace" label="原始订单号" >
                        <Input placeholder="请输入原始订单号..."/>
                    </Form.Item>
                    <Form.Item name="orderId" label="订单号" >
                        <Input placeholder="请输入订单号..."/>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            查询
                        </Button>
                    </Form.Item>
            </Form>
            
            <Table
                size="small"
                columns={columns}
                dataSource={datasource}
            />
        </Space>
    </DomRoot>
  )
}

export default () => (
  <KeepAlive>
    <Record />
  </KeepAlive>
)
