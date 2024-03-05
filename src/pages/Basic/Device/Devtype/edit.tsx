import { Ajax } from '@/components/PageRoot';
import SmartForm from "@/components/SmartForm";
import { useEffect, useRef } from "react";
import { Modal, message } from "antd";

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

  const handleSubmit = (data) => {
    let url;
    let param;
    if (record) {  //edit
      url = '/manage/devType.update';
      param = {
        ...data,
        oid: record && record.id,
      }
    }
    else { //add
      url = '/manage/devType.insert';
      const parts = '100000000000000000000000000000'.split('');
      param = {
        ...data,
        "parts": parts.join('')
      }
    }
    formRef.current.getForm().validateFields()
      .then(ret => {
        console.log("ret:" + JSON.stringify(ret));
        Ajax.Post('BasicUrl', url, param
          , (res: any) => {
            message.success('操作成功');
            formRef.current.getForm().resetFields();
            onOk();
          }
        );
      }
      ).catch(error => {
      });
  }

  useEffect(() => {

  }, []);

  const formFields = [{
    type: 'input',
    label: '设备类型编号',
    field: 'id',
    disabled: record && true,
    rules: [{ required: true, message: '请输入设备类型编号', }],
    placeholder: '请输入设备类型编号...',
    initialValue: record ? record.id : '',
  }, {
    type: 'input',
    label: '设备类型名称',
    field: 'name',
    rules: [{ required: true, message: '请输入设备类型名称', }],
    message: '请输入设备类型名称',
    placeholder: '请输入设备类型名称...',
    initialValue: record ? record.name : '',
  },
  ]

  return (
    <Modal
      visible={visible}
      title='设备编辑'
      onOk={() => handleSubmit(formRef.current.getForm().getFieldsValue())}
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