import { DomRoot, KeepAlive, Ajax } from "@/components/PageRoot";
import { Card, Space } from "antd";
import SmartTable from "@/components/SmartTable";
import SmartTop from "@/components/SmartTop";
import { useState, useEffect } from "react";
import Edit from './edit';

const CanteenEmployee = () => {
  const [employee, setEmployee] = useState(null);
  const [users, setUsers] = useState(null);
  const [hospitals, setHospitals] = useState(null);
  const [hospitalTree, setHospitalTree] = useState(null);
  const [canteens, setCanteens] = useState(null);
  const [canteenedit, setCanteenedit] = useState(null);
  const [editVisible, setEditVisible] = useState(false);
  const [record, setRecord] = useState(null);
  const [args, setArgs] = useState(null);

  const queryCanteenKV = (params) => {
    Ajax.Post('MealUrl', '/manage/kv/mealcanteen.query-canteen',
      {
        key: 'id',       // key名称
        value: 'name',   // value名称
        retKey: 'canteenKV',
        ...params,
      },
      (ret: any) => {
        setCanteens(ret.canteenKV)
      }
    );
  }

  const queryCanteenEdit = (params) => {
    Ajax.Post('MealUrl', '/manage/kv/mealcanteen.query-canteen',
      {
        key: 'id',       // key名称
        value: 'name',   // value名称
        retKey: 'canteenkv',
        ...params,
      },
      (ret: any) => {
        setCanteenedit(ret.canteenkv);
      }
    );
  }

  const queryCanteenEmployee = (params) => {
    const query = { ...args, ...params };
    Ajax.Post('MealUrl', '/manage/mealcanteenemployee.query-canteenemployee',
      {
        ...query,
      },
      (ret: any) => {
        setEmployee(ret);
        setArgs(query);
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
        queryCanteenEmployee({ hospitalId: localStorage.getItem("hospitalId") });
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

  const queryUser = (params) => {
    Ajax.Post('MealUrl', '/manage/kv/user.selectByPrimaryKey',
      {
        key: 'id',       // key名称
        value: 'account',   // value名称
        retKey: 'userKV',
        isAll: true,
        iscanteen: true,
        ...params,
      },
      (ret: any) => {
        setUsers(ret.userKV)
      }
    );
  }

  useEffect(() => {
    queryHospitalTree({ hospitalId: localStorage.getItem("hospitalId"), root: localStorage.getItem("hospitalId"), id: "id", parentid: "par_id" });
    queryCanteenKV({ hospitalId: localStorage.getItem("hospitalId") });
    queryHospital({ hospitalId: localStorage.getItem("hospitalId") });
    queryUser({ hospitalId: localStorage.getItem("hospitalId") });
    queryCanteenEdit({ hospitalId: localStorage.getItem("hospitalId") });
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
      title: '所属食堂',
      dataIndex: 'canteenId',
      align: 'canteenId',
      width: 150,
      render: (d: string | number) => <span>{canteens && canteens.kv[d]}</span>
    },
    {
      title: '操作',
      key: 'action',
      align: 'center',
      width: 200,
      render: (text: any, row: any, index: any) => (
        <Space size="middle">
          <a style={{ marginRight: '8px' }} onClick={() => { queryCanteenEdit({ hospitalId: row.hospitalId }); setEditVisible(true); setRecord(row) }}>修改</a>
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
        <SmartTop handleSubmit={queryCanteenEmployee} getFields={getFields}><div /></SmartTop>
      </Card>
      <Card style={{ marginTop: 8 }}>
        <SmartTable
          bordered
          dataSource={employee || []}
          columns={columns}
          handleChange={(params: any) => queryCanteenKV(params)}
        />
      </Card>
      <Edit
        visible={editVisible}
        record={record}
        canteenKV={canteenedit}
        userKV={users}
        onClose={() => setEditVisible(false)}
        onOk={() => {
          setEditVisible(false);
          queryCanteenEmployee(null);
        }}
      />
    </DomRoot>
  )
};

export default () => (
  <KeepAlive>
    <CanteenEmployee />
  </KeepAlive>
)