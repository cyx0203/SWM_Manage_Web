import { DomRoot, Ajax, KeepAlive } from '@/components/PageRoot';
import { Button, Space, Popconfirm, message, Modal, Card } from "antd";
import { useEffect, useState } from "react";
import _ from "lodash";
import SmartTable from "@/components/SmartTable";
import Create from "./creat";

const User = () => {

  const [tableDate, setTableDate] = useState(null);
  const [query, setQuery] = useState(null);
  const [visible, setVisible] = useState(false);
  const [role, setRole] = useState(null);
  const [record, setRecord] = useState(null);
  const [hospitalTree, setHospitalTree] = useState(null);

  const searchHopital = () => {
    Ajax.Post('BasicUrl', '/manage/hospital.selectForTree',
      {}
      , (ret: any) => {
        const rspData = ret.list;
        const treeData = [];
        // 先找一级医院
        for (const item of rspData) {
          if (item.level === '1') {
            treeData.push({
              value: item.id,
              title: item.name,
              children: [],
            })
          }
        }
        // 再找二级医院
        for (const item of rspData) {
          if (item.level === '2') {
            // 开始找他所属的一级医院
            for (const treeItem of treeData) {
              if (item.parId === treeItem.value) { // 找到了
                treeItem.children.push({
                  value: item.id,
                  title: item.name,
                })
                break;
              }
            }
          }
        }
        setHospitalTree(treeData);
      }
    );
  }

  const searchRole = () => {
    Ajax.Post('BasicUrl', '/manage/kv/role.selectByPrimaryKey',
      {
        key: 'id',       // key名称 
        value: 'name',   // value名称
        retKey: 'roleKV',
      }
      , (ret: any) => {
        if (ret && ret.hasOwnProperty('success') && ret.success === true) {
          setRole(ret.roleKV);
          // eslint-disable-next-line @typescript-eslint/no-use-before-define
          handleSearch();
        }
      }
    );
  }

  const handleSearch = (param = {}) => {
    const params = { ...query, ...param };
    Ajax.Post('BasicUrl', '/manage/user.selectByPrimaryKey',
      {
        listKey: "users",
        ...params
      }
      , (ret: any) => {
        if (ret && ret.hasOwnProperty('success') && ret.success === true) {
          setTableDate(ret.users);
          setQuery(params);
        }
        else {
          message.error('查询失败')
        }
      }
    );
  }

  const delHandle = (row: any) => {
    Ajax.Post('BasicUrl', '/manage/user.deleteByPrimaryKey',
      {
        ...row
      }
      , (ret: any) => {
        if (ret && ret.hasOwnProperty('success') && ret.success === true) {
          message.success('删除完成');
          handleSearch();

        } else {
          message.error('删除失败')
        }
      }
    )
  }

  const columns: any = [{
    title: '账号',
    dataIndex: 'account',
  }, {
    title: '姓名',
    dataIndex: 'name',
  }, {
    title: '角色名称',
    dataIndex: 'roleId',
    render: (d: string | number) => <span>{role && role.kv[d]}</span>
  }, {
    title: '联系方式',
    dataIndex: 'phone',
  }, {
    title: '所属医院（院区）',
    dataIndex: 'hospitalName',
  }, {
    title: '操作',
    align: 'center',
    width: 200,
    render: (text: any, row: any, index: any) => (
      <Space size="middle">
        <a style={{ marginRight: '8px' }} onClick={() => { setVisible(true); setRecord(row) }}>修改</a>
        <Popconfirm title="确认删除吗?" onConfirm={() => delHandle(row)}>
          <a style={{ marginRight: '8px' }}>删除</a>
        </Popconfirm>
      </Space>
    ),
  },
  ];

  useEffect(() => {
    searchRole();
    searchHopital();
  }, []);

  return (
    <DomRoot>
      <Card>
        <Button type="primary" style={{ marginBottom: 8 }} onClick={() => { setVisible(true); setRecord(null) }}>新增用户</Button>
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
        <Create role={role} record={record} hospitalTree={hospitalTree} onSuccess={() => { setVisible(false); handleSearch(); }} />
      </Modal>
    </DomRoot>

  );
};

export default () => (
  <KeepAlive>
    <User />
  </KeepAlive>
)

