import { useState, useEffect } from "react";
import { DomRoot, Ajax, KeepAlive } from "@/components/PageRoot";
import SmartTop from "@/components/SmartTop";
import SmartTable from "@/components/SmartTable";
import { Card, Space, Popconfirm } from 'antd';
import Edit from '@/pages/Meal/Set/DishType/edit';

const DishType = () => {
  const [args, setArgs] = useState(null);
  const [dishTypes, setDishTypes] = useState(null);
  const [editVisible, setEditVisible] = useState(false);
  const [record, setRecord] = useState(null);

  const queryDishType = (params) => {
    const query = { ...args, ...params };
    Ajax.Post('MealUrl', '/manage/mealdishtype.query-dishtype',
      {
        ...query,
      },
      (ret: any) => {
        setDishTypes(ret)
        setArgs(query);
      }
    );
  }

  const deleteDishType = (params) => {
    Ajax.Post('MealUrl', '/manage/mealdishtype.delete-dishtype',
      {
        ...params,
      },
      (ret: any) => {
        queryDishType(null);
      }
    );
  }

  useEffect(() => {
    queryDishType(null);
  }, []);

  const columns: any = [
    {
      title: '类别名称',
      dataIndex: 'name',
      key: 'name',
      width: 200,
    },
    {
      title: '简介',
      dataIndex: 'profile',
      key: 'profile',
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
          <Popconfirm title="确认删除吗?" onConfirm={() => deleteDishType({ id: row.id })}>
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
        field: 'name',
        label: '类别名称'
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
          {
            buttonText: '新建',
            style: { marginLeft: '8px' },
            onClick: () => { setEditVisible(true); setRecord(undefined); }
          },
        ]
      }
    ]
  }

  return (
    <DomRoot>
      {/* 查询条件区域 */}
      <Card>
        <SmartTop handleSubmit={queryDishType} getFields={getFields}><div /></SmartTop>
      </Card>
      {/* 表格 */}
      <Card style={{ marginTop: 8 }}>
        <SmartTable
          bordered
          dataSource={dishTypes || []}
          columns={columns}
          handleChange={(params: any) => queryDishType(params)}
        />
      </Card>
      {/* 编辑弹出框 */}
      <Edit
        visible={editVisible}
        record={record}
        onClose={() => setEditVisible(false)}
        onOk={() => {
          setEditVisible(false);
          queryDishType(null);
        }}
      />
    </DomRoot>
  );
};

export default () => (
  <KeepAlive>
    <DishType />
  </KeepAlive>
)