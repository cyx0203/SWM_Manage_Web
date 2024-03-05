import { Ajax } from '@/components/PageRoot';
import { Fragment, useEffect, useState } from "react";
import { Button, Space, Alert, Table, Tag, Popconfirm, message } from "antd";
import { PlusOutlined } from '@ant-design/icons';
import EditSource from './editsource';

export default (props) => {

  const { record, queryAfterEdit } = props;

  const [detailList, setDetailList] = useState(null);
  const [editVisible, setEditVisible] = useState(false);
  const [editRecord, setEditRecord] = useState(false);

  const alertAction = () => {
    return (
      <Space>
        <Button type='primary' onClick={() => { setEditRecord(null); setEditVisible(true) }}><PlusOutlined />添加时段</Button>
      </Space >)
  }

  // 查询规则明细
  const querySourceDetail = () => {
    Ajax.Post('AptUrl', '/manage/ruleSourceDetail.selectById',
      {
        ruleSourceId: record && record.id,
      },
      (ret: any) => {
        setDetailList(ret.list);
      }
    );
  }

    //删除号源明细规则
    const deleteRuleSource = (row) => {
      Ajax.Post('AptUrl', '/manage/ruleSourceDetail.deleteById',
        {
          oid: row.id,
        },
        (ret: any) => {
          message.success('删除规则成功');
          queryAfterEdit();
        }
      );
    }

  //定义表格抬头
  const tableColumns: any = [{
    title: '序号',
    align: 'center',
    width: '5%',
    render: (value, row, index) => (
      index + 1
    ),
  }, {
    title: '时段规则',
    width: '10%',
    dataIndex: 'isGivenTime',
    render: (value) => (
      value === '0' ? <Tag color="green">时令时间</Tag> : <Tag color="blue">指定时间</Tag>
    )
  }, {
    title: '时间段',
    width: '10%',
    render: (value, row, index) => (
      row.stime ? row.stime.substring(0, 2) + ':' + row.stime.substring(2) + '-' + row.etime.substring(0, 2) + ':' + row.etime.substring(2) : ''
    ),
  }, {
    title: '午别',
    width: '10%',
    dataIndex: 'noon',
    render: (value) => (
      value === '4' ? '早间' :
        value === '1' ? '上午' :
          value === '2' ? '下午' :
            value === '3' ? '午间' : '晚间'
    )
  }, {
    title: '分时段类型',
    width: '15%',
    dataIndex: 'timeType',
    render: (value) => (
      value === '0' ? '大时段' :
        value === '1' ? '30分钟' :
          value === '2' ? '1小时' : '无'
    )
  }, {
    title: '分时段号源数',
    dataIndex: 'sourceNum',
    width: '10%',
  }, {
    title: '操作',
    key: 'action',
    align: 'center',
    width: '10%',
    render: (value, row, index) => (
      <Space>
        <Fragment>
          <a onClick={() => { setEditRecord(row); setEditVisible(true); }}>编辑</a>
          <Popconfirm title="确认删除记录吗?" onConfirm={() => deleteRuleSource(row)}>
            <a>删除</a>
          </Popconfirm>
        </Fragment >
      </Space >
    )
  }
  ]

  useEffect(() => {
    querySourceDetail();
  }, []);

  return (
    <Fragment>
      <Alert message='号源时段详情' type="info"
        style={{ marginLeft: 5, marginRight: 22, marginBottom: 10 }}
        action={alertAction()} />
      <Table
        size='small'
        columns={tableColumns}
        dataSource={detailList}
        bordered
        pagination={false}
      />
      {/* 加时间段弹出框 */}
      <EditSource
        visible={editVisible}
        record={editRecord}
        ruleSourceId={record && record.id}
        onClose={() => setEditVisible(false)}
        onOk={() => {
          setEditVisible(false);
          queryAfterEdit();
        }}
      />
    </Fragment>
  );
}