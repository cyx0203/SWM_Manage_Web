import { useState, useEffect } from "react";
import { DomRoot, Ajax, KeepAlive } from '@/components/PageRoot';
import { Card, Space, Popconfirm } from 'antd';
import SmartTable from "@/components/SmartTable";
import Edit from "@/pages/Meal/Set/Canteen/edit";
import SmartTop from "@/components/SmartTop";

const Canteen = () => {

  const [canteens, setCanteens] = useState(null);
  const [hospitals, setHospitals] = useState(null);
  const [hospitalTree, setHospitalTree] = useState(null);
  const [editVisible, setEditVisible] = useState(false);
  const [record, setRecord] = useState(null);
  const [args, setArgs] = useState(null);

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
        setHospitals(ret.hospitalKV)
      }
    );
  }

  const queryCanteens = (params) => {
    const query = { ...args, ...params };
    Ajax.Post('MealUrl', '/manage/mealcanteen.query-canteen',
      {
        ...query,
      },
      (ret: any) => {
        setCanteens(ret)
        setArgs(query);
      }
    );
  }

  const queryCanteen = (params) => {
    Ajax.Post('MealUrl', '/manage/mealcanteenemployee.query-canteenemployee',
      {
        ...params,
      },
      (ret: any) => {
        if (ret?.list.length > 0) {
          queryCanteens({ id: ret.list[0].canteenId, hospitalId: localStorage.getItem("hospitalId") });
        } else {
          queryCanteens({ hospitalId: localStorage.getItem("hospitalId") });
        }
      }
    );
  }

  const deleteCanteen = (params) => {
    Ajax.Post('MealUrl', '/manage/mealcanteen.delete-canteen',
      {
        ...params,
      },
      (ret: any) => {
        queryCanteens(null);
      }
    );
  }

  useEffect(() => {
    queryHospitalTree({ hospitalId: localStorage.getItem("hospitalId"), root: localStorage.getItem("hospitalId"), id: "id", parentid: "par_id" });
    queryHospital({ hospitalId: localStorage.getItem("hospitalId"), level: "2" });
    queryCanteen({ hospitalId: localStorage.getItem("hospitalId"), account: localStorage.getItem("GGMIDENDPRO_LOGIN_NAME") });
  }, []);

  const columns: any = [
    {
      title: '食堂名称',
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
      title: '详情',
      dataIndex: 'detail',
      align: 'detail',
      width: 150,
    },
    {
      title: '联系电话',
      dataIndex: 'telephone',
      align: 'telephone',
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
          <a style={{ marginRight: '8px' }} onClick={() => { setEditVisible(true); setRecord(row) }}>修改</a>
          <Popconfirm title="确认删除吗?" onConfirm={() => deleteCanteen({ id: row.id })}>
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
        allowClear: false,
      },
      {
        type: 'input',
        style: { width: '180px' },
        placeholder: '请输入',
        field: 'name',
        label: '食堂名称'
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
        <SmartTop handleSubmit={queryCanteens} getFields={getFields}><div /></SmartTop>
      </Card>
      {/* 表格 */}
      <Card style={{ marginTop: 8 }}>
        <SmartTable
          bordered
          dataSource={canteens || []}
          columns={columns}
          handleChange={(params: any) => queryCanteens(params)}
        />
      </Card>
      {/* 编辑弹出框 */}
      <Edit
        visible={editVisible}
        record={record}
        hospitalKV={hospitals}
        onClose={() => setEditVisible(false)}
        onOk={() => {
          setEditVisible(false);
          queryCanteens(null);
        }}
      />
    </DomRoot>
  )
};

export default () => (
  <KeepAlive>
    <Canteen />
  </KeepAlive>
)