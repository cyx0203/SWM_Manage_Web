import { Modal } from 'antd';
import SmartForm from '@/components/SmartForm';
import { useRef } from 'react';
import { Ajax } from '@/core/trade';
import MD5 from 'blueimp-md5';

export default (props) => {
  const { visible, onClose, onOk } = props;

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
    type: 'password',
    label: '超级密码',
    field: 'oppwd',
    required: true,
    placeholder: '请输入超级密码...',
  },
  ];

  const handleSubmit = () => {
    formRef.current.getForm().validateFields()
      .then(data => {
        Ajax.Post('MealUrl', '/validationoppwd',
          {
            password: MD5(data.oppwd),
            account: localStorage.getItem('GGMIDENDPRO_LOGIN_NAME'),
          },
          (ret: any) => {
            formRef.current.getForm().resetFields();
            onOk();
          });
      }
      ).catch(error => {
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