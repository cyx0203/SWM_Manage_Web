import { DomRoot } from "@/components/PageRoot";
import { Tag, Table, Icon, Popover, Button, Modal } from "antd";
import { Fragment, useEffect, useState } from "react";
import Adjust from "./adjust";

export default (props) => {

  const { balanceList,getStatResult } = props;

  const [visable, setVisible] = useState(false);
  const [record, setRecord] = useState({});

  const showOrderStatus = (orderStatus) => {
    if (orderStatus === '0')
      return <span style={{ color: 'green' }}><Icon type="pay-circle" /> 未退款</span>
    if (orderStatus === '1')
      return <span style={{ color: 'orange' }}><Icon type="rollback" /> 已全额退款</span>
    if (orderStatus === '2')
      return <span style={{ color: 'red' }}><Icon type="rollback" /> 已部分退款</span>
    if (orderStatus === '3')
      return <span style={{ color: 'orange' }}><Icon type="rollback" /> 已冲正</span>
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
    title: '支付/退费订单号',
    dataIndex: 'orderIdOrRefundId',
    render: value => (value && value != '') ? value : '-'
  }, {
    title: '平台订单号',
    dataIndex: 'orderTrace',
    render: (value, row) => {
      return {
        children: (value && value != '') ? value : '-',
        props: {
          rowSpan: row.rowSpan
        },
      };
    },
  },
  {
    title: '订单状态',
    dataIndex: 'refundStatus',
    render: (text, record) => {
      return {
        children: (text && text != '') ? showOrderStatus(text) : '-',
        props: {
          rowSpan: record.rowSpan
        },
      };
    }
  }, {
    title: '收费/退费',
    dataIndex: 'payOrRefund',
    render: text => text === 1 ? <Tag color='green'>收款</Tag> : <Tag color='red'>退款</Tag>
  }, {
    title: '金额',
    dataIndex: 'transAmt', render: text => `${(text / 100).toFixed(2)}元`,
  }, {
    title: '调账原因',
    dataIndex: 'adjustReason',
    render: text => {
      return <Popover content={text} trigger="hover">
        <span>{text ? (text.length > 10 ? text.substr(0, 10) + '...' : text) : '-'}</span>
      </Popover>
    }
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
  }, {
    title: '操作',
    dataIndex: 'adjust',
    render: (text, record) => (
      <Fragment>
        <a
          style={{ marginLeft: 10 }}
          onClick={() => { setVisible(true); setRecord(record);}}
        >编辑
        </a>
      </Fragment>
    ),
  }];

  return (
    <DomRoot>
      <Table
        bordered
        size="small"
        dataSource={balanceList}
        columns={columns}
        pagination={false}
      />

      <Modal
        width='30%'
        visible={visable}
        title='编辑调账原因'
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