import { DomRoot, Ajax, KeepAlive } from '@/components/PageRoot';
import { useState, useEffect } from "react";
import SmartTable from "@/components/SmartTable";
import { Space, message, Modal, Button, Card, Popconfirm, Form, Input } from "antd";

const ChannelType = () => {

  const [form] = Form.useForm()
  const [visible, setVisible] = useState(false);
  const [typename_dis,setTND] = useState(false);
  const [tableDate, setTableDate] = useState(
    {
    pagination:{},
    list:[
  ]});

  const setRecord=(data: any,type: any)=>{
    console.log(data);
    if(type==='edit'){
      form.setFieldValue('id',data.id)
      form.setFieldValue('name',data.name)
      setTND(true)
    } else{
      form.setFieldValue('id',null)
      form.setFieldValue('name',null)
    }
  }
  const delHandle = (row: any) => {
    // Ajax.Post('BasicUrl', '/manage/user.deleteByPrimaryKey',
    //   {
    //     ...row
    //   }
    //   , (ret: any) => {
    //     if (ret && ret.hasOwnProperty('success') && ret.success === true) {
    //       message.success('删除完成');
    //       handleSearch();

    //     } else {
    //       message.error('删除失败')
    //     }
    //   }
    // )
    console.log(row);
    
  }

  const columns = [{
    title: '类型代码',
    dataIndex: 'id',
    key: 'id',
    width: 150,
  }, {
    title: '类型名称',
    dataIndex: 'name',
    key: 'name',
    width: 200,

  }, 
  {
    title: '操作',
    key: 'action',
    align: 'center',
    width: 200,
    render: (text, row) => (
      <Space size="middle">
        <a style={{ marginRight: '8px' }} onClick={() => { setVisible(true); setRecord(row,'edit') }}>修改</a>
        <Popconfirm title="确认删除吗?" onConfirm={() => delHandle(row)}>
        <a style={{ marginRight: '8px' }}>删除</a>
        </Popconfirm>
      </Space>
    ),
  }
];

  
  const onFinish=()=>{
    console.log(form.getFieldsValue());
    
  }

  const handleSearch = (params = {}) => {
    // Ajax.Post('PayUrl', '/manage/payGoods.selectAll',
    //   {
    //     // id: "GET",
    //   }
    //   , (ret: any) => {
    //     if (ret && ret.hasOwnProperty('success') && ret.success === true) {
    //       console.log(ret);
          
    //       // setTableDate(temp);
    //     }
    //     else {
    //       message.error('查询失败')
    //     }
    //   }
    //   , (err: any) => {
    //     //后台异常、网络异常的回调处理
    //     //该异常处理函数，可传可不传
    //     console.error('Ajax Post Error');
    //     console.error(err);
    //   }
    // );
  }

  

  useEffect(() => {
    // handleSearch();
  }, []);

  return (
    <DomRoot>
      <Card>
        <Button type="primary" style={{ marginBottom: 8 }} onClick={() => { setVisible(true); setRecord(null,'add') }}>创建</Button>
        <SmartTable
          bordered
          dataSource={tableDate || []}
          columns={columns}
          handleChange={params => handleSearch(params)}
        />
      </Card>
      <Modal
        title='编辑渠道'
        visible={visible}
        onCancel={() => {setVisible(false);setTND(false)}}
        width='40%'
        footer={null}
        destroyOnClose
      >
    <Form
    form={form}
    name="pay_goods"
    labelCol={{ span: 8 }}
    wrapperCol={{ span: 16 }}
    style={{ maxWidth: 600 }}
    initialValues={{ remember: true }}
    onFinish={onFinish}
    autoComplete="off"
  >
    <Form.Item
      label="类型代码"
      name="id"
      rules={[{ required: true, message: '请输入!' }]}
    >
      <Input disabled={typename_dis} placeholder={'请输入'}/>
    </Form.Item>

    <Form.Item
      label="类型名称"
      name="name"
      rules={[{ required: true, message: '请输入!' }]}
    >
      <Input placeholder={'请输入'}/>
    </Form.Item>

    <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
      <Button type="primary" htmlType="submit">
        确认
      </Button>
    </Form.Item>
  </Form>
      </Modal>
    </DomRoot>
  );
};

export default () => (
  <KeepAlive>
    <ChannelType />
  </KeepAlive>
)
