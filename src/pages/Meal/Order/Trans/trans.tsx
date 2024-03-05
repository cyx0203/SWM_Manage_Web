import { DomRoot, KeepAlive, Ajax } from "@/components/PageRoot";
import { useState, useEffect } from 'react';
import SmartTable from "@/components/SmartTable";
import SmartTop from "@/components/SmartTop";
import { Card, Space } from 'antd';
import moment from 'moment';
import utils from '../../utils';
import Edit from './edit';
import Voppwd from "./voppwd";
import Reason from "./reason";

const Trans = () => {

  const [args, setArgs] = useState({ date: [moment(), moment()] });
  const [orders, setOrders] = useState(null);
  const [canteens, setCanteens] = useState(null);
  const [hospCanteens, setHospCanteens] = useState(null);
  const [orderDishes, setOrderDishes] = useState(null);
  const [editVisible, setEditVisible] = useState(false);
  const [pwdVisible, setPwdVisible] = useState(false);
  const [reVisible, setReVisible] = useState(false);
  const [record, setRecord] = useState(null);
  const [hospitalTree, setHospitalTree] = useState(null);

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

  const queryOrder = (params) => {
    const query = { ...args, ...params };
    Ajax.Post('MealUrl', '/manage/mealorder.query-order',
      {
        ...query,
        startDate: query.date && moment(query.date[0]).format('YYYYMMDD'),
        endDate: query.date && moment(query.date[1]).format('YYYYMMDD'),
      },
      (ret: any) => {
        setArgs(query);
        setOrders(ret)
      }
    );
  }

  const queryCanteens = (params) => {
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

  const queryHospCanteen = (params) => {
    Ajax.Post('MealUrl', '/manage/kv/mealcanteen.query-canteen',
      {
        key: 'id',       // key名称
        value: 'name',   // value名称
        retKey: 'hospCanteenKV',
        ...params,
      },
      (ret: any) => {
        setHospCanteens(ret.hospCanteenKV)
      }
    );
  }

  //查询管理员对应所属食堂
  const queryCanteen = (params) => {
    Ajax.Post('MealUrl', '/manage/mealcanteenemployee.query-canteenemployee',
      {
        ...params,
      },
      (ret: any) => {
        if (ret?.list.length > 0) {
          queryCanteens({ id: ret.list[0].canteenId, hospitalId: localStorage.getItem("hospitalId") });
          queryOrder({ canteenId: ret.list[0].canteenId, hospitalId: localStorage.getItem("hospitalId"), status: utils.getOrderStatus()[0].value });
        } else {
          queryCanteens({ hospitalId: localStorage.getItem("hospitalId") });
          queryOrder({ hospitalId: localStorage.getItem("hospitalId"), status: utils.getOrderStatus()[0].value });
        }
      }
    );
  }

  //机构树
  const queryHospBranch = (params) => {
    Ajax.Post('MealUrl', '/manage/tree/hospitalbranch.selectAll',
      {
        childName: 'children',
        retKey: 'branchTree',
        ...params,
      },
      (ret: any) => {
      }
    );
  }

  const handleDetail = (params) => {
    Ajax.Post('MealUrl', '/manage/mealorderdish.query-orderDish',
      {
        orderId: params.orderId,
      },
      (ret: any) => {
        setOrderDishes(ret);
        setRecord(params)
        setEditVisible(true);
      }
    );
  }

  useEffect(() => {
    queryHospitalTree({ hospitalId: localStorage.getItem("hospitalId"), root: localStorage.getItem("hospitalId"), id: "id", parentid: "par_id" });
    queryHospBranch({ hospitalId: localStorage.getItem("hospitalId"), root: "0000", id: "id", parentid: "par_id" });
    queryCanteen({ hospitalid: localStorage.getItem("hospitalId") });
  }, []);

  const columns: any = [
    {
      title: '业务订单号',
      dataIndex: 'orderId',
      key: 'orderId',
      width: 200,

    },
    {
      title: '支付订单号',
      dataIndex: 'payOrderId',
      key: 'payOrderId',
      width: 200,
      render:val => val ? val : "-"
    },
    {
      title: '退款订单号',
      dataIndex: 'refund_order_id',
      key: 'refund_order_id',
      width: 200,
      render:val => val ? val : "-"
    },
    {
      title: '送餐日期',
      dataIndex: 'orderDate',
      key: 'orderDate',
      width: 150,
      render: (val) => moment(val).format('YYYY-MM-DD')
    },
    {
      title: '订单人姓名',
      dataIndex: 'receiverName',
      key: 'receiverName',
      width: 150,
    },
    {
      title: '联系电话',
      dataIndex: 'receiverPhoneNo',
      key: 'receiverPhoneNo',
      width: 150,
    },
    {
      title: '午别',
      dataIndex: 'timeInterval',
      key: 'timeInterval',
      width: 150,
      render: (val) => <span>{utils.getTimeiInterval("kv")[val]}</span>
    },
    {
      title: '送餐食堂',
      dataIndex: 'canteenId',
      key: 'canteenId',
      width: 150,
      render: (val) => <span>{canteens && canteens.kv && canteens.kv[val]}</span>
    },
    {
      title: '实付金额(元)',
      dataIndex: 'payAmt',
      key: 'payAmt',
      width: 150,
      render: val => <span>{(val * 0.01).toFixed(2)}</span>
    },
    {
      title: '订单状态',
      dataIndex: 'status',
      key: 'status',
      width: 150,
      render: (val) => <span>{utils.getOrderStatus("kv")[val]}</span>
    },
    {
      title: '操作',
      key: 'action',
      align: 'center',
      width: 200,
      render: (text: any, row: any, index: any) => (
        <Space size="middle">
          <a style={{ marginRight: '8px' }} onClick={() => { handleDetail(row) }}>详情</a>
          {(row.status === '1' || row.status === '3') && <a style={{ marginRight: '8px' }} onClick={() => { setPwdVisible(true); setRecord(row); }}>退款</a>}
        </Space>
      ),
    },
  ];

  const handleChange = (value) => {
    queryHospCanteen({ hospitalId: value });
  }

  const getFields = () => {
    return [
      {
        type: 'range-picker',
        style: { width: '250px' },
        field: 'date',
        label: '日期',
        initialValue: [moment(), moment()],
      },
      {
        type: 'treeselect',
        style: { width: '200px' },
        placeholder: '请选择院区',
        field: 'hospitalId',
        label: '院区',
        treeData: hospitalTree || [],
        treeDefaultExpandAll: true,
        allowClear: false,
        onChange: handleChange
      },
      {
        type: 'select',
        label: '食堂',
        style: { width: '250px' },
        field: 'canteenId',
        options: hospCanteens ? hospCanteens.tv : [],
        placeholder: '请选择食堂...',
        allowClear: true,
      },
      {
        type: 'input',
        style: { width: '180px' },
        placeholder: '请输入',
        field: 'orderId',
        label: '订单号'
      },
      {
        type: 'input',
        style: { width: '180px' },
        placeholder: '请输入',
        field: 'receiverPhoneNo',
        label: '订餐人手机号'
      },
      {
        type: 'select',
        label: '订单状态',
        style: { width: '250px' },
        field: 'status',
        options: utils.getOrderStatus(),
        placeholder: '请选择食堂...',
        allowClear: false,
        initialValue: utils.getOrderStatus()[0].value,
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
        ]
      }
    ]
  }

  return (
    <DomRoot>
      <Card>
        <SmartTop handleSubmit={queryOrder} getFields={getFields}><div /></SmartTop>
      </Card>
      {/* 表格 */}
      <Card style={{ marginTop: 8 }}>
        <SmartTable
          bordered
          dataSource={orders || []}
          columns={columns}
          handleChange={(params: any) => queryCanteen(params)}
        />
      </Card>
      {/* 编辑弹出框 */}
      <Edit
        visible={editVisible}
        record={record}
        orderDishes={orderDishes}
        onClose={() => setEditVisible(false)}
      />
      <Voppwd
        visible={pwdVisible}
        onClose={() => setPwdVisible(false)}
        onOk={() => {
          setPwdVisible(false);
          setReVisible(true);
        }}
      />
      <Reason
        visible={reVisible}
        record={record}
        onClose={() => setReVisible(false)}
        onOk={() => {
          queryOrder(null);
          setReVisible(false);
        }}
      />
    </DomRoot>
  );
};

export default () => (
  <KeepAlive>
    <Trans />
  </KeepAlive>
)