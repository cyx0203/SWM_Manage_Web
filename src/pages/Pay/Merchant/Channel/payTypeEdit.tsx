import { useEffect, useState } from "react";
import { message, Switch, Table, } from "antd";
import { Ajax } from "@/core/trade";

export default (props) => {
  const {
    record,
    onSuccess,
  } = props;

  const [dataSource, setDataSource] = useState([]);
  const [allPayTypeArray, setAllPayTypeArray] = useState([]);
  const [paginationInfo, setPaginationInfo] = useState({
    current: 1,
    pageSize: 10
  });

  const queryChannel = () => {
    //先查mer_pay_type.用于显示在模态框中的所有支付方式
    Ajax.Post('PayUrl', '/manage/merPayType.selectJoinPayTypeAndMerchant',
      {
      },
      (ret: any) => {
        //将未开通的去除，只有开通的显示出来
        const allPayType = ret.list.filter(item => item.active == 1)

        //再查mer_channel，得到该渠道编号下的支付方式
        Ajax.Post('PayUrl', '/manage/merChannel.selectJoin',
          {
            id: record.channelId
          },
          (ret1: any) => {
            const temp = ret1.list.filter(item => item.active == 1) //获取merchannel中已经激活的为temp，全部的是ret1.list
            //创建数组存储唯一标识，有四个主键
            const payType = []; //已经激活的
            const payType2 = []; //全部的
            temp.forEach(item => {
              payType.push(record.channelId + item.merchantId + item.instId + item.payTypeId);
            })
            ret1.list.forEach(item => {
              payType2.push(record.channelId + item.merchantId + item.instId + item.payTypeId);
            })

            setAllPayTypeArray(payType2); //存储全部方式的id

            //计算出rowSpan
            //先计算出相同的出现次数，并组装成对象形式
            let thirdCount = {};
            let payTypeCount = {};
            for (const num of temp) {
              thirdCount[num.thirdName] = thirdCount[num.thirdName] ? thirdCount[num.thirdName] + 1 : 1;
              payTypeCount[num.payTypeName] = payTypeCount[num.payTypeName] ? payTypeCount[num.payTypeName] + 1 : 1;
            }

            //初始化为空，如果设置过rowSpan就加入数组
            let thirdTemp = [];
            let payTypeTemp = [];
            //从上面一次ajax中得到的数据进行加工，展示在页面上
            //如果已经激活的数组中没有当前方式，设置成未开通
            const newList = allPayType.map((item) => {
              let rowSpan = 0; //第三方名称的rowSpan
              let payTypeRowSpan = 0; //支付方式的rowSpan
              if (!thirdTemp.includes(item.thirdName)) {
                rowSpan = thirdCount[item.thirdName];
                thirdTemp.push(item.thirdName);
              }
              if (!payTypeTemp.includes(item.payTypeName)) {
                payTypeRowSpan = payTypeCount[item.payTypeName];
                payTypeTemp.push(item.payTypeName);
              }
              return {
                ...item,
                active: payType.includes(record.channelId + item.merchantId + item.instId + item.payTypeId), //看已激活的数组中有无来显示是否开通
                rowSpan: rowSpan,
                payTypeRowSpan : payTypeRowSpan
              }
            })
            setDataSource(newList);
          })
      })
  }

  useEffect(() => {
    queryChannel();
  }, []);

  //是否开通按钮点击事件
  const onChange = (channelId, merchantId, instId, payTypeId, checked) => {
    //看该渠道编号下的支付方式有没有这个，没有说明是新的，需要新增
    if (allPayTypeArray.includes(channelId + merchantId + instId + payTypeId)) {
      Ajax.Post('PayUrl', '/manage/merChannel.update',
        {
          channelId,
          merchantId,
          instId,
          payTypeId,
          active: checked ? '1' : '0',
        },
        (ret: any) => {
          if (ret.success) {
            message.success('操作成功');
            onSuccess();
          } else {
            message.error('操作失败');
          }
        }
      )

    } else {
      //发送请求更改数据库
      Ajax.Post('PayUrl', '/manage/merChannel.insert',
        {
          channelId,
          merchantId,
          instId,
          payTypeId,
          active: checked ? '1' : '0',
        },
        (ret: any) => {
          if (ret.success) {
            message.success('新增成功');
            allPayTypeArray.push(channelId + merchantId + instId + payTypeId);
            onSuccess();
          } else {
            message.error('新增失败');
          }
        }
      )
    }
  };

  //目录的列表配置
  const columns = [
    {
      title: '第三方名称',
      dataIndex: 'thirdName',
      key: 'thirdName',
      render: (value, row, index) => {
        const trueIndex =
          index + paginationInfo.pageSize * (paginationInfo.current - 1);
        const obj = {
          children: value,
          props: { rowSpan: 0 }
        };
        if (index >= 1 && value === dataSource[trueIndex - 1].thirdName) {
          obj.props.rowSpan = 0;
        } else {
          for (
            let i = 0;
            trueIndex + i !== dataSource.length &&
            value === dataSource[trueIndex + i].thirdName;
            i += 1
          ) {
            obj.props.rowSpan = i + 1;
          }
        }
        return obj;
      }
    },
    {
      title: '支付名称',
      dataIndex: 'payTypeName',
      key: 'payTypeName',
      render: (value, row, index) => {
        const trueIndex =
          index + paginationInfo.pageSize * (paginationInfo.current - 1);
        const obj = {
          children: value,
          props: { rowSpan: 0 }
        };
        if (index >= 1 && value === dataSource[trueIndex - 1].payTypeName) {
          obj.props.rowSpan = 0;
        } else {
          for (
            let i = 0;
            trueIndex + i !== dataSource.length &&
            value === dataSource[trueIndex + i].payTypeName;
            i += 1
          ) {
            obj.props.rowSpan = i + 1;
          }
        }
        return obj;
      }
    },
    {
      title: '商户名称',
      dataIndex: 'merchantName',
      key: 'merchantName',
    },
    {
      title: '开通状态',
      key: 'active',
      render: (_, row) => (
        <Switch defaultChecked={row.active}
          onChange={(checked) => {
            onChange(record.channelId, row.merchantId, row.instId, row.payTypeId, checked);
          }}
        />
      ),
    },
  ];

  const handleChange = pagination => {
    setPaginationInfo(pagination);
  };

  return (
    <Table
      size="small"
      rowKey={keyword => record.channelId + keyword.merchantId + keyword.instId + keyword.payTypeId}
      columns={columns}
      dataSource={dataSource}
      onChange={handleChange}
      bordered
    />
  )

}