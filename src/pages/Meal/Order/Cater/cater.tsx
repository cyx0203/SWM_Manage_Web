import { DomRoot, KeepAlive, Ajax } from "@/components/PageRoot";
import { Card } from 'antd';
import SmartTable from "@/components/SmartTable";
import SmartTop from "@/components/SmartTop";
import { useEffect, useState, useRef } from 'react';
import moment from "moment";
import utils from "../../utils";

const valueMap = {};
const Cater = () => {
  const [orders, setOrders] = useState(null);
  const [args, setArgs] = useState({ date: moment() });
  const [canteens, setCanteens] = useState(null);
  const [branchTree, setBranchTree] = useState(null);
  const TopRef = useRef(null);

  const loops = (list, parent) => {
    (list || []).map(({ children, value, title }) => {
      const node: any = (valueMap[value] = {
        parent,
        value,
        title
      });
      node.children = loops(children, node);
      return node;
    });
  }

  const getPath = (value) => {
    const path = [];
    let current = valueMap[value];
    while (current) {
      path.unshift(current.title);
      current = current.parent;
    }
    return path;
  }

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
        loops(ret.branchTree,null);
        TopRef.current.getForm().setFieldsValue({ hospBranchIdList: ret.branchTree[0].value });
      }
    );
  }

  const queryBranchRoot = (params) => {
    Ajax.Post('MealUrl', '/manage/hospitalbranch.queryBranch',
      {
        ...params,
      },
      (ret: any) => {
        if (ret.list.length > 0)
          queryHospBranch({ hospitalId: localStorage.getItem("hospitalId"), root: ret.list[0].id, id: "id", parentid: "par_id" });
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
        setCanteens(ret.canteenKV);
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
    Ajax.Post('MealUrl', '/manage/mealorderdish.dish-total',
      {
        ...query,
        status: '1',
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
    Ajax.Post('MealUrl', '/downloadCater',
      {
        ...query,
        status: '1',
        canteenName: canteens.kv[query.canteenId],
        orderDate: moment(query.date).format('YYYY-MM-DD'),
        orderType: utils.getTimeiInterval('kv')[query.timeInterval],
        startDate: moment(query.date).format('YYYYMMDD'),
        endDate: moment(query.date).format('YYYYMMDD'),
        branchName: getPath(query.hospBranchIdList).join("/"),
      },
      (ret: any) => {
        window.open(ret.url);
      }
    );
  }

  useEffect(() => {
    queryCanteen({ hospitalId: localStorage.getItem("hospitalId"), account: localStorage.getItem("GGMIDENDPRO_LOGIN_NAME") });
    queryBranchRoot({ hospitalId: localStorage.getItem("hospitalId") });
  }, []);

  const columns: any = [
    {
      title: '菜品名称',
      dataIndex: 'name',
      key: 'name',
      width: 200,
    },
    {
      title: '菜名数量',
      dataIndex: 'totalNum',
      key: 'totalNum',
      width: 150,
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
    <Cater />
  </KeepAlive>
)