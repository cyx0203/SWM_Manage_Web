import { Fragment, useEffect, useState } from "react";
import { Divider } from "antd";
import { AlipayCircleOutlined, CheckOutlined, CloseOutlined, EnvironmentFilled, HomeFilled, WechatOutlined } from "@ant-design/icons";
import { Ajax } from "@/core/trade";

export default (props) => {
  const {
    record,
    hospitalArray
  } = props;

  const [payTypeList, setPayTypeList] = useState([]);
  const [merchantList, setMerchantList] = useState([]);
  const [allPayTypeList, setAllPayTypeList] = useState([]); //所有的支付方式 
  const [allMerchantList, setAllMerchantList] = useState([]); //所有的商户


  const queryChannel = () => {
    Ajax.Post('PayUrl', '/manage/merChannel.selectJoin',
      {
        id: record.channelId
      },
      (ret: any) => {
        const payTypeTemp = [];
        const merchantTemp = [];
        ret.list.forEach(item => {
          payTypeTemp.push({
            payTypeId: item.payTypeId,
            payTypeName: item.payTypeName,
            thirdName: item.thirdName,
            active: item.active
          });
          merchantTemp.push({
            merchantId: item.merchantId,
            merchantName: item.merchantName,
            active: item.active
          });

        })
        setPayTypeList(payTypeTemp);
        setMerchantList(merchantTemp);

      })
  }

  //获取支付方式数组
  const queryPayType = () => {
    Ajax.Post('PayUrl', '/manage/payType.selectAll',
      {
      },
      (ret: any) => {
        setAllPayTypeList(ret.list);
      }
    );
  }

  //获取商户数组
  const queryMerchant = () => {
    Ajax.Post('PayUrl', '/manage/merMerchant.selectAll',
      {
      },
      (ret: any) => {
        setAllMerchantList(ret.list);
      }
    );
  }

  useEffect(() => {
    queryChannel();
    queryPayType();
    queryMerchant();
  }, []);

  useEffect(() => {
    queryChannel();
  }, [record]);

  return (
    <Fragment>
      <div style={{ backgroundColor: '#fff', padding: 15, borderRadius: 8 }}>
        <h4><EnvironmentFilled /> 支持商户：
          <span style={{ marginLeft: 20 }}>
            {
              allMerchantList.map(item => {
                const temp = merchantList.find(item2 => item2.merchantId == item.id)
                return temp && temp.active == '1' ?
                  <span style={{ marginRight: 30 }}><CheckOutlined style={{ color: 'green' }} /> {temp.merchantName}</span>
                  : <span style={{ marginRight: 30 }}><CloseOutlined style={{ color: 'red' }} /> {item.name}</span>
              })
            }
          </span>
        </h4>
        <Divider style={{ margin: '18px 0' }} />
        <h4><HomeFilled /> 支持院区：
          <span style={{ marginLeft: 20 }}>
            {
              hospitalArray.map(item => {
                const temp = record.hospitalList.find(item2 => item2.id == item.id)
                return temp && temp.active == '1' ?
                  <span style={{ marginRight: 30 }}><CheckOutlined style={{ color: 'green' }} /> {temp.name}</span>
                  : <span style={{ marginRight: 30 }}><CloseOutlined style={{ color: 'red' }} /> {item.name}</span>
              })
            }
          </span>
        </h4>
        <Divider style={{ margin: '18px 0' }} />

        <h4><WechatOutlined style={{ color: '#00ac84' }} /> 微信支付：
          <span style={{ marginLeft: 20 }}>
            {
              allPayTypeList.map((item) => {
                if (item.id.substring(0, 2) === '02') {
                  //如果id存在并且active激活了才显示
                  const temp = payTypeList.find(item2 => {
                    if (item2.payTypeId == item.id && item2.active == '1') {
                      return item2;
                    }
                  })
                  return temp ?
                    <span style={{ marginRight: 30 }}><CheckOutlined style={{ color: 'green' }} /> {temp.payTypeName}</span>
                    : <span style={{ marginRight: 30 }}><CloseOutlined style={{ color: 'red' }} /> {item.name}</span>
                }
              })
            }
          </span>
        </h4>
        <Divider style={{ margin: '18px 0' }} />

        <h4><AlipayCircleOutlined style={{ color: '#0073fd' }} /> 支付宝：
          <span style={{ marginLeft: 20 }}>
            {
              allPayTypeList.map((item) => {
                if (item.id.substring(0, 2) === '01') {
                  const temp = payTypeList.find(item2 => {
                    if (item2.payTypeId == item.id && item2.active == '1') {
                      return item2;
                    }
                  })
                  return temp ?
                    <span style={{ marginRight: 30 }}><CheckOutlined style={{ color: 'green' }} /> {temp.payTypeName}</span>
                    : <span style={{ marginRight: 30 }}><CloseOutlined style={{ color: 'red' }} /> {item.name}</span>
                }
              })
            }
          </span>
        </h4>

      </div>
    </Fragment>
  )

}