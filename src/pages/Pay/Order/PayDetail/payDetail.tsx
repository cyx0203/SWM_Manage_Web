import { DomRoot, KeepAlive, Ajax } from "@/components/PageRoot";
import SmartTop from "@/components/SmartTop";
import SmartTable from "@/components/SmartTable";
import { Card, Tag, Badge, List, Popconfirm, message } from "antd";
import { useRef, useState, useEffect } from "react";
import moment from "moment";
import { orderStatus, payStatus } from "../../utils";

const PayDetail = () => {
  //院区
  const [hospitals, setHospitals] = useState(null);
  //商户 
  const [merchantIds, setMerchantIds] = useState(null);
  const [merchantObj, setMerchantObj] = useState({});
  //渠道 
  const [channelIds, setChannelIds] = useState(null);
  //支付方式
  const [payTypeIds, setPayTypeIds] = useState(null);
  const [payTypeObj, setPayTypeObj] = useState({});
  //商品类型
  const [goods, setGoods] = useState(null);
  //明细
  const [payDetails, setPayDetails] = useState(null);
  //汇总
  const [payTotal, setPayTotal] = useState(null);
  //类别汇总
  const [payGoodsTotal, setPayGoodsTotal] = useState(null);
  // 查询条件区域 
  const args: any = useRef({ date: [moment(), moment()] });

  const topRef = useRef(null);

  //查询汇总
  const queryPayTotal = () => {

    Ajax.Post('PayUrl', '/manage/payOrderPay.selectPayTotal',
      {
        startDate: moment(args.current.date[0]).format('YYYYMMDD'),
        endDate: moment(args.current.date[1]).format('YYYYMMDD'),
        ...args.current
      },
      (ret: any) => {
        setPayTotal(ret.list[0]);
      }
    );
  }
  //查询商品汇总
  const queryPayGoodsTotal = () => {

    Ajax.Post('PayUrl', '/manage/payOrderPay.selectPayTypeTotal',
      {
        startDate: moment(args.current.date[0]).format('YYYYMMDD'),
        endDate: moment(args.current.date[1]).format('YYYYMMDD'),
        ...args.current
      },
      (ret: any) => {
        setPayGoodsTotal(ret.list);
      }
    );
  }

  //查询明细
  const queryPayDetail = (params = {}) => {
    const query = { ...args.current, ...params };
    const days = moment(query.date[1]).diff(moment(query.date[0]),'days');
    console.log("days:",days);
    if (days > 31)
    {
      return message.error("请查询31天内数据");
    }
    Ajax.Post('PayUrl', '/manage/payOrderPay.selectPayDetail',
      {
        startDate: moment(query.date[0]).format('YYYYMMDD'),
        endDate: moment(query.date[1]).format('YYYYMMDD'),
        ...query
      },
      (ret: any) => {
        setPayDetails(ret);
        queryPayTotal();
        queryPayGoodsTotal();
      }
    );
  }

  // 查询登录用户名能看到的商户号
  const queryMerchantId = () => {
    //hospitalId存在
    if (args.current.hospitalId) {
      Ajax.Post('PayUrl', '/manage/merHospital.selectHospMer',
        {
          hospitalId: args.current.hospitalId,
        },
        (ret: any) => {
          const temp = [];
          const temp2 = {};
          ret.list.map((item) => {
            temp.push({ value: item.id, txt: item.name })
            temp2[item.id] = item.name
          })
          setMerchantIds(temp);
          setMerchantObj(temp2);
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
          const temp2 = {};
          ret.list.map((item) => {
            temp.push({ value: item.id, txt: item.name })
            temp2[item.id] = item.name
          })
          setMerchantIds(temp);
          setMerchantObj(temp2);
        }
      );
    }
  }

  // 查询登录用户名能看到的商户号
  const queryChannelId = () => {
    Ajax.Post('PayUrl', '/manage/kv/platChannel.selectAll',
      {
        key: 'id',       // key名称
        value: 'name',   // value名称
        retKey: 'channelIds',
        hospitalId: args.current.hospitalId
      },
      (ret: any) => {
        setChannelIds(ret.channelIds);
      }
    );
  }

  // 查询支付方式
  const queryPayType = () => {
    Ajax.Post('PayUrl', '/manage/payType.selectAll',
      {
      },
      (ret: any) => {
        const temp = ret.list.map(item =>{
          return {
            ...item,
            title : item.name,
            value : item.id
          }
        })
        const payTypeObj = {};
        ret.list.forEach(item =>{
          payTypeObj[item.id] = item.name
        })
        const data = abilitySort(temp,'thirdId')
        setPayTypeIds(data);
        setPayTypeObj(payTypeObj);
      }
    );
  }

  //组装成TreeSelect需要的数据格式
  const abilitySort = (arr, property)=>{
    let map = {};
    for (let i = 0; i < arr.length; i++) {
      const ai = arr[i];
      if (!map[ai[property]]) map[ai[property]] = [ai];
      else map[ai[property]].push(ai);
    }
    let res = [];
    Object.keys(map).forEach((key) => {
      res.push({ value: key, children: map[key],title : map[key][0].thirdName  });
    });
    return res;
  }

  // 查询商品类型
  const queryGoods = () => {
    Ajax.Post('PayUrl', '/manage/kv/payGoods.selectAll',
      {
        key: 'id',       // key名称
        value: 'name',   // value名称
        retKey: 'goods'
      },
      (ret: any) => {
        setGoods(ret.goods);
      }
    );
  }

  //查询院区
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
        // args.current.hospitalId = ret?.hospitals?.tv[0]?.value;
        // topRef.current.getForm().setFieldsValue({ hospitalId: ret?.hospitals?.tv[0]?.value });
        queryMerchantId();
        queryChannelId();
        queryPayDetail();
      }
    );
  }


  const exportExcel = (params = {}) => {
    const query = { ...args.current, ...params };
    Ajax.Post('PayUrl', '/downloadOrderDetail',
      {
        startDate: moment(query.date[0]).format('YYYYMMDD'),
        endDate: moment(query.date[1]).format('YYYYMMDD'),
        account: localStorage.getItem('account'),
        hospitalId: args.current.hospitalId,
        hospitalName: hospitals?.kv[args.current.hospitalId],
        ...query,
      },
      (ret: any) => {
        window.open(ret.url);
      },
    );
  }

  const topSubmit = (params = {}) => {
    args.current = params;
    queryPayDetail();
  }

  useEffect(() => {
    queryHospital();
    queryPayType();
    queryGoods();
  }, []);

  const onConfirm = (record) => {
    Ajax.Post('PayUrl', '/manage/payOrder.query',
      {
        orderId : record.orderId,
        thirdPtls : record.orderTrace
      },
      (ret: any) => {
        if (ret.success == '0') {
          message.success('支付确认成功');
        } else {
          message.error('支付确认失败');
        }
        queryPayDetail();
      }
    )
  }

  const getFields = () => {
    return [
      {
        type: 'range-picker',
        style: { width: '250px' },
        field: 'date',
        label: '订单日期',
        initialValue: [moment(), moment()],
        allowClear: false
      },
      {
        type: 'select',
        label: '院区',
        style: { width: '250px' },
        field: 'hospitalId',
        // required: true,
        options: hospitals?.tv ?? [],
        placeholder: '请选择院区...',
        // initialValue: hospitals?.tv[0] ?? ''
        allowClear: true,
        onChange: value => {
          args.current.hospitalId = value;
          queryMerchantId();
          queryChannelId();
        }
      },
      {
        type: 'select',
        label: '商户',
        style: { width: '250px' },
        field: 'merchantId',
        options: merchantIds,
        placeholder: '请选择商户...',
        allowClear: true
      },
      {
        type: 'select',
        label: '交易渠道',
        style: { width: '250px' },
        field: 'channelId',
        options: channelIds?.tv ?? [],
        placeholder: '选择交易渠道...',
        allowClear: true
      },
      {
        type: 'input',
        style: { width: 180 },
        placeholder: '请输入患者姓名/手机号',
        field: 'payUserInfo',
        label: '患者信息'
      },
      {
        type: 'input',
        style: { width: '250px' },
        placeholder: '平台订单号/流水号...',
        field: 'queryNo',
        label: '单号'
      },
      {
        type: 'input',
        style: { width: 180 },
        placeholder: '请输入操作员号...',
        field: 'operId',
        label: '操作员号'
      },
      {
        type: 'select',
        label: '订单状态',
        style: { width: '250px' },
        field: 'status',
        options: [{ txt: '待确认', value: '0' }, { txt: '已确认', value: '1' }, { txt: '订单关闭', value: '9' }],
        placeholder: '选择订单状态...',
        allowClear: true
      },
      {
        type: 'treeselect',
        label: '支付类型',
        style: { width: 380 },
        field: 'payTypeId',
        treeData : payTypeIds,
        placeholder: '请选择支付类型...',
        allowClear: true,
      },
      {
        type: 'select',
        label: '商品类型',
        style: { width: '250px' },
        field: 'goodsId',
        options: goods?.tv ?? [],
        placeholder: '选择商品类型...',
        allowClear: true
      },
      {
        type: 'select',
        label: '入账/出账',
        style: { width: 100 },
        field: 'transType',
        options: [{ value: '1', txt: '入账' },
        { value: '-1', txt: '出账' }],
        placeholder: '请选择入账/出账...',
        allowClear: true,
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
            type: 'primary',
            buttonText: '导出',
            style: { marginLeft: 8 },
            onClick: () => { exportExcel() }
          }
        ]
      }
    ]
  };

  const columns: any = [
    {
      title: '交易时间',
      dataIndex: 'date',
      key: 'date',
      render: (value, row) => (value ? <span>{moment(value, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD HH:mm:ss")}</span> : <></>)
    },
    {
      title: '平台订单号',
      dataIndex: 'orderTrace',
      key: 'orderTrace'
    },
    {
      title: '支付订单号',
      dataIndex: 'orderId',
      key: 'orderId'
    },
    {
      title: '退费订单号',
      dataIndex: 'refundId',
      key: 'refundId',
      render: (value, row) => (value && value != '') ? value : '-'
    },
    {
      title: '姓名',
      dataIndex: 'buyerName',
      key: 'buyerName',
      width : 180
    },
    {
      title: '联系电话',
      dataIndex: 'buyerPhone',
      key: 'buyerPhone',
      render: (value, row) => (value && value != '') ? value : '-'
    },
    {
      title: '商户',
      dataIndex: 'merchantId',
      key: 'merchantId',
      render: value => <span>{merchantObj[value]}</span>
    },
    {
      title: '渠道',
      dataIndex: 'channelId',
      width: 150,
      render: (value, row: any) => <span>{channelIds?.kv[value]}</span>
    },
    {
      title: '支付类型',
      dataIndex: 'payTypeId',
      key: 'payTypeId',
      render: value => <span>{payTypeObj[value]}</span>
    },
    {
      title: '商品类型',
      dataIndex: 'goodsId',
      key: 'goodsId',
      render: (value, row) => (<span>{goods?.kv[value]}</span>)
    },
    {
      title: '操作员号',
      dataIndex: 'operId',
      key: 'operId',
      render: (value, row) => (value && value != '') ? value : '-'
    },
    {
      title: '终端号',
      dataIndex: 'termId',
      key: 'termId',
      render: (value, row) => (value && value != '') ? value : '-'
    },
    {
      title: '订单总额',
      dataIndex: 'orderSum',
      key: 'orderSum',
      render: value => `${(value / 100).toFixed(2)}`,
    },
    {
      title: '自费金额',
      dataIndex: 'orderAmt',
      key: 'orderAmt',
      render: value => `${(value / 100).toFixed(2)}`,
    },
    {
      title: '个人医保',
      dataIndex: 'acctPay',
      key: 'acctPay',
      render: value => `${(value / 100).toFixed(2)}`,
    },
    {
      title: '医保统筹',
      dataIndex: 'fundPaySumamt',
      key: 'fundPaySumamt',
      render: value => `${(value / 100).toFixed(2)}`,
    },
    {
      title: '入账/出帐',
      dataIndex: 'transType',
      key: 'transType',
      render: (value) => (
        value === 1 ? <Tag color='green'>入账</Tag> : <Tag color='red'>出账</Tag>
      )
    },
    {
      title: '支付状态',
      dataIndex: 'status',
      key: 'status',
      render(val) {
        return <Badge 
                status={val == '0' ? 'processing': (val == '1' ? 'success' : 'error')} 
                text={val == '0' ? '待确认': (val == '1' ? '已确认' : '订单关闭')}
                />;
      },
    },
    {
      title: '操作',
      align: 'center',
      render: (text, record) => {
        if (record.status == '0') {
          return <Popconfirm title="确认吗?" onConfirm={() => { onConfirm(record) }}>
            <a
              style={{ marginLeft: 10 }}
            >支付结果确认
            </a>
          </Popconfirm>
        } else {
          return ''
        }
      }
    }
  ];


  return (
    <DomRoot>
      <Card>
        <SmartTop handleSubmit={topSubmit} getFields={getFields} onRef={topRef}><div /> </SmartTop>
      </Card>
      <Card style={{ marginTop: 8 }}>

        {payTotal ?
          <span style={{ fontSize: '20px', fontWeight: '1000' }}>
            总计已确认笔数：<span style={{ color: '#FF0000' }}>{payTotal.incount}笔 </span> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            总计已确认金额：<span style={{ color: '#000fff' }}>{payTotal.income.toFixed(2)}元</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            统筹总计已确认金额：<span style={{ color: '#000fff' }}>{payTotal.ybplan.toFixed(2)}元</span>
          </span>
          : null}
        <br />
        <List
          style={{ marginTop: '12px' }}
          grid={{ column: 5 }}
          dataSource={payGoodsTotal ? payGoodsTotal : []}
          size="small"
          renderItem={(map: any) => (
            <List.Item>

              <span style={{ fontSize: '15px', float: 'left', fontWeight: '700' }}>
                {goods ? (map.goodsId ? goods?.kv[map.goodsId] : '未知') : null}：
              </span>
              <List
                dataSource={map.children}
                size="small"
                style={{ float: 'left' }}
                split={false}
                itemLayout="vertical"
                renderItem={(d: any) => (<>
                  <List.Item>
                    <span style={{ fontSize: '14px' }}>{d.transType === 1 ? "入账" : "出账"}：
                      <span style={{ color: '#FF0000', fontSize: '14px' }}>{d.incount}笔</span>/
                      <span style={{ color: '#000fff', fontSize: '14px' }}>{d.income.toFixed(2)}元；</span>
                    </span>
                  </List.Item></>
                )}
              />
            </List.Item>
          )}
        />

      </Card>
      <Card style={{ marginTop: 8 }}>
        <SmartTable
          bordered
          dataSource={payDetails || []}
          columns={columns}
          handleChange={(params: any) => {}}
          scroll={(payDetails && payDetails.list.length != 0) ? {
            x:2400
          }:{}}
        />
      </Card>
    </DomRoot>
  );
};

export default () => (
  <KeepAlive>
    <PayDetail />
  </KeepAlive>
)