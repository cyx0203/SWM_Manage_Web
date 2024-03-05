import { Ajax } from '@/components/PageRoot';
import SmartForm from "@/components/SmartForm";
import { useEffect, useRef } from "react";
import { Modal, message } from "antd";
import md5 from 'blueimp-md5';
import moment from 'moment';

export default (props) => {

  const { visible, orderPayInfo, onClose, onOk } = props;

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

  useEffect(() => {
  }, []);

  const formFields = [{
    type: 'textarea',
    label: '退款原因',
    field: 'reason',
    rows: 4,
    required: true,
    message: '选择退款原因',
    placeholder: '请选择退款原因...',
  }, {
    type: 'password',
    label: '超级密码',
    field: 'password',
    required: true,
    message: '请输入退款超级密码',
    placeholder: '请输入退款超级密码...',
  }
  ]

  const handleSubmit = () => {
    formRef.current.getForm().validateFields()
      .then(data => {
        //先根据merchantId查出insId
        Ajax.Post('PayUrl', '/manage/merMerchant.selectById',
          {
            merchantId: orderPayInfo.merchantId,  //实际需要的是insId
          }
          , (ret: any) => {
            //進行退款
            Ajax.Post('PayUrl', '/manage/payOrder.refund',
              {
                password: md5(data.password),
                account: localStorage.getItem("account"),

                merchantId: ret.list[0].instId, //實際需要的是instId
                manufacturerId: '1001',
                chanelType: orderPayInfo.channelId,
                operId: localStorage.getItem("account"),
                orderId: orderPayInfo.orderId,
                refundAmt: orderPayInfo.orderAmt.toString(),
                refundReason: data.reason,
                cashFlag: "0",
                onlineId: "",
                refundFlag: "0",
                termId: "",
                hospitalZoneCode : 'DZ',
                opType: '1',
                opTime: moment().format("YYYY-MM-DD HH:mm:ss")
              }
              , (ret: any) => {
                message.success('操作成功');
                formRef.current.getForm().resetFields();
                onOk();
              }
            );

          }
        );
      }
      ).catch(error => {
      });
  }

  return (
    <Modal
      visible={visible}
      title='设备编辑'
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