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

  useEffect(() => {
  }, []);

  const formFields = [{
    type: 'input',
    label: '设备厂商编号',
    field: 'id',
    required: true,
    message: '请输入设备厂商编号',
    placeholder: '请输入设备厂商编号...',
    initialValue: record ? record.id : '',
  }, {
    type: 'input',
    label: '设备厂商名称',
    field: 'name',
    required: true,
    message: '请输入设备厂商名称',
    placeholder: '请输入设备厂商名称...',
    initialValue: record ? record.name : '',
  }, {
    type: 'input',
    label: '联系电话',
    field: 'tel',
    required: true,
    message: '请输入联系电话',
    placeholder: '请输入联系电话...',
    initialValue: record ? record.tel : '',
  },
  ]

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
          url = '/manage/devFty.insert';
          param = {
            ...data,
          }
        }
        Ajax.Post('BasicUrl', url, param
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