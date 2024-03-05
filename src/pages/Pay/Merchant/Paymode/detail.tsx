import { Fragment, useEffect, useState } from "react";
import { Divider, Descriptions } from "antd";
import { AlipayCircleOutlined, CheckOutlined, CloseOutlined, EnvironmentFilled, HomeFilled, WechatOutlined } from "@ant-design/icons";
import { Ajax } from "@/core/trade";

export default (props) => {
  const {
    record,
    channelArray,
    hospitalArray
  } = props;

  const [payTypeList, setPayTypeList] = useState([]); //所有的支付方式
  const [activeWxList, setActiveWxList] = useState([]); //已激活的微信，用于动态判断是否显示微信参数
  const [activeAliList, setActiveAliList] = useState([]); //已激活的微信，用于动态判断是否显示支付宝参数

  const showKey = (key) => {
    if (key && key.length > 50) {
      return `${key.substring(0, 50)}...`;
    }
    return key;
  }

  //获取支付方式数组
  const queryPayType = () => {
    Ajax.Post('PayUrl', '/manage/payType.selectAll',
      {
      },
      (ret: any) => {
        setPayTypeList(ret.list);
      }
    );
  }

  useEffect(() => {
    console.log('11111', record);
    queryPayType();
    //过滤得到已经激活的支付方式
    const wxList = record.payTypeList.filter(item => item.active == '1' && item.thirdName == "微信")
    const aliList = record.payTypeList.filter(item => item.active == '1' && item.thirdName == "支付宝")
    setActiveWxList(wxList);
    setActiveAliList(aliList);
  }, [record]);

  //微信的组装数据
  const getHtmlForWx = () => {
    //没有已经激活的支付方式以及微信数据
    if (activeWxList.length == 0 && record.wechatList.length == 0) {
      return;
    } else {
      return (<div>
        <h4><WechatOutlined style={{ color: '#00ac84' }} /> 微信支付：
          <span style={{ marginLeft: 20 }}>
            {
              payTypeList.map((item) => {
                if (item.id.substring(0, 2) === '02') {
                  const temp = record.payTypeList.find(item2 => item2.payTypeId == item.id)
                  return temp && temp.active == '1' ?
                    <span style={{ marginRight: 30 }}><CheckOutlined style={{ color: 'green' }} /> {temp.payTypeName}</span>
                    : <span style={{ marginRight: 30 }}><CloseOutlined style={{ color: 'red' }} /> {item.name}</span>
                }
              })
            }
          </span>
        </h4>
        <div style={{ marginLeft: 15 }}>
          <Descriptions size='small'>
            <Descriptions.Item label="appId" span={3}>{record.wechatList.length > 0 ? record.wechatList[0].appId : ''}</Descriptions.Item>
            <Descriptions.Item label="appSecret" span={3}>{record.wechatList.length > 0 ? record.wechatList[0].appSecret : ''}</Descriptions.Item>
            <Descriptions.Item label="微信支付密钥" span={3}>{record.wechatList.length > 0 ? showKey(record.wechatList[0].payKey) : ''}</Descriptions.Item>
            <Descriptions.Item label="微信p12证书" span={3}>{record.wechatList.length > 0 ? showKey(record.wechatList[0].cert) : ''}</Descriptions.Item>
            <Descriptions.Item label="模式" span={3}>{record.wechatList.length > 0 ? (record.wechatList[0].type == '1' ? '普通模式' : '服务商模式') : ''}</Descriptions.Item>
          </Descriptions>
            {
              record.wechatList[0] && record.wechatList[0].wechatSub.map(item => {
                return (
                  <Descriptions size='small' key={item.subMerchantId+item.subAppId} column={6}>
                    <Descriptions.Item label="子商户号" span={3}>{item.subMerchantId}</Descriptions.Item>
                    <Descriptions.Item label="公众号appId" span={3}>{item.subAppId}</Descriptions.Item>
                  </Descriptions>
                )
              })
            }
          <Divider style={{ margin: '18px 0' }} />
        </div>
      </div>);
    }
  }

  //支付宝的组装数据
  const getHtmlForAli = () => {
    //没有支付方式以及支付宝参数就不显示
    if (activeAliList.length == 0 && record.alipayList.length == 0) {
      return;
    } else {
      return (<div>
        <h4><AlipayCircleOutlined style={{ color: '#0073fd' }} /> 支付宝：
          <span style={{ marginLeft: 20 }}>
            {
              payTypeList.map((item) => {
                if (item.id.substring(0, 2) === '01') {
                  const temp = record.payTypeList.find(item2 => item2.payTypeId == item.id)
                  return temp && temp.active == '1' ?
                    <span style={{ marginRight: 30 }}><CheckOutlined style={{ color: 'green' }} /> {temp.payTypeName}</span>
                    : <span style={{ marginRight: 30 }}><CloseOutlined style={{ color: 'red' }} /> {item.name}</span>
                }
              })
            }
          </span>
        </h4>
        <div style={{ marginLeft: 15 }}>
          <Descriptions size='small'>
            <Descriptions.Item label="appId" span={3}>{record.alipayList.length > 0 ? record.alipayList[0].appId : ''}</Descriptions.Item>
            <Descriptions.Item label="第三方商户号" span={3}>{record.alipayList.length > 0 ? record.alipayList[0].thirdMerchantId : ''}</Descriptions.Item>
            <Descriptions.Item label="支付宝应用公钥" span={3}>{record.alipayList.length > 0 ? showKey(record.alipayList[0].appPublicKey) : ''}</Descriptions.Item>
            <Descriptions.Item label="支付宝应用私钥" span={3}>{record.alipayList.length > 0 ? showKey(record.alipayList[0].appPrivateKey) : ''}</Descriptions.Item>
            <Descriptions.Item label="支付宝公钥" span={3}>{record.alipayList.length > 0 ? showKey(record.alipayList[0].publicKey) : ''}</Descriptions.Item>
            <Descriptions.Item label="签名算法" span={3}>{record.alipayList.length > 0 ? record.alipayList[0].signType : ''}</Descriptions.Item>
          </Descriptions>
        </div>
      </div>);
    }
  }

  return (
    <Fragment>
      <div style={{ backgroundColor: '#fff', padding: 15, borderRadius: 8 }}>
        <h4><EnvironmentFilled /> 支付渠道：
          <span style={{ marginLeft: 20 }}>
            {
              channelArray.map(item => {
                const temp = record.channelList.find(item2 => {
                  if (item2.channelId == item.id && item2.active == '1') {
                    return item2;
                  }
                })
                return temp ?
                  <span style={{ marginRight: 30 }}><CheckOutlined style={{ color: 'green' }} /> {temp.channelName}</span>
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
                const temp = record.hospitalList.find(item2 => item2.hospitalId == item.id)
                return temp ?
                  <span style={{ marginRight: 30 }}><CheckOutlined style={{ color: 'green' }} /> {temp.hospitalName}</span>
                  : <span style={{ marginRight: 30 }}><CloseOutlined style={{ color: 'red' }} /> {item.name}</span>
              })
            }
          </span>
        </h4>
        <Divider style={{ margin: '18px 0' }} />

        {getHtmlForWx()}
        {getHtmlForAli()}
      </div>
    </Fragment>
  )

}