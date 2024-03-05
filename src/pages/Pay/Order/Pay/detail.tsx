import { useEffect, useState } from 'react';
import { Ajax } from '@/components/PageRoot';
import { List, Tag, Descriptions } from "antd";
import {
  AlipayCircleFilled, WechatFilled, LoadingOutlined, CheckOutlined, CloseOutlined,
  ClockCircleOutlined, SwapRightOutlined
} from '@ant-design/icons';


export default (props) => {

  const { record, openRefundModal } = props;

  const [payOrderPayList, setPayOrderPayList] = useState(null);

  const queryPayOrderPay = () => {
    Ajax.Post('PayUrl', '/manage/payOrderPay.selectByTraceJoinMedicalFee',
      {
        orderTrace: record.orderTrace,
      },
      (ret: any) => {
        setPayOrderPayList(ret.list)
      }
    );
  }

  useEffect(() => {
    queryPayOrderPay();
  }, []);

  const listTitle = (item) => {
    if (item.transType === 1) {
      if (record.payStatus === '2' && record.refundStatus === '0') {
        return (
          <span>
            <Tag color='green'>收费</Tag>订单号：{item.orderId}
            <a style={{ marginLeft: 20, color: 'red' }} onClick={() => { openRefundModal(record, item.orderId) }}><u>发起退费</u></a>
          </span>)
      }
      else {
        return <span><Tag color='green'>收费</Tag>订单号：{item.orderId}</span>
      }

    }
    else {
      return <span><Tag color='red'>退费</Tag>订单号：{item.orderId}</span>
    }
  }

  const formatPayType = (item) => {
    if (item.thirdId === '01') {
      return <span><AlipayCircleFilled style={{ color: '#0073fd', fontSize: 16 }} /> {item.payTypeName}</span>
    }
    if (item.thirdId === '02') {
      return <span><WechatFilled style={{ color: '#00ac84', fontSize: 16 }} /> {item.payTypeName}</span>
    }
    return item.payTypeName;
  }

  const formatStatus = (item) => {
    if (item.status === '0')
      return <span style={{ color: 'blue' }}><LoadingOutlined /> 待确认</span>
    if (item.status === '1')
      return <span style={{ color: 'green' }}><CheckOutlined /> 已完成</span>
    if (item.status === '9')
      return <span style={{ color: 'red' }}><CloseOutlined /> 已关闭</span>
    return ''
  }

  const listContent = (item) => {
    if (item.transType === 1) {
      //收费
      if (item.thirdId === '06') {
        //医保支付
        return (
          <Descriptions size='small' bordered>
            <Descriptions.Item label="创建时间">{item.createTimeFormat}</Descriptions.Item>
            <Descriptions.Item label="完成时间">{item.thirdTimeFormat ? item.thirdTimeFormat : '-'}</Descriptions.Item>
            <Descriptions.Item label="支付状态">{formatStatus(item)}</Descriptions.Item>
            <Descriptions.Item label="用户标识">{item.buyerId ? item.buyerId : '-'}</Descriptions.Item>
            <Descriptions.Item label="用户姓名">{item.buyerName ? item.buyerName : '-'}</Descriptions.Item>
            <Descriptions.Item label="用户手机号">{item.buyerPhone ? item.buyerPhone : '-'}</Descriptions.Item>
            <Descriptions.Item label="交易渠道">{item.channelName}</Descriptions.Item>
            <Descriptions.Item label="操作员号">{item.operId}</Descriptions.Item>
            <Descriptions.Item label="自助设备号">{item.termId}</Descriptions.Item>
            <Descriptions.Item label="医保个账支付金额">{(item.medAcctPay / 100).toFixed(2)} 元</Descriptions.Item>
            <Descriptions.Item label="医保统筹金额">{(item.medFundPay / 100).toFixed(2)} 元</Descriptions.Item>
            <Descriptions.Item label="所属商户">{item.merchantName}</Descriptions.Item>
            <Descriptions.Item label="三方流水号">{item.thirdSeqNo}</Descriptions.Item>
          </Descriptions>)
      }
      else {
        //自费
        return (
          <Descriptions size='small' bordered>
            <Descriptions.Item label="创建时间">{item.createTimeFormat}</Descriptions.Item>
            <Descriptions.Item label="完成时间">{item.thirdTimeFormat ? item.thirdTimeFormat : '-'}</Descriptions.Item>
            <Descriptions.Item label="支付状态">{formatStatus(item)}</Descriptions.Item>
            <Descriptions.Item label="用户标识">{item.buyerId ? item.buyerId : '-'}</Descriptions.Item>
            <Descriptions.Item label="用户姓名">{item.buyerName ? item.buyerName : '-'}</Descriptions.Item>
            <Descriptions.Item label="用户手机号">{item.buyerPhone ? item.buyerPhone : '-'}</Descriptions.Item>
            <Descriptions.Item label="交易渠道">{item.channelName}</Descriptions.Item>
            <Descriptions.Item label="操作员号">{item.operId}</Descriptions.Item>
            <Descriptions.Item label="自助设备号">{item.termId}</Descriptions.Item>
            <Descriptions.Item label="自费金额">{(item.orderAmt / 100).toFixed(2)} 元</Descriptions.Item>
            <Descriptions.Item label="所属商户">{item.merchantName}</Descriptions.Item>
            <Descriptions.Item label="三方流水号" span={2}>{item.thirdSeqNo}</Descriptions.Item>
          </Descriptions>)
      }
    }
    else {
      //退费
      return (
        <Descriptions size='small' bordered>
          <Descriptions.Item label="创建时间">{item.createTimeFormat}</Descriptions.Item>
          <Descriptions.Item label="完成时间">{item.thirdTimeFormat ? item.thirdTimeFormat : '-'}</Descriptions.Item>
          <Descriptions.Item label="退费状态">{formatStatus(item)}</Descriptions.Item>
          <Descriptions.Item label="用户标识">{item.buyerId ? item.buyerId : '-'}</Descriptions.Item>
          <Descriptions.Item label="用户姓名">{item.buyerName ? item.buyerName : '-'}</Descriptions.Item>
          <Descriptions.Item label="用户手机号">{item.buyerPhone ? item.buyerPhone : '-'}</Descriptions.Item>
          <Descriptions.Item label="退费渠道">{item.channelName}</Descriptions.Item>
          <Descriptions.Item label="退费操作员号">{item.operId}</Descriptions.Item>
          <Descriptions.Item label="自助设备号">{item.termId}</Descriptions.Item>
          <Descriptions.Item label="退费金额">{((item.orderAmt + item.acctPay + item.fundPaySumamt) / 100).toFixed(2)} 元</Descriptions.Item>
          <Descriptions.Item label="所属商户">{item.merchantName}</Descriptions.Item>
          <Descriptions.Item label="退费三方流水号" span={2}>{item.thirdSeqNo}</Descriptions.Item>
        </Descriptions>)
    }
  }

  return (
    <div style={{ backgroundColor: '#fff', padding: 15, borderRadius: 8 }}>
      {payOrderPayList &&
        <List
          itemLayout="vertical"
          dataSource={payOrderPayList}
          renderItem={(item: any) => (
            <List.Item>
              <List.Item.Meta
                title={listTitle(item)}
                description={<span style={{ color: 'fff', marginLeft: 5 }}>支付方式：{formatPayType(item)}</span>}
              />
              {listContent(item)}
            </List.Item>
          )}
        />}
    </div>
  )
}