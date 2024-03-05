import { DomRoot, KeepAlive, Ajax } from "@/components/PageRoot";
import SmartTop from "@/components/SmartTop";
import SmartTable from "@/components/SmartTable";
import { Card, Layout, Tree, Popconfirm, message } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { useState, useEffect, Fragment,useRef } from "react";
import Edit from "./edit";


const Devices = () => {
  const [branchTree, setBranchTree] = useState(null);
  const [devices, setDevices] = useState(null);
  const [devStat, setDevStat] = useState(null);
  const [editVisible, setEditVisible] = useState(false);
  const [record, setRecord] = useState(null);
  const [args, setArgs] = useState(null);
  const [hospitalKV, setHospitalKV] = useState(null);
  const TopRef = useRef(null);
  const hospitalId: any = useRef(null);

  //机构树
  const queryHospBranch = (params) => {
    Ajax.Post('BasicUrl', '/manage/tree/hospBranch.selectList',
      {
        childName: 'children',
        retKey: 'branchTree',
        ...params,
      },
      (ret: any) => {
        setBranchTree(ret.branchTree);
      }
    );
  }


  const queryDevStat = (params) => {
    Ajax.Post('BasicUrl', '/manage/kv/code.selectByParId',
      {
        key: 'value',       // key名称
        value: 'txt',   // value名称
        parId: 'C1',
        retKey: 'devStat',
        ...params,
      },
      (ret: any) => {
        setDevStat(ret.devStat)
      
      }
    );
  }

  const queryDevices = (params) => {
    const query = { ...args, ...params };
    Ajax.Post('BasicUrl', '/manage/dev.selectAll',
      {
        hospitalId: hospitalId.current,
        ...query
      },
      (ret: any) => {
        setDevices(ret);
        setArgs(query);
      }
    );
  }

  const startOrStopDev = (row,state) => {
    Ajax.Post('BasicUrl', '/manage/dev.update',
      {
        hospitalId: hospitalId.current,
        id: row.id,
        useStat:state
      },
      (ret: any) => {
        message.success("状态修改成功");
        queryDevices(null);
      }
    );
  }

  const deleteDev = (params) => {
    Ajax.Post('BasicUrl', '/manage/dev.deleteById',
    {
      hospitalId: hospitalId.current,
      id: params.id
    },
    (ret: any) => {
      message.success("删除成功");
      queryDevices(null);
    }
  );
  }

  const queryHospitalTree = () => {
    Ajax.Post('BasicUrl', '/manage/kv/hospital.selectHosByLevel',
      {
        key: 'id',       // key名称
        value: 'name',   // value名称
        hospitalId: localStorage.getItem("hospitalId"),
        level: "2",
        retKey: 'hospitalKV',
      },
      (ret: any) => {
        setHospitalKV(ret.hospitalKV);
        hospitalId.current = ret.hospitalKV.tv[0].value;
        TopRef.current.getForm().setFieldsValue({ hospitalId: ret.hospitalKV.tv[0].value });
        queryHospBranch({ hospitalId: hospitalId.current, root: "0000", id: "id", parentid: "par_id" });
        queryDevices(null);
      }
    );
  }


  useEffect(() => {
    queryHospitalTree();
    queryDevStat(null);
   
  }, []);


  const handleSubmit = (params) => {
    queryHospBranch({ hospitalId: hospitalId.current, root: "0000", id: "id", parentid: "par_id" });
    queryDevices(params);
  }


  const onBranchTreeSelect = (value) => {
    queryDevices({branchList:value[0]});
  }

  const changeHandle = (val) => {
    hospitalId.current = val;
  }

  const getFields = () => {
    return [
      {
        type: 'select',
        label: '院区',
        style: { width: '250px' },
        field: 'hospitalId',
        options: hospitalKV ? hospitalKV.tv : [],
        placeholder: '请选择院区...',
        required: true,
        onSelect: changeHandle
      },
      {
        type: 'input',
        style: { width: '200px' },
        placeholder: '请输入设备编号...',
        field: 'id',
        label: '设备编号'
       
      },
      {
        type: 'select',
        style: { width: '200px' },
        placeholder: '选择使用状态',
        options: devStat?.tv??[],
        field: 'useStat',
        label: '使用状态',
        allowClear: true
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
            buttonText: '新增',
            style: { marginLeft: '8px' },
            onClick: () => { setEditVisible(true); setRecord(undefined); }
          },
        ]
      }
    ]
  }

  const columns: any = [
    {
      title: '编号',
      dataIndex: 'id'
    },
    {
      title: '类型',
      dataIndex: 'devTypeName'
    },
    {
      title: '型号',
      dataIndex: 'model'
    },
    {
      title: '使用状态',
      dataIndex: 'useStatName'
    },
    {
      title: '安装地址',
      dataIndex: 'zhname',
      render: (text, row) => (
        <span>{row.branchLv2Name} / {row.branchLv3Name}{row.instAddr ? ` / ${row.instAddr}` : null}</span>
      ),
    },
    {
      title: '操作',
      key: 'action',
      align: 'center',
      render: (text, row) => (
        <Fragment>
          {row.useStat === '2' &&
            <Popconfirm title="确认启用吗?" onConfirm={() => startOrStopDev(row,"0")}>
              <a style={{ marginRight: 10 }}>
                启用
              </a>
            </Popconfirm>}
          {row.useStat === '0' &&
            <Popconfirm title="确认停用吗?" onConfirm={() => startOrStopDev(row,"2")}>
              <a style={{ marginRight: 10 }}>
                停用
              </a>
            </Popconfirm>}
          <a
            style={{ marginRight: 10 }}
            onClick={() => { setEditVisible(true); setRecord(row) }}
          >
            编辑
          </a>
          <Popconfirm title="确认删除吗?" onConfirm={() => deleteDev(row)}>
            <a>删除</a>
          </Popconfirm>
        </Fragment>
      ),
    },
  ];

  const { Sider, Content } = Layout;
  
  return (
    <DomRoot>
      <Card>
        <SmartTop handleSubmit={handleSubmit} getFields={getFields} onRef={TopRef}><div /></SmartTop>
      </Card>
      <Layout style={{ margin: 8 }}>
        <Sider style={{ background: '#fff', }}>
          {branchTree && <Tree
            showLine
            switcherIcon={<DownOutlined />}
            defaultExpandAll={true}
            onSelect={onBranchTreeSelect}
            treeData={branchTree}
          />}
        </Sider>
        <Content style={{ background: '#fff', marginLeft: '8px', padding: 20 }}>
          <SmartTable
            bordered
            dataSource={devices || []}
            columns={columns}
            handleChange={(params: any) => queryDevices(params)}
          />
        </Content>
      </Layout>
       {/* 编辑弹出框 */}
      <Edit
        visible={editVisible}
        record={record}
        branchTree={branchTree}
        onClose={() => setEditVisible(false)}
        hospitalId={hospitalId.current}
        onOk={() => {
          setEditVisible(false);
          queryDevices(null);
        }}
      />
    </DomRoot>
  );
}

export default () => (
  <KeepAlive>
    <Devices />
  </KeepAlive>
)

