import { Ajax } from '@/components/PageRoot';
import SmartForm from "@/components/SmartForm";
import { useEffect, useRef } from "react";
import { Modal, message } from "antd";

export default (props) => {

  const { scheduleInfo, deptName, visible, onClose, onOk } = props;

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
    type: 'input',
    label: '通知门办时间',
    field: 'noticeTime',
    required: true,
    message: '请输入通知门办时间',
    placeholder: '请输入通知门办时间号...',
  }, {
    type: 'input',
    label: '通知门办方式',
    field: 'noticeType',
    required: true,
    message: '请输入通知门办方式',
    placeholder: '请输入通知门办方式...',
  }, {
    type: 'textarea',
    label: '停诊原因',
    field: 'reason',
    required: true,
    rows: 6,
    placeholder: '请输入停诊原因...',
  },
  ]

  const handleSubmit = () => {
    formRef.current.getForm().validateFields()
      .then(data => {
        Ajax.Post('AptUrl', '/manage/src.stop',
          {
            ...data,
            ...scheduleInfo,
            deptName: deptName,
            hospitalId: localStorage.getItem('hospitalId'),
            createUser: localStorage.getItem('account'),
          }, (ret: any) => {
            message.success('停诊成功');
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
      visible={visible}
      title='记录停诊事件'
      onOk={() => handleSubmit()}
      onCancel={onClose}
      okText="提交"
      cancelText="取消"
      destroyOnClose
      confirmLoading={window.GGMIDENDPRO.GLoadingState}
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