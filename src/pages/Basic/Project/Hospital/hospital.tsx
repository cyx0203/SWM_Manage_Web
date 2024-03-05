import { useEffect, useState, useRef } from 'react';
import { DomRoot, Ajax, KeepAlive } from '@/components/PageRoot';
import { Card, Tag, Table, Input, Space, Popconfirm, Button } from 'antd';
import Edit from "./edit";

const { Search } = Input;

const Hospital = () => {

  const [merHospList, setMerHospList] = useState(null);
  const [editVisible, setEditVisible] = useState(null);
  const [record, setRecord] = useState(null);
  const [branchTree, setBranchTree] = useState(null);
  const [level, setLevel] = useState("2");
  const args: any = useRef(null);



  const queryAreaBranch = () => {
    Ajax.Post('BasicUrl', '/manage/tree/comBranch.selectAll',
      {
        childName: 'children',
        retKey: 'branchTree',
        root: "0000",
        id: "id",
        parentid: "par_id" 
      },
      (ret: any) => {
        setBranchTree(ret.branchTree);
      }
    );
  }

  const queryHospital = (params) => {
    const query = { ...args.current, ...params };
    Ajax.Post('BasicUrl', '/manage/hospital.selectPar',
      {
        branchList: '0000',
        ...query,
      },
      (ret: any) => {
        setMerHospList(ret.list)
      }
    );
  }

  const stopHosp = (params) => {
    Ajax.Post('BasicUrl', '/manage/hospital.stopOrStart',
      {
        id: params.id,
        active: params.active === "1" ? "2" : "1"
      },
      (ret: any) => {
        queryHospital(null);
      }
    );
  }

  useEffect(() => {
    queryAreaBranch();
    queryHospital(null);
  }, []);

  const columns: any = [{
    key: 'branchLv2Name',
    title: '城市',
    dataIndex: 'branchLv2Name',
  }, {
    key: 'branchLv3Name',
    title: '地区',
    dataIndex: 'branchLv3Name',
  }, {
    key: 'id',
    title: '医院编号',
    dataIndex: 'id',
  }, {
    key: 'name',
    title: '医院名称',
    dataIndex: 'name',
  }, {
    key: 'typeName',
    title: '医院类型',
    dataIndex: 'typeName',
  }, {
    key: 'active',
    title: '状态',
    dataIndex: 'active',
    render: (text) => (
      text === '1' ? <Tag color="green">启用</Tag> : <Tag color="red">停用</Tag>
    )
  }, {
    key: 'updateTimeFormat',
    title: '最后更新时间',
    dataIndex: 'updateTimeFormat',
  },
  {
    title: '操作',
    key: 'action',
    align: 'center',
    render: (text, row) => (
      <Space>
        {row.level === '1' &&
          <a style={{ marginRight: 10 }}
            onClick={() => { setEditVisible(true); setRecord(row); setLevel("2");}}>
            新增院区
          </a>
        }
        <a
          style={{ marginRight: 10 }}
          onClick={() => { setEditVisible(true); setRecord(row); setLevel(row.level); }}
        >
          编辑
        </a>
        {row.active === '1' &&
          <Popconfirm title="确认停用吗?" onConfirm={() => stopHosp(row)}>
            <a>停用</a>
          </Popconfirm>
        }
        {row.active === '2' &&
          <Popconfirm title="确认启用吗?" onConfirm={() => stopHosp(row)}>
            <a>启用</a>
          </Popconfirm>
        }

      </Space>
    )
  }];

  return (
    <DomRoot>
      <Card>
        <Search
          placeholder="请输入医院编号 / 名称..."
          enterButton="查询"
          style={{ width: 400 }}
          onSearch={value => queryHospital({ keywords: value })}
        />
        <Button type='primary' style={{ marginLeft: 20 }} onClick={() => { setEditVisible(true); setRecord(null); setLevel("1"); }}>新增</Button>
      </Card>
      <Card style={{ marginTop: 8 }}>
        {merHospList &&
          <Table
            bordered
            size="small"
            columns={columns}
            dataSource={merHospList}
          />
        }
      </Card>
      <Edit
        visible={editVisible}
        row={record}
        branchTree={branchTree}
        level={level}
        onClose={() => setEditVisible(false)}
        onOk={() => {
          setEditVisible(false);
          queryHospital(null);
        }}
      />
    </DomRoot>
  )
}

export default () => (
  <KeepAlive>
    <Hospital />
  </KeepAlive>
)