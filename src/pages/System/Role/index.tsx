import { DomRoot, Ajax, KeepAlive } from '@/components/PageRoot';
import { useState, useEffect } from "react";
import SmartTable from "@/components/SmartTable";
import { Space, message, Modal, Button, Card } from "antd";
import Create from "./create";

const Role = () => {

  const [visible, setVisible] = useState(false);
  const [record, setRecord] = useState(null);
  const [tableDate, setTableDate] = useState(null);

  const columns = [{
    title: '角色名称',
    dataIndex: 'name',
    key: 'name',
    width: 150,
  }, {
    title: '说明',
    dataIndex: 'desc',
    key: 'desc',
    width: 200,

  }, {
    title: '操作',
    key: 'action',
    align: 'center',
    width: 200,
    render: (text, row) => (
      <Space size="middle">
        <a style={{ marginRight: '8px' }} onClick={() => { setVisible(true); setRecord(row) }}>修改</a>
        {/* <Popconfirm title="确认删除吗?" onConfirm={() => delHandle(row,index)}>
              <a style={{ marginRight: '8px' }}>删除</a>
            </Popconfirm> */}
      </Space>
    ),
  }];

  const handleSearch = (params = {}) => {
    Ajax.Post('BasicUrl', '/manage/role.selectByPrimaryKey',
      {
        listKey: "role",
        ...params
      }
      , (ret: any) => {
        if (ret && ret.hasOwnProperty('success') && ret.success === true) {
          const temp = ret.role;
          setTableDate(temp);

        }
        else {
          message.error('查询失败')
        }
      }
      , (err: any) => {
        //后台异常、网络异常的回调处理
        //该异常处理函数，可传可不传
        console.log('Ajax Post Error');
        console.log(err);
        console.log('OH No~~~😭');
      }
    );
  }

  useEffect(() => {
    handleSearch();
  }, []);

  return (
    <DomRoot>
      <Card>
        <Button type="primary" style={{ marginBottom: 8 }} onClick={() => { setVisible(true); setRecord(null) }}>新增角色</Button>
        <SmartTable
          bordered
          dataSource={tableDate || []}
          columns={columns}
          handleChange={params => handleSearch(params)}
        />
      </Card>
      <Modal
        title='编辑用户'
        visible={visible}
        onCancel={() => setVisible(false)}
        width='40%'
        footer={null}
        destroyOnClose
      >
        <Create record={record} onSuccess={() => { setVisible(false); handleSearch(); }} />
      </Modal>
    </DomRoot>
  );
};

export default () => (
  <KeepAlive>
    <Role />
  </KeepAlive>
)
