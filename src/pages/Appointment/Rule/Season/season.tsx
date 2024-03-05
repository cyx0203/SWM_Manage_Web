import { Fragment, useEffect, useState } from 'react';
import { DomRoot, Ajax, KeepAlive } from '@/components/PageRoot';
import { Card, Table, Button, Tag, Popconfirm, message } from 'antd';
import Edit from './edit';

const Season = () => {

  const [seasonList, setSeasonList] = useState(null);
  const [editVisible, setEditVisible] = useState(false);
  const [record, setRecord] = useState(null);

  //查询所有令时规则
  const querySeason = (keywords) => {
    Ajax.Post('AptUrl', '/manage/ruleSeason.selectAll',
      {
        hospitalId: localStorage.getItem('hospitalId'),
      },
      (ret: any) => {
        setSeasonList(ret.list)
      }
    );
  }

  //变更令时
  const editActive = (flag) => {
    Ajax.Post('AptUrl', '/manage/ruleSeason.editActive',
      {
        flag,
        hospitalId: localStorage.getItem('hospitalId'),
      },
      (ret: any) => {
        message.success('令时变更成功');
        querySeason(null);
      }
    );
  }

  useEffect(() => {
    querySeason(null);
  }, []);


  //返回启用按钮开关闭合 0-全时令按钮不可点 1-夏冬时令不可点
  const buttonStatus = () => {
    if (seasonList) {
      for (let i = 0; i < seasonList.length; i++) {
        if (seasonList[i].active === "1") {
          if (seasonList[i].pid === "0") {
            return "0";
          } else {
            return "1";
          }
        }
      }
    }
    return "";
  }

  const tableColumns: any = [{
    title: '序号',
    align: 'center',
    width: 70,
    render: (value, row, index) => (
      index + 1
    ),
  },
  {
    title: '主时令',
    dataIndex: 'seasonName',
    align: 'center',
    onCell: (_, index) => {
      if (index % 2 == 0) {
        return { rowSpan: 2 };
      } else {
        return { rowSpan: 0 };
      }
      return {};
    }
  },
  {
    title: '开始日期',
    dataIndex: 'startDate',
    align: 'center',
    render: (text) => (
      text ? text.substring(0, 2) + "-" + text.substring(2) : '-'
    ),
    onCell: (_, index) => {
      if (index % 2 == 0) {
        return { rowSpan: 2 };
      } else {
        return { rowSpan: 0 };
      }
      return {};
    }
  },
  {
    title: '结束日期',
    dataIndex: 'endDate',
    align: 'center',
    render: (text) => (
      text ? text.substring(0, 2) + "-" + text.substring(2) : '-'
    ),
    onCell: (_, index) => {
      if (index % 2 == 0) {
        return { rowSpan: 2 };
      } else {
        return { rowSpan: 0 };
      }
      return {};
    }
  },
  {
    title: '次时令',
    dataIndex: 'noodName',
    align: 'center',
    render: (text) => (
      <Tag color="blue">{text}</Tag>
    )
  },
  {
    title: '开始时间-结束时间',
    align: 'center',
    render: (value, row, index) => (
      row.startTime.substring(0, 2) + ":" + row.startTime.substring(2) + ' - ' + row.endTime.substring(0, 2) + ":" + row.endTime.substring(2)
    ),
  },
  {
    title: '状态',
    dataIndex: 'active',
    align: 'center',
    render: (text) => (
      text === '1' ? <Tag color="green">启用</Tag> : <Tag color="red">停用</Tag>
    )
  },
  {
    title: '操作',
    key: 'action',
    align: 'center',
    width: 200,
    render: (value, row, index) => (
      <Fragment>
        <a onClick={() => { setRecord(row); setEditVisible(true) }}>编辑</a>
      </Fragment>
    ),
  },
  ]

  return (
    <DomRoot>
      {/* 查询条件区域 */}
      <Card>
        <Popconfirm title="确认启用全令时吗?" onConfirm={() => editActive("0")} disabled={buttonStatus() != "1"}>
          <Button type='primary' disabled={buttonStatus() === "0"}>启用全年令时</Button>
        </Popconfirm>
        <Popconfirm title="确认启用夏冬令时吗?" onConfirm={() => editActive("1")} disabled={buttonStatus() != "0"}>
          <Button type='primary' style={{ marginLeft: 20 }} disabled={buttonStatus() == "1"}>启用夏冬令时</Button>
        </Popconfirm>
      </Card>
      {/* 表格 */}
      <Card style={{ marginTop: 8 }}>
        {seasonList &&
          <Table
            bordered
            size="small"
            columns={tableColumns}
            dataSource={seasonList}
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
          querySeason(null);
        }}
      />
    </DomRoot>
  )
}

export default () => (
  <KeepAlive>
    <Season />
  </KeepAlive>
)
