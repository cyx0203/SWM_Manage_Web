import { Ajax } from '@/components/PageRoot';
import SmartForm from "@/components/SmartForm";
import { useEffect, useRef } from "react";
import { Modal, message } from "antd";

export default (props) => {

  const { visible, record, onClose, onOk } = props;

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
    label: '模板名称',
    field: 'name',
    required: true,
    message: '请输入模板名称',
    placeholder: '请输入模板名称...',
    initialValue: record ? record.name : '',
  }]

  const handleSubmit = () => {
    formRef.current.getForm().validateFields()
      .then(data => {
        let url;
        let param;
        if (record) {  //edit
          url = '/manage/devFty.update';
          param = {
            ...data,
            oid: record && record.id,
          }
        }
        else { //add
          url = '/manage/schTemp.insert';
          param = {
            ...data,
            hospitalId: localStorage.getItem('hospitalId'),
            active: '0',
            createUser: localStorage.getItem('account'), 
          }
        }
        Ajax.Post('AptUrl', url, param
          , (ret: any) => {
            message.success('操作成功');
            formRef.current.getForm().resetFields();
            onOk();
          }
        );
      }
      ).catch(error => {
      });
  }

  return (
    <Modal
      visible={visible}
      title='模板编辑'
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