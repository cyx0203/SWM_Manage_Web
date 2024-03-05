import { DomRoot, KeepAlive, Ajax } from "@/components/PageRoot";
import SmartTable from "@/components/SmartTable";
import SmartTop from "@/components/SmartTop";
import { Card, message, Tag } from "antd";
import { useEffect, useState, useRef } from "react";
import moment from "moment";
import utils from "../../utils";

const Delivery = () => {
  const [orders, setOrders] = useState(null);
  const [args, setArgs] = useState<{} & Record<string, any>>({ date: moment() });
  const [canteens, setCanteens] = useState(null);
  const [branchTree, setBranchTree] = useState(null);

  const TopRef = useRef(null);

  //机构树
  const queryHospBranch = (params) => {
    Ajax.Post('MealUrl', '/manage/tree/hospitalbranch.selectList',
      {
        childName: 'children',
        retKey: 'branchTree',
        ...params,
      },
      (ret: any) => {
        setBranchTree(ret.branchTree);
        TopRef.current.getForm().setFieldsValue({ hospBranchIdList: ret.branchTree[0].value });
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
        TopRef.current.getForm().setFieldsValue({ canteenId: ret.canteenKV.tv[ret.canteenKV.tv.length - 1].value });
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

  const queryOrders = (params) => {
    const query = { ...args, ...params };
    Ajax.Post('MealUrl', '/manage/mealorderdish.order-total',
      {
        ...query,
        statuses: '1,5',
        startDate: moment(query.date).format('YYYYMMDD'),
        endDate: moment(query.date).format('YYYYMMDD'),
      },
      (ret: any) => {
        setOrders(ret)
        setArgs(query);
      }
    );
  }

  const downloadExcel = (params) => {
    const query = { ...args, ...TopRef.current.getForm().getFieldsValue() };
    Ajax.Post('MealUrl', '/downloadDelivery',
      {
        ...query,
        status: '1',
        canteenName: canteens.kv[query.canteenId],
        orderDate: moment(query.date).format('YYYY-MM-DD'),
        orderType: utils.getTimeiInterval('kv')[query.timeInterval],
        startDate: moment(query.date).format('YYYYMMDD'),
        endDate: moment(query.date).format('YYYYMMDD'),
      },
      (ret: any) => {
        window.open(ret.url);
      }
    );
  }

  const updateDelivery = (params) => {
    Ajax.Post('MealUrl', '/manage/mealorder.update-orderStatus',
      {
        shipAddressFull: params.address,
        orderDate: moment(args.date).format('YYYYMMDD'),
        canteenId: args?.canteenId ?? null,
      },
      (ret: any) => {
        message.success("操作成功");
        queryOrders(null);
      }
    );
  }

  useEffect(() => {
    queryCanteen({ hospitalId: localStorage.getItem("hospitalId"), account: localStorage.getItem("GGMIDENDPRO_LOGIN_NAME") });
    queryHospBranch({ hospitalId: localStorage.getItem("hospitalId"), root: "0000", id: "id", parentid: "par_id" });
  }, []);

  const showBranch = (params, type) => {
    const address = params.address.split(" ");
    if (address.length != 3)
      return "";
    if (type === "1") {
      return address[0] + " " + address[1];
    } else {
      return address[2];
    }
  }

  const columns: any = [
    {
      title: '病区',
      dataIndex: 'branch',
      key: 'branch',
      width: 200,
      render: (value, row) => showBranch(row, "1")
    },
    {
      title: '床号',
      dataIndex: 'bed',
      key: 'bed',
      width: 150,
      render: (value, row) => showBranch(row, "2")
    },
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      width: 150,
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      key: 'phone',
      width: 150,
    },
    {
      title: '订餐内容',
      dataIndex: 'detail',
      key: 'detail',
      width: 150,
    },
    {
      title: '状态',
      dataIndex: 'status',
      align: 'center',
      key: 'status',
      width: 50,
      render: (value, row) => value === '5' ? <Tag color="success">已送达</Tag> : <Tag color="error">待配送</Tag>
    },
    {
      title: '操作',
      key: 'action',
      align: 'center',
      width: 100,
      render: (text: any, row: any, index: any) => (
        row.status === '5' ? <></> : <a style={{ marginRight: '8px' }} onClick={() => { updateDelivery(row) }}>点击完成</a>
      ),
    },
  ];

  const getFields = () => {
    return [
      {
        type: 'date-picker',
        style: { width: '250px' },
        field: 'date',
        label: '送餐日期',
        initialValue: moment(),
        required: true
      },
      {
        type: 'select',
        label: '供应午别',
        style: { width: '250px' },
        field: 'timeInterval',
        required: true,
        options: utils.getTimeiInterval() ? utils.getTimeiInterval() : [],
        placeholder: '请选择供应午别...',
        initialValue: utils.getTimeiInterval()[0].value,
      },
      {
        type: 'select',
        label: '食堂',
        style: { width: '250px' },
        field: 'canteenId',
        options: canteens ? canteens.tv : [],
        placeholder: '请选择食堂...',
        initialValue: canteens && canteens.tv && canteens.tv[canteens.tv.length - 1].value,
        allowClear: true,
      },
      {
        type: 'treeselect',
        label: '病区',
        style: { width: '250px' },
        field: 'hospBranchIdList',
        treeData: branchTree,
        placeholder: '请选择病区...',
        allowClear: false,
        required: true
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
            buttonText: '导出',
            style: { marginLeft: '8px' },
            onClick: () => downloadExcel(null)
          },
        ]
      }
    ]
  }

  return (
    <DomRoot>
      <Card>
        <SmartTop handleSubmit={queryOrders} getFields={getFields} onRef={TopRef}><div /></SmartTop>
      </Card>
      <Card style={{ marginTop: 8 }}>
        <SmartTable
          bordered
          dataSource={orders || []}
          columns={columns}
          handleChange={(params: any) => queryOrders(params)}
        />
      </Card>
    </DomRoot>
  );
};

export default () => (
  <KeepAlive>
    <Delivery />
  </KeepAlive>
)