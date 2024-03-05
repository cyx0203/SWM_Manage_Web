import { Tag, Table, Modal } from "antd";
import { RollbackOutlined } from '@ant-design/icons';
import { Fragment, useEffect, useState } from "react";
import { DomRoot } from "@/components/PageRoot";
import Adjust from './adjust';

export default (props) => {

  const { planList, getStatResult } = props;
  const [visable, setVisible] = useState(false);
  const [record, setRecord] = useState({});

  const showRefundStatus = (value) => {
    if (value === '0')
      return <span>未退款</span>
    if (value === '1')
      return <span style={{ color: 'orange' }}><RollbackOutlined /> 全额退款</span>
    if (value === '2')
      return <span style={{ color: 'orange' }}><RollbackOutlined /> 部分退款</span>
    if (value === '3')
      return <span style={{ color: 'orange' }}><RollbackOutlined /> 冲正退款</span>
    return ''
  }

  const columns: any = [{
    title: '序号',
    width: 50,
    align: 'center',
    render: (value, row, index) => index + 1
  }, {
    title: '对账单号',
    dataIndex: 'checkId',
  }, {
    title: '支付订单号',
    dataIndex: 'orderId',
    render: (value, row) => {
      return {
        children: (value && value != '') ? value : '-',
        props: {
          rowSpan: row.rowSpan
        },
      };
    },
  }, {
    title: '平台订单号',
    dataIndex: 'orderTrace',
    render: value => (value && value != '') ? value : '-'
  },{
    title: '退费状态',
    dataIndex: 'refundStatus',
    render: (value, row) => {
      return {
        children: (value && value != '') ? showRefundStatus(value) : '-',
        props: {
          rowSpan: row.rowSpan
        },
      };
    },
  }, {
    title: '退费订单号',
    dataIndex: 'refundId',
    render: value => (value && value != '') ? value : '-'
  }, {
    title: '收费/退费',
    dataIndex: 'payOrRefund',
    render: value => value === 1 ? <Tag color='green'>收款</Tag> : <Tag color='red'>退款</Tag>
  }, {
    title: '金额',
    dataIndex: 'transAmt',
    render: value => `${(value / 100).toFixed(2)}元`,
  }, {
    title: '交易时间',
    dataIndex: 'transTimeFormat',
  }, {
    title: '对账时间',
    dataIndex: 'createTime',
    render: value => {
      //时间为00:00时，只会返回5个，就会导致出现undefined
      if (value.length == 5) {
        value.push(0);
      }
      const data = value.map(item => {
        if (item < 10) {
          return '0' + item
        }
        return item
      })
      return data[0] + '-' + data[1] + '-' + data[2] + ' ' + data[3] + ':' + data[4] + ':' + data[5]
    }
  },
  {
    title: '错账原因',
    dataIndex: 'errorType',
    render: value => value == '0' ? '账平' : (value == '1' ? '多账' : '金额不一致')
  },
  {
    title: '操作',
    dataIndex: 'adjust',
    render: (text, record) => (
      <Fragment>
        <a
          style={{ marginLeft: 10 }}
          onClick={() => { setVisible(true); setRecord(record); }}
        >调账
        </a>
      </Fragment>
    ),
  }
  ];

  return (
    <DomRoot>
      <Table
        bordered
        size="small"
        dataSource={planList}
        columns={columns}
        pagination={false}
      />

      <Modal
        width='30%'
        visible={visable}
        title={<span style={{color:'red'}}>待调账(调账不退款)</span>}
        onCancel={() => setVisible(false)}
        destroyOnClose
        footer={null}
      >
        <Adjust
          record={record}
          onSuccess={() => {
            setVisible(false);
            getStatResult();
          }} />
      </Modal>
    </DomRoot>


  )

}