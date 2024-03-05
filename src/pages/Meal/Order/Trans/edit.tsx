import { Modal } from "antd";
import SmartTable from "@/components/SmartTable";
import moment from "moment";

export default (props) => {
  const { visible, record, onClose, orderDishes } = props;
  const columns: any = [
    {
      title: '菜名',
      dataIndex: 'name',
      key: 'name',
      width: 200,
    },
    {
      title: '数量',
      dataIndex: 'dishNum',
      key: 'dishNum',
      width: 150,
    },
    {
      title: '单价',
      dataIndex: 'price',
      align: 'price',
      width: 150,
      render: val => <span>{(val * 0.01).toFixed(2)}</span>
    },
  ];

  return (
    <Modal
      visible={visible}
      title="订餐详情"
      onOk={onClose}
      onCancel={onClose}
      cancelText="返回"
      destroyOnClose
      width={800}
    >
      <span>送餐详细地址：{record && record.shipAddressFull}<br />备注：{record && record.remark}</span><br />
      {record && record.refundOperName && <span style={{color:'red'}}>退款人员：{record.refundOperName} &nbsp;&nbsp;&nbsp;&nbsp;退款时间：{ moment(record.refundTime).format("YYYY-MM-DD HH:mm:ss")  }</span>}
      <SmartTable
        paginationBool={false}
        bordered
        dataSource={orderDishes || []}
        columns={columns}
      />
    </Modal>
  );
}