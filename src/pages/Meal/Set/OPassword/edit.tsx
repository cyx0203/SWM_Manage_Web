import { useRef } from 'react';
import { Modal, message } from 'antd';
import SmartForm from '@/components/SmartForm';
import { Ajax } from '@/core/trade';
import MD5 from 'blueimp-md5';

export default (props) => {
  const { visible, record, onClose, onOk, userKV } = props;

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

  const formFields: any = [{
    type: 'select',
    label: '用户',
    field: 'account',
    options: userKV ? userKV.tv : [],
    initialValue: record ? record.account : '',
    disabled: record ? true : false
  },
  ];

  if (record) {
    formFields.push({
      type: 'password',
      label: '原退款密码',
      field: 'oldpassword',
      required: true,
      placeholder: '请输入原密码...',
      rules: [{
        validator: (_, value) =>
          MD5(value) === record.password ? Promise.resolve() : Promise.reject(new Error('原密码输入不正确')),
      }]
    }, {
      type: 'password',
      label: '新退款密码',
      field: 'newpassword',
      required: true,
      placeholder: '请输入新密码...',
    }, {
      type: 'password',
      label: '再次输入新退款密码',
      field: 'newpassword2',
      required: true,
      placeholder: '请再次输入新密码...',
      rules: [{
        validator: (_, value) =>
          value === formRef.current.getForm().getFieldValue('newpassword') ? Promise.resolve() : Promise.reject(new Error('2次输入的密码不一致')),
      }]
    });
  }

  const handleSubmit = () => {
    formRef.current.getForm().validateFields()
      .then(data => {
        let url;
        let param;
        if (record) {  //edit
          url = '/manage/mealcanteenemployee.update-userop';
          param = {
            id: record && record.id,
            password: MD5(data.newpassword)
          }
        }
        else { //add
          url = '/manage/mealcanteenemployee.save-userop';
          param = {
            ...data,
            id: data.account,
            password: MD5("Geit@8697")
          }
        }
        Ajax.Post('MealUrl', url, param
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
      title='退款密码'
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