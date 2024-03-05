import { Fragment, useEffect, useState } from 'react';
import { DomRoot, Ajax, KeepAlive } from '@/components/PageRoot';
import { Card, Table, Input, Button, Divider, Popconfirm, message } from 'antd';
import Edit from './edit';

const { Search } = Input;

const DevFty = () => {

  const [factoryList, setFactoryList] = useState(null);
  const [editVisible, setEditVisible] = useState(false);
  const [record, setRecord] = useState(null);

  const queryFactory = (keywords) => {
    Ajax.Post('BasicUrl', '/manage/devFty.selectAll',
      {
        ...keywords,
      },
      (ret: any) => {
        setFactoryList(ret.list)
      }
    );
  }

  useEffect(() => {
    queryFactory(null);
  }, []);

  const removeRecord = (row) => {
    Ajax.Post('BasicUrl', '/manage/devFty.deleteById',
      {
        id: row.id
      },
      (ret: any) => {
        message.success('删除成功');
        queryFactory(null);
      }
    );
  }

  const tableColumns: any = [{
    title: '厂商编号',
    dataIndex: 'id',
  }, {
    title: '厂商名称',
    dataIndex: 'name',
  }, {
    title: '电话',
    dataIndex: 'tel',
  },
  {
    title: '操作',
    key: 'action',
    align: 'center',
    width: 200,
    render: (value, row, index) => (
      <Fragment>
        <a onClick={() => { setRecord(row); setEditVisible(true) }}>编辑</a>
        <Divider type="vertical" />
        <Popconfirm title="确认删除吗?" onConfirm={() => removeRecord(row)}>
          <a>删除</a>
        </Popconfirm>
      </Fragment>
    ),
  },
  ]

  return (
    <DomRoot>
      {/* 查询条件区域 */}
      <Card>
        <Search
          placeholder="请输入厂商编码 / 名称..."
          enterButton="查询"
          style={{ width: 400 }}
          onSearch={value => queryFactory({ keywords: value })}
        />
        <Button type='primary' style={{ marginLeft: 20 }} onClick={() => { setEditVisible(true); setRecord(null) }}>新增</Button>
      </Card>
      {/* 表格 */}
      <Card style={{ marginTop: 8 }}>
        {factoryList &&
          <Table
            bordered
            size="small"
            columns={tableColumns}
            dataSource={factoryList}
          />
        }
      </Card>
      {/* 编辑弹出框 */}
      <Edit
        visible={editVisible}
        record={record}
        onClose={() => setEditVisible(false)}
        onOk={() => {
          setEditVisible(false);
          queryFactory(null);
        }}
      />
    </DomRoot>
  )
}

export default () => (
  <KeepAlive>
    <DevFty />
  </KeepAlive>
)
