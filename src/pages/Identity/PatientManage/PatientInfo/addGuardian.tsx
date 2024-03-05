import { Ajax } from '@/components/PageRoot';
import SmartForm from "@/components/SmartForm";
import { useEffect, useRef } from "react";
import { Modal, message } from "antd";
export default (props) => {

  const { visible, record, onClose, onOk } = props;

  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 24 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 24 },
    }
  }

  const formRef = useRef(null);

  const refForm = (e) => {
    formRef.current = e;
  }


  useEffect(() => {
  }, []);

  const formFields = [

    {
      type: 'select',
      label: '关系',
      field: 'link_relation',
      required: true,
      message: '关系',
      placeholder: '请选择联系人与患者关系...',
      options: JSON.parse(localStorage.getItem("codeKV")).GX
    },
    {
      type: 'input',
      label: '联系人姓名',
      field: 'link_name',
      required: true,
      message: '请输入患者姓名',
      placeholder: '请输入患者姓名...',
    },
    {
      type: 'input',
      label: '联系人电话',
      field: 'link_phone',
      required: true,
      message: '请输入联系人电话',
      placeholder: '请输入联系人电话...',
    },
    // {
    //   type: 'input',
    //   label: '身份证号',
    //   field: 'idno',
    //   required: true,
    //   message: '请输入患者身份证号',
    //   placeholder: '请输入患者身份证号...',
    // },
    {
      type: 'input',
      label: '联系人地址',
      field: 'link_addr',
      message: '请输入联系人地址',
      placeholder: '请输入联系人地址...',
    },
  ]

  const handleSubmit = () => {
    formRef.current.getForm().validateFields()
      .then(data => {
        let url;
        let param;
        url = '/manage/idnGuardian.insert';
        param = {
          ...data,
          id: record && record.id,
        }
        Ajax.Post('IdentityUrl', url, param
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
      open={visible}
      title='患者联系人新加'
      maskClosable={false}
      onOk={() => handleSubmit()}
      onCancel={onClose}
      okText="提交"
      cancelText="取消"
      destroyOnClose
      width={1000}
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