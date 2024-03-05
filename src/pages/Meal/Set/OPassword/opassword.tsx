import { DomRoot, KeepAlive, Ajax } from "@/components/PageRoot";
import SmartTop from "@/components/SmartTop";
import SmartTable from "@/components/SmartTable";
import { Card, Space, Popconfirm, message } from "antd";
import { useEffect, useState } from "react";
import MD5 from 'blueimp-md5';
import Edit from './edit';

const Opassword = () => {
  const [hospitalTree, setHospitalTree] = useState(null);
  const [editVisible, setEditVisible] = useState(false);
  const [record, setRecord] = useState(null);
  const [hospitals, setHospitals] = useState(null);
  const [opusers, setOpusers] = useState(null);
  const [args, setArgs] = useState(null);
  const [users, setUsers] = useState(null);

  const queryUserOp = (params) => {
    const query = { ...args, ...params };
    Ajax.Post('MealUrl', '/manage/mealcanteenemployee.query-opuser',
      {
        ...query,
      },
      (ret: any) => {
        setOpusers(ret);
        setArgs(query);
      }
    );
  }

  const deleteOpuser = (params) => {
    Ajax.Post('MealUrl', '/manage/mealcanteenemployee.delete-userop',
      {
        ...params,
      },
      (ret: any) => {
        queryUserOp(null);
      }
    );
  }

  const updateOpuser = (params) => {
    Ajax.Post('MealUrl', '/manage/mealcanteenemployee.update-userop',
      {
        ...params,
      },
      (ret: any) => {
        message.success("操作成功");
        queryUserOp(null);
      }
    );
  }

  const queryHospitalTree = (params) => {
    Ajax.Post('MealUrl', '/manage/tree/hospital.selectAll',
      {
        childName: 'children',
        retKey: 'hospitalTree',
        ...params,
      },
      (ret: any) => {
        setHospitalTree(ret.hospitalTree)
      }
    );
  }

  const queryHospital = (params) => {
    Ajax.Post('MealUrl', '/manage/kv/hospital.selectAll',
      {
        key: 'id',       // key名称
        value: 'name',   // value名称
        retKey: 'hospitalKV',
        ...params,
      },
      (ret: any) => {
        setHospitals(ret.hospitalKV);
        queryUserOp({ hospitalId: localStorage.getItem("hospitalId") });
      }
    );
  }

  const queryUser = (params) => {
    Ajax.Post('MealUrl', '/manage/kv/user.selectByPrimaryKey',
      {
        key: 'id',       // key名称
        value: 'account',   // value名称
        retKey: 'userKV',
        isop: true,
        isAll: true,
        ...params,
      },
      (ret: any) => {
        setUsers(ret.userKV)
      }
    );
  }

  useEffect(() => {
    queryHospitalTree({ hospitalId: localStorage.getItem("hospitalId"), root: localStorage.getItem("hospitalId"), id: "id", parentid: "par_id" });
    queryHospital({ hospitalId: localStorage.getItem("hospitalId") });
    queryUser({ hospitalId: localStorage.getItem("hospitalId") });
  }, []);

  const columns: any = [
    {
      title: '用户名',
      dataIndex: 'account',
      key: 'account',
      width: 200,
    },
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      width: 150,
    },
    {
      title: '联系电话',
      dataIndex: 'phone',
      align: 'phone',
      width: 150,
    },
    {
      title: '所属院区',
      dataIndex: 'hospitalId',
      align: 'hospitalId',
      width: 150,
      render: (d: string | number) => <span>{hospitals && hospitals.kv[d]}</span>
    },
    {
      title: '操作',
      key: 'action',
      align: 'center',
      width: 200,
      render: (text: any, row: any, index: any) => (
        <Space size="middle">
          {localStorage.getItem("GGMIDENDPRO_LOGIN_NAME") === row.account ? <a style={{ marginRight: '8px' }} onClick={() => { setEditVisible(true); setRecord(row) }}>修改</a> : <></>}
          <Popconfirm title="确认重置吗?" onConfirm={() => updateOpuser({ id: row.id, password: MD5("Geit@8697") })}>
            <a style={{ marginRight: '8px' }}>重置</a>
          </Popconfirm>
          <Popconfirm title="确认删除吗?" onConfirm={() => deleteOpuser({ id: row.id })}>
            <a style={{ marginRight: '8px' }}>删除</a>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const getFields = () => {
    return [
      {
        type: 'treeselect',
        style: { width: '200px' },
        placeholder: '请选择院区',
        field: 'hospitalId',
        label: '院区',
        treeData: hospitalTree || [],
        treeDefaultExpandAll: true,
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
            onClick: () => { queryUser({ hospitalId: localStorage.getItem("hospitalId") }); setEditVisible(true); setRecord(undefined); }
          },
        ]
      }
    ]
  }

  return (
    <DomRoot>
      {/* 查询条件区域 */}
      <Card>
        <SmartTop handleSubmit={queryUserOp} getFields={getFields}><div /></SmartTop>
      </Card>
      <Card style={{ marginTop: 8 }}>
        <SmartTable
          bordered
          dataSource={opusers || []}
          columns={columns}
          handleChange={(params: any) => queryUserOp(params)}
        />
      </Card>
      <Edit
        visible={editVisible}
        record={record}
        userKV={users}
        onClose={() => setEditVisible(false)}
        onOk={() => {
          setEditVisible(false);
          queryUserOp(null);
        }}
      />
    </DomRoot>
  );
};

export default () => (
  <KeepAlive>
    <Opassword />
  </KeepAlive>
)