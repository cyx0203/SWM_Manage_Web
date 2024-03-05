import { DomRoot, KeepAlive, Ajax } from "@/components/PageRoot";
import { Card, Space, Popconfirm } from 'antd';
import SmartTop from "@/components/SmartTop";
import SmartTable from "@/components/SmartTable";
import { useState, useEffect } from 'react';
import Edit from './edit';

const Orderer = () => {
  const [args, setArgs] = useState(null);
  const [orderers, setOrderers] = useState(null);
  const [editVisible, setEditVisible] = useState(false);
  const [record, setRecord] = useState(null);

  const queryOrderer = (params) => {
    const query = { ...args, ...params };
    Ajax.Post('MealUrl', '/manage/mealuser.query-user',
      {
        ...query,
      },
      (ret: any) => {
        setOrderers(ret)
        setArgs(query);
      }
    );
  }

  const deleteOrderer = (params) => {
    Ajax.Post('MealUrl', '/manage/mealuser.delete-user',
      {
        ...params,
      },
      (ret: any) => {
        queryOrderer(null);
      }
    );
  }

  useEffect(() => {
    queryOrderer(null);
  }, []);

  const columns: any = [
    {
      title: '微信id',
      dataIndex: 'wxId',
      key: 'wxId',
      width: 200,
    },
    {
      title: '住院号',
      dataIndex: 'inpatientId',
      key: 'inpatientId',
      width: 150,

    },
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      width: 150,
    },
    {
      title: '入院日期',
      dataIndex: 'inDate',
      key: 'inDate',
      width: 150,
    },
    {
      title: '身份证号',
      dataIndex: 'idno',
      key: 'idno',
      width: 150,

    },
    {
      title: '操作',
      key: 'action',
      align: 'center',
      width: 200,
      render: (text: any, row: any, index: any) => (
        <Space size="middle">
          <a style={{ marginRight: '8px' }} onClick={() => { setEditVisible(true); setRecord(row) }}>修改</a>
          <a style={{ marginRight: '8px' }} onClick={() => { setEditVisible(true); setRecord(row) }}>地址详情</a>
          <Popconfirm title="确认删除吗?" onConfirm={() => deleteOrderer({ id: row.id })}>
            <a style={{ marginRight: '8px' }}>删除</a>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const getFields = () => {
    return [
      {
        type: 'input',
        style: { width: '180px' },
        placeholder: '请输入',
        field: 'inpatientId',
        label: '住院号'
      },
      {
        type: 'input',
        style: { width: '180px' },
        placeholder: '请输入',
        field: 'name',
        label: '姓名'
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
      {/* 查询条件区域 */}
      <Card>
        <SmartTop handleSubmit={queryOrderer} getFields={getFields}><div /></SmartTop>
      </Card>
      {/* 表格 */}
      <Card style={{ marginTop: 8 }}>
        <SmartTable
          bordered
          dataSource={orderers || []}
          columns={columns}
          handleChange={(params: any) => queryOrderer(params)}
        />
      </Card>
      {/* 编辑弹出框 */}
      <Edit
        visible={editVisible}
        record={record}
        onClose={() => setEditVisible(false)}
        onOk={() => {
          setEditVisible(false);
          queryOrderer(null);
        }}
      />
    </DomRoot>
  );
}

export default () => (
  <KeepAlive>
    <Orderer />
  </KeepAlive>
)