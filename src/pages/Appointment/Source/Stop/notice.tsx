import { Ajax } from '@/components/PageRoot';
import SmartForm from "@/components/SmartForm";
import { Fragment, useEffect, useRef } from "react";
import { Modal, message, Alert } from "antd";

export default (props) => {

  const { row, visible, onClose, onOk } = props;

  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 6 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 15 },
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
    label: '通知备注',
    field: 'remark',
    rows: 6,
    placeholder: '请输入通知备注...',
    initialValue: row ? row.remark : '',
  },
  ]

  const alertMessage = () => {

    return (
      <Fragment>
        当前编辑患者：{row && row.userName} - {row && row.userId}  - {row && row.userPhone} 
      </Fragment>
    )
  }
  
  const handleSubmit = () => {
    formRef.current.getForm().validateFields()
      .then(data => {
        Ajax.Post('AptUrl', '/manage/srcStopNotice.update',
          {
            ...data,
            id: row && row.id,
          }, (ret: any) => {
            message.success('通知更新成功');
            formRef.current.getForm().resetFields();
            onOk();
          }
        );
      }
      ).catch(error => {
        message.error(error);
      });
  }

  return (
    <Modal
      open={visible}
      title='记录患者回访'
      onOk={() => handleSubmit()}
      onCancel={onClose}
      maskClosable={false}
      okText="提交"
      cancelText="取消"
      destroyOnClose
      confirmLoading={window.GGMIDENDPRO.GLoadingState}
    >
      <Alert message={alertMessage()} type="info" style={{ width: 425, marginBottom: 20, marginLeft: 8 }} />
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