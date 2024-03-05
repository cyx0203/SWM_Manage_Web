import { useRef } from "react";
import { Ajax } from "@/core/trade";
import SmartForm from "@/components/SmartForm";
import { message, Modal } from 'antd';

export default (props) => {
  const { visible, record, onClose, onOk } = props;
  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 7 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 14 },
    }
  }

  const formRef = useRef(null);
  const refForm = (e) => {
    formRef.current = e;
  }

  const formFields = [{
    type: 'input',
    label: '订单号',
    field: 'orderId',
    initialValue: record ? record.orderId : '',
    disabled: true,
  },
  {
    type: 'input',
    label: '订单人姓名',
    field: 'receiverName',
    initialValue: record ? record.receiverName : '',
    disabled: true,
  },
  {
    type: 'input',
    label: '金额',
    field: 'payAmt',
    initialValue: record ? (record.payAmt * 0.01).toFixed(2) : '',
    disabled: true,
  },
  {
    type: 'input',
    label: '退款原因',
    field: 'reason',
    initialValue: '系统自助冲正',
  },
  ];

  const handleSubmit = () => {
    formRef.current.getForm().validateFields()
      .then(data => {
        Ajax.Post('MealUrl', '/refund',
          {
            orderId: record.orderId,
            wxId: record.wxId,
            payAmt: record.payAmt,
            totalAmt: record.totalAmt,
            payOrderId: record.payOrderId,
            remark: data.reason,
            account: localStorage.getItem("account")
          },
          (ret: any) => {
            if (ret.success) {
              message.success("操作成功");
              formRef.current.getForm().resetFields();
              onOk();
            } else {
              message.error(ret.returnMsg);
              onOk();
            }
          },
          (err: any) => {
            message.error("操作失败");
            onClose();
          });
      }
      ).catch(error => {
        message.error("操作失败");
        onClose();
      });
  }

  return (
    <Modal
      visible={visible}
      title='输入超级密码'
      onOk={() => handleSubmit()}
      onCancel={onClose}
      okText="提交"
      cancelText="取消"
      destroyOnClose
    >
      <SmartForm
        formItemLayout={formItemLayout}
        ref={refForm}
        cols={1}
        formLayout="horizontal"
        fields={formFields}
      > <div />
      </SmartForm>
    </Modal>
  );
}