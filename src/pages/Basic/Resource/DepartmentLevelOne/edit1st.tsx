import { useRef } from 'react';
import SmartForm from "@/components/SmartForm";
import { message, Modal } from "antd";
import { Ajax } from '@/components/PageRoot';

export default (props) => {

  const { deptInfo, visible, onOk, onClose, hospitalId } = props;

  const formRef = useRef(null);

  const refForm = (e) => {
    formRef.current = e;
  }

  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 6 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 16 },
    }
  };

  const getFields = () => {
    return [{
      type: 'input',
      label: '一级科室名称',
      field: 'name',
      required: true,
      message: '请输入科室名称',
      placeholder: '请输入科室名称...',
      initialValue: deptInfo ? deptInfo.deptName1st : ''
    }, {
      type: 'number',
      label: '排序',
      field: 'order',
      required: true,
      message: '请输入排序',
      placeholder: '请输入排序...',
      initialValue: deptInfo ? deptInfo.deptOrder1st : ''
    }]
  };

  const handleSubmit = (data) => {
    formRef.current.getForm().validateFields()
      .then(() => {
        Ajax.Post('BasicUrl', '/manage/comDept.update',
          {
            hospitalId: hospitalId,
            oid: deptInfo.deptCode1st,
            ...data
          },
          (ret: any) => {
            message.success('操作成功');
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
      title='一级科室编辑'
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
