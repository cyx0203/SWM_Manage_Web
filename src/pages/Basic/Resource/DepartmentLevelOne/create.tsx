import { useRef } from 'react';
import { Ajax } from '@/components/PageRoot';
import SmartForm from "@/components/SmartForm";
import { message, Modal } from "antd";

export default (props) => {

  const { visible, onClose, onOk, hospitalId } = props;

  const formRef = useRef(null);

  const refForm = (e) => {
    formRef.current = e;
  }

  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 7 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 15 },
    }
  };

  const getFields = () => {
    return [
    {
      type: 'input',
      label: '科室编号',
      field: 'id',
      required: true,
      message: '请输入科室编号',
      placeholder: '请输入科室编号...',
    }, {
      type: 'input',
      label: '科室名称',
      field: 'name',
      required: true,
      message: '请输入科室名称',
      placeholder: '请输入科室名称...',
    }, {
      type: 'textarea',
      label: '科室描述',
      field: 'desc',
      rows: '6',
    }]
  };

  const handleSubmit = (data) => {
    formRef.current.getForm().validateFields()
      .then(() => {
        Ajax.Post('BasicUrl', '/manage/comDept.insert',
          {
            hospitalId: hospitalId,
            level: "2",
            parId: "0",
            ...data
          },
          (ret: any) => {
            message.success('提交成功');
            formRef.current.getForm().resetFields();
            onOk();
          }
        )
      }
      )
      .catch((err) => {
        // message.error(err)
        // return;
      })
  };

  return (
    <Modal
      visible={visible}
      title='科室新增'
      onOk={() => handleSubmit(formRef.current.getForm().getFieldsValue())}
      onCancel={onClose}
      okText="提交"
      cancelText="取消"
      // confirmLoading={loading}
      destroyOnClose
    >
      <SmartForm
        formItemLayout={formItemLayout}
        ref={refForm}
        cols='1'
        formLayout='inline'
        fields={getFields()}
      >
        <div />
      </SmartForm>
    </Modal>
  )
}
