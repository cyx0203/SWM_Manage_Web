import { useEffect, useState, useRef } from 'react';
import { DomRoot, Ajax, KeepAlive } from '@/components/PageRoot';
import { Card, Drawer, message } from 'antd';
import SmartTop from "@/components/SmartTop";
import SmartTable from "@/components/SmartTable";
import { CheckOutlined, CloseOutlined, LoadingOutlined, MinusOutlined, RollbackOutlined } from '@ant-design/icons';
import moment from 'moment';
import Detail from './detail';
import Refund from './refund';
import Flow from './flow';

const Pay = () => {

  const topRef = useRef(null);
  const [merchantIds, setMerchantIds] = useState(null);
  const [hospitals, setHospitals] = useState(null);
  // 查询条件区域 
  const queryArea: any = useRef({ date: [moment(), moment()] });
  // 支付订单查询结果集
  const [payOrderList, setPayOrderList] = useState(null);
  const [filterInfo, setFilterInfo] = useState(null);
  // 表列查询
  const [queryFilters, setQueryFilters] = useState({
    goodsKV: [],
    channelKV: [],
    payStatusKV: [],
    refundStatusKV: [],
  });

  // 退费确认弹出框
  const [refundVisible, setRefundVisible] = useState(false);
  const [orderPayInfo, setOrderPayInfo] = useState(null);

  // 状态图弹出框
  const [flowVisible, setFlowVisible] = useState(false);
  const [orderInfo, setOrderInfo] = useState(null);
  const [payList, setPayList] = useState([]);
  const [payTypes, setPayTypes] = useState([]);

  // 初始化表列查询  
  const initQueryFilters = () => {
    const filters = {
      goodsKV: [],
      channelKV: [],
      payStatusKV: [],
      refundStatusKV: [],
    };
    // 渠道
    const channel = JSON.parse(localStorage.getItem("channelList"));
    channel.forEach(item => {
      filters.channelKV.push({
        value: item.id,
        text: item.name,
      })
    });
    // 支付状态
    filters.payStatusKV = [
      { value: '0', text: <span style={{ color: 'blue' }}><LoadingOutlined /> 初始状态</span> },
      { value: '1', text: <span style={{ color: 'blue' }}><LoadingOutlined /> 待支付</span> },
      { value: '2', text: <span style={{ color: 'green' }}><CheckOutlined /> 已支付</span> },
      { value: '9', text: <span style={{ color: 'red' }}><CloseOutlined /> 已关闭</span> },
    ];
    // 退款状态
    filters.refundStatusKV = [
      { value: '0', text: <span style={{ color: 'black' }}><MinusOutlined /> 未退款</span> },
      { value: '1', text: <span style={{ color: 'orange' }}><RollbackOutlined /> 全额退款</span> },
      { value: '2', text: <span style={{ color: 'orange' }}><RollbackOutlined /> 部分退款</span> },
      { value: '3', text: <span style={{ color: 'orange' }}><RollbackOutlined /> 冲正退款</span> },
    ];

    Ajax.Post('PayUrl', '/manage/payGoods.selectAll',
      {
      },
      (ret: any) => {
        ret.list.forEach(item => {
          filters.goodsKV.push({
            value: item.id,
            text: item.name
          })
        })
        setQueryFilters(filters);
      }
    );
  }

  const queryPayOrder = (params = {}) => {
    const query = { ...queryArea.current, ...params };
    const days = moment(query.date[1]).diff(moment(query.date[0]), 'days');
    console.log("days:", days);
    if (days > 31) {
      return message.error("请查询31天内数据");
    }
    Ajax.Post('PayUrl', '/manage/payOrder.selectAll',
      {
        startDate: moment(query.date[0]).format('YYYYMMDD'),
        endDate: moment(query.date[1]).format('YYYYMMDD'),
        account: localStorage.getItem('account'),
        ...query,
      },
      (ret: any) => {
        setPayOrderList(ret);
      }
    );
  }


  // 查询登录用户名能看到的商户号
  const queryMerUserInfo = () => {
    //hospitalId存在
    if (queryArea.current.hospitalId) {
      Ajax.Post('PayUrl', '/manage/merHospital.selectHospMer',
        {
          hospitalId: queryArea.current.hospitalId,
        },
        (ret: any) => {
          const temp = [];
          ret.list.map((item) => {
            temp.push({ value: item.id, txt: item.name })
          })
          setMerchantIds(temp);
          // queryArea.current.merchantId = ret.merchantIds.tv[0].value;
          // topRef.current.getForm().setFieldsValue({ merchantId: ret.merchantIds.tv[0].value});
        }
      );

    } else {
      //不存在就显示所有商户
      Ajax.Post('PayUrl', '/manage/merMerchant.selectAll',
        {
        },
        (ret: any) => {
          const temp = [];
          ret.list.map((item) => {
            temp.push({ value: item.id, txt: item.name })
          })
          setMerchantIds(temp);
        }
      );
    }
  }

  const queryHospital = () => {
    Ajax.Post('PayUrl', '/manage/kv/hospital.select',
      {
        hospitalId: localStorage.getItem("hospitalId"),
        key: 'id',       // key名称
        value: 'name',   // value名称
        level: '2',
        retKey: 'hospitals'
      },
      (ret: any) => {
        setHospitals(ret.hospitals);
        //默认查的院区
        // queryArea.current.hospitalId = ret?.hospitals?.tv[0]?.value;
        // topRef.current.getForm().setFieldsValue({ hospitalId: ret?.hospitals?.tv[0]?.value });
        queryMerUserInfo();
        queryPayOrder(null);
      }
    );
  }

  const queryPayTypes = () => {
    Ajax.Post('PayUrl', '/manage/payType.selectAll',
      {
      },
      (ret: any) => {
        const temp = ret.list.map(item => {
          return {
            ...item,
            title: item.name,
            value: item.id
          }
        })
        const data = abilitySort(temp, 'thirdId')
        setPayTypes(data);
      }
    );
  }

  //组装成TreeSelect需要的数据格式
  const abilitySort = (arr, property) => {
    let map = {};
    for (let i = 0; i < arr.length; i++) {
      const ai = arr[i];
      if (!map[ai[property]]) map[ai[property]] = [ai];
      else map[ai[property]].push(ai);
    }
    let res = [];
    Object.keys(map).forEach((key) => {
      res.push({ value: key, children: map[key], title: map[key][0].thirdName });
    });
    return res;
  }


  const topSubmit = (params = {}) => {
    queryArea.current = params;
    setFilterInfo({});
    queryPayOrder(null)
  }

  useEffect(() => {
    initQueryFilters();
    queryPayTypes();
    queryHospital();
  }, []);

  // 打开退费窗口
  const openRefundModal = (record, orderId) => {
    //record上添加orderId，退款用
    const temp = { ...record, orderId };
    setOrderPayInfo(temp);
    setRefundVisible(true);
  }

  const exportExcel = (params = {}) => {
    const query = { ...queryArea.current, ...params };
    Ajax.Post('PayUrl', '/downloadTransDetail',
      {
        startDate: moment(query.date[0]).format('YYYYMMDD'),
        endDate: moment(query.date[1]).format('YYYYMMDD'),
        account: localStorage.getItem('account'),
        hospitalId: queryArea.current.hospitalId,
        ...query,
      },
      (ret: any) => {
        window.open(ret.url);
      },
    );
  }

  // 查询订单生命周期
  const queryPayOrderPayList = (record) => {
    Ajax.Post('PayUrl', '/manage/payOrderPay.selectByTrace',
      {
        orderTrace: record.orderTrace
      },
      (ret: any) => {
        const arr = ret.list;
        if (arr.length > 0) {
          setOrderInfo(record)
          setPayList(arr);
          setFlowVisible(true);
        }
        else {
          message.error("暂无记录")
        }
      },
    );
  }

  const getColumns: any = [{
    title: '平台识别号',
    dataIndex: 'orderTrace',
  }, {
    title: '渠道',
    dataIndex: 'channelId',
    filters: queryFilters.channelKV,
    filterMultiple: false,
    filteredValue: filterInfo?.channelId ?? null,
    render: (value, row) => row.channelName
  }, {
    title: '商品名称',
    dataIndex: 'goodsId',
    filters: queryFilters.goodsKV,
    filterMultiple: false,
    filteredValue: filterInfo?.goodsId ?? null,
    render: (value, row) => row.goodsName

  }, {
    title: '买家姓名',
    dataIndex: 'buyerName',
  }, {
    title: '支付状态',
    dataIndex: 'payStatus',
    filters: queryFilters.payStatusKV,
    filterMultiple: false,
    filteredValue: filterInfo?.payStatus ?? null,
    render: (value) => {
      if (value === '0')
        return <span style={{ color: 'blue' }}><LoadingOutlined /> 初始状态</span>
      if (value === '1')
        return <span style={{ color: 'blue' }}><LoadingOutlined /> 待支付</span>
      if (value === '2')
        return <span style={{ color: 'green' }}><CheckOutlined /> 已支付</span>
      if (value === '9')
        return <span style={{ color: 'red' }}><CloseOutlined /> 已关闭</span>
      return ''
    }
  }, {
    title: '退款状态',
    dataIndex: 'refundStatus',
    filters: queryFilters.refundStatusKV,
    filterMultiple: false,
    filteredValue: filterInfo?.refundStatus ?? null,
    render: (value) => {
      if (value === '0')
        return '-'
      if (value === '1')
        return <span style={{ color: 'orange' }}><RollbackOutlined /> 全额退款</span>
      if (value === '2')
        return <span style={{ color: 'orange' }}><RollbackOutlined /> 部分退款</span>
      if (value === '3')
        return <span style={{ color: 'orange' }}><RollbackOutlined /> 冲正退款</span>
      return ''
    }
  }, {
    title: '创建时间',
    dataIndex: 'createTimeFormat',
  }, {
    title: '订单总金额(元)',
    dataIndex: 'orderAmt',
    align: 'right',
    render: value => `${(value / 100).toFixed(2)}`,
  }, {
    title: '退款总金额(元)',
    dataIndex: 'refundAmt',
    align: 'right',
    render: value => `${(value / 100).toFixed(2)}`,
  }, {
    title: '操作',
    align: 'center',
    render: (text, record) => (
      <a onClick={() => {
        queryPayOrderPayList(record);
      }}>状态图</a>
    )
  }
  ];

  // 查询条件区域配置
  const getQueryFields = () => {
    return [{
      type: 'range-picker',
      style: { width: 250 },
      field: 'date',
      label: '日期',
      initialValue: [moment(), moment()],
    }, {
      type: 'select',
      label: '院区',
      style: { width: '250px' },
      field: 'hospitalId',
      // required: true,
      options: hospitals?.tv ?? [],
      placeholder: '请选择院区...',
      allowClear: true,
      // initialValue: hospitals?.tv[0] ?? '',
      onChange: value => {
        queryArea.current.hospitalId = value;
        queryMerUserInfo();
      }
    }, {
      type: 'select',
      label: '商户',
      style: { width: 180 },
      field: 'merchantId',
      options: merchantIds,
      placeholder: '请选择商户...',
      allowClear: true,
    }, {
      type: 'input',
      style: { width: 250 },
      placeholder: '请输入平台识别号/订单号...',
      field: 'orderTrace',
      label: '平台识别号/订单号'
    }, {
      type: 'input',
      style: { width: 180 },
      placeholder: '请输入患者姓名/手机号',
      field: 'payUserInfo',
      label: '患者信息'
    },
    {
      type: 'treeselect',
      label: '支付类型',
      style: { width: 380 },
      field: 'payTypeId',
      treeData: payTypes,
      placeholder: '请选择支付类型...',
      allowClear: true,
    }, {
      type: 'button',
      buttonList: [{
        type: 'primary',
        htmlType: 'submit',
        buttonText: '查询',
        style: { marginLeft: 8 }
      }, {
        type: 'primary',
        buttonText: '导出',
        style: { marginLeft: 8 },
        onClick: () => { exportExcel() }
      }]
    }]
  }

  return (
    <DomRoot>
      <Card>
        <SmartTop handleSubmit={topSubmit} getFields={getQueryFields} onRef={topRef}><div /></SmartTop>
      </Card>
      <Card style={{ marginTop: 8 }}>
        <SmartTable
          bordered
          dataSource={payOrderList || []}
          columns={getColumns}
          expandable={{
            expandedRowRender: record => <Detail record={record} openRefundModal={openRefundModal} />,
          }}
          handleChange={(params: any, filtersArg: any) => { setFilterInfo(filtersArg); queryPayOrder(params) }}
        />
      </Card>
      {/* 查询状态流程 */}
      <Drawer
        title={`平台订单号：${orderInfo ? orderInfo.orderTrace : ''}`}
        width={450}
        visible={flowVisible}
        onClose={() => setFlowVisible(false)}
        closable={false}
        destroyOnClose
      >
        <Flow paylist={payList} />
      </Drawer>
      {/* 发起退款 */}
      <Refund
        visible={refundVisible}
        orderPayInfo={orderPayInfo}
        onClose={() => setRefundVisible(false)}
        onOk={() => {
          setRefundVisible(false);
          queryPayOrder();
        }}
      />
    </DomRoot>
  );
}

export default () => (
  <KeepAlive>
    <Pay />
  </KeepAlive>
)
