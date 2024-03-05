import { useEffect, useState } from 'react';
import { Ajax } from '@/components/PageRoot';
import { Row, Col, Descriptions, Steps } from "antd";

export default (props) => {

  const { record } = props;

  const [orderDetailList, setOrderDetailList] = useState(null);

  const queryOrderDetail = () => {
    Ajax.Post('AptUrl', '/manage/srcOrderDetail.selectByOrderId',
      {
        orderId: record.id,
      },
      (ret: any) => {
        setOrderDetailList(ret.list);
      }
    );
  }

  useEffect(() => {
    queryOrderDetail();
  }, []);

  const stepInfo = (action) => {
    for (const item of orderDetailList) {
      if (item.action === action) {
        return (
          <span>
            {item.createTimeFormat}<br />
            渠道：{item.custName}<br />
            操作员：{item.operId}
          </span>)
      }
    }
    return '';
  }

  const stepRender = () => {
    let stepItem = [{
      title: '已锁号',
      description: stepInfo('1'),
    }, {
      title: '已预约',
      description: stepInfo('2'),
    }, {
      title: '已就诊',
      description: stepInfo('9'),
    },
    ];
    let current = null;
    if (record.status === '2') {
      //已预约
      current = 1;
    }
    else if (record.status === '9') {
      //已就诊
      current = 2;
    }
    else if (record.status === '3') {
      //已退号
      stepItem = [{
        title: '已锁号',
        description: stepInfo('1'),
      }, {
        title: '已预约',
        description: stepInfo('2'),
      }, {
        title: '已退号',
        description: stepInfo('3'),
      },
      ]
      current = 2;
    }
    else {

    }
    return (
      <Row style={{ marginTop: 20 }}>
        <Col span={20}>
          <Steps current={current} items={stepItem} />
        </Col>
      </Row>)
  }

  return (
    <div style={{ backgroundColor: '#fff', padding: 15, borderRadius: 8 }}>
      <Descriptions size='small' column={3}>
        <Descriptions.Item label="排班编号">{record.srcSchId}</Descriptions.Item>
        <Descriptions.Item label="号源编号">{record.srcId}</Descriptions.Item>
        <Descriptions.Item label="操作员编号">{record.operId}</Descriptions.Item>
        <Descriptions.Item label="商户号">{record.merchantId}</Descriptions.Item>
        <Descriptions.Item label="支付账号">{record.payAccount}</Descriptions.Item>
        <Descriptions.Item label="支付订单号">{record.transOrderNo}</Descriptions.Item>
      </Descriptions>
      {orderDetailList && stepRender()}
    </div>
  )
}