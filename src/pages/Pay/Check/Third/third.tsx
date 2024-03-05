import { DomRoot, KeepAlive, Ajax } from "@/components/PageRoot";
import SmartTop from "@/components/SmartTop";
import SmartTable from "@/components/SmartTable";
import Status from "./status";
import { Card, Tag, Tooltip } from "antd";
import moment from "moment";
import { useState, useEffect, useRef } from "react";
import { CalendarOutlined } from "@ant-design/icons";

const Third = () => {
  const [merchantIds, setMerchantIds] = useState(null);
  const [merUserInfo, setMerUserInfo] = useState(null);
  const [thirdTrans, setThirdTrans] = useState(null);
  const [statusVisible, setStatusVisible] = useState(false);
  const [hospitals, setHospitals] = useState(null);
  const args: any = useRef({ date: [moment(), moment()] });
  const TopRef = useRef(null);
  
  const queryThirdTrans = (params) => {
    const query = { ...args.current, ...params };
    Ajax.Post('PayUrl', '/manage/chkThirdTrans.selectAll',
      {
        startDate: query.date && moment(query.date[0]).format('YYYYMMDD'),
        endDate: query.date && moment(query.date[1]).format('YYYYMMDD'),
        ...query
      },
      (ret: any) => {
        setThirdTrans(ret);
      }
    );
  };

  //查询商户列表
  const queryMerchantIds = () => {
    //hospitalId存在
    if (args.current.hospitalId) {
      Ajax.Post('PayUrl', '/manage/merHospital.selectHospMer',
        {
          hospitalId: args.current.hospitalId,
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

   // 查询登录用户名能看到的商户号
   const queryMerUserInfo = () => {
    Ajax.Post('PayUrl', '/manage/merUser.selectByUserId',
      {
        account: localStorage.getItem('account'),
      },
      (ret: any) => {
        setMerUserInfo(ret.list);
      }
    );
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
        // args.current.hospitalId = ret?.hospitals?.tv[0]?.value;
        // TopRef.current.getForm().setFieldsValue({ hospitalId: ret?.hospitals?.tv[0]?.value });
        queryMerchantIds();
        queryThirdTrans(null);
      }
    );
  }


  const exportExcel = (params = {}) => {
    const query = { ...args.current, ...params };
    Ajax.Post('PayUrl', '/downloadThirdDetail',
      {
        startDate: query.date && moment(query.date[0]).format('YYYYMMDD'),
        endDate: query.date && moment(query.date[1]).format('YYYYMMDD'),
        account: localStorage.getItem('account'),
        hospitalId: args.current.hospitalId,
        ...query
      },
      (ret: any) => {
        window.open(ret.url);
      },
    );
  }

  useEffect(() => {
    queryMerUserInfo();
    queryHospital();
  }, []);
  
  const getFields = () => {
    return [
      {
        type: 'range-picker',
        style: { width: '250px' },
        field: 'date',
        label: '账单日期',
        initialValue: [moment(), moment()],
        disabledDate: (current) => current && current >= moment(new Date()).endOf('day'),
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
        allowClear: true,
        // initialValue: hospitals?.tv[0] ?? '',
        onChange: value => {
          args.current.hospitalId = value;
          // args.current.merchantId = null;
          // TopRef.current.getForm().setFieldsValue({ merchantId: null });
          queryMerchantIds();
          // queryThirdTrans(null);
        }
      },
      {
        type: 'select',
        label: '商户',
        style: { width: '250px' },
        field: 'merchantId',
        // required: true,
        options: merchantIds,
        placeholder: '请选择商户...',
        // initialValue: merchantIds?.tv[0] ?? '',
        allowClear: true
      },
      {
        type: 'input',
        style: { width: '250px' },
        placeholder: '平台订单号/流水号...',
        field: 'queryNo',
        label: '单号'
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
            buttonText: '收取状态',
            icon: < CalendarOutlined />,
            type: "primary",
            style: { marginLeft: '8px' },
            onClick: () => { setStatusVisible(true);}
          },
          {
            type: 'primary',
            buttonText: '导出',
            style: { marginLeft: 8 },
            onClick: () => {exportExcel()}
          }
        ]
      }
    ]
  };


  const columns: any = [
    {
      title: '商户',
      dataIndex: 'merchantId',
      key: 'merchantId',
      render: (value, row) => (<span>{value} / {row.merchantName}</span>)
    },
    {
      title: '交易类型',
      dataIndex: 'transType',
      key: 'transType',
      render: (value) => (
        value === 1 ? <Tag color='green'>入账</Tag> : <Tag color='red'>出账</Tag>
      )
    },
    {
      title: '第三方',
      dataIndex: 'thirdId',
      key: 'thirdId',
      render: (value, row) => (<span>{ row.thirdName }</span>)
    }, 
    {
      title: '对账单号',
      dataIndex: 'checkId',
      key: 'checkId',
      render: (value, row) => (
        row.transType === 1 ? <span>{row.checkId}</span> : <span>{ row.checkOriginId}</span>
      )
    },
    {
      title: '金额(元)',
      dataIndex: 'transAmt',
      key: 'transAmt',
      render: value => <span>{(value * 0.01).toFixed(2)}</span>
    },
    {
      title: '付款账号',
      dataIndex: 'payerAccount',
      width: 150,
      render: (value, row: any) => <span>{value}</span>
    },
    {
      title: '交易时间',
      dataIndex: 'transTime',
      key: 'transTime',
      //render: value => <span>{ moment(value).format("YYYY-MM-DD HH:mm:ss")}</span>
    },
    {
      title: '退费订单号',
      dataIndex: 'checkOriginId',
      key: 'checkOriginId',
      render: (value, row) => (
        row.transType === 1 ? <></> : <span>{ row.checkId}</span>
      )
    },
    {
      title: '第三方支付流水号',
      dataIndex: 'serialNo',
      key: 'serialNo'
    },
    {
      title: '第三方退费流水号',
      dataIndex: 'refundSerialNo',
      key: 'refundSerialNo'
    }
  ];


  const searchHandle = (params) => {
    args.current = params;
    queryThirdTrans(null);
  }

  // 点击日期某个日期，回查该日期对账结果
  const clickCalendar = (date) => {
    args.current.date = [moment(date),moment(date)];
    args.current.hospitalId = hospitals?.tv[0]?.value;
    args.current.merchantId = null;
    TopRef.current.getForm().setFieldsValue({ date:args.current.date, merchantId: null,hospitalId: hospitals?.tv[0]?.value });
    setStatusVisible(false);
    queryThirdTrans(null);
  }



  return (
    <DomRoot>
      <Card>
        <SmartTop handleSubmit={searchHandle} getFields={getFields} onRef={TopRef}><div /></SmartTop>
      </Card>  
      <Card>
        <SmartTable
          bordered
          dataSource={thirdTrans || []}
          columns={columns}
          // handleChange={(params: any) => queryThirdTrans(params)}
          handleChange={(params: any) => {}}
        />
      </Card>
      <Status
        visible={statusVisible}
        merUserInfo={merUserInfo}
        clickCalendar={clickCalendar}
        onClose={() => setStatusVisible(false)}
      />
    </DomRoot>
  );
};

export default () => (
  <KeepAlive>
    <Third />
  </KeepAlive>
)