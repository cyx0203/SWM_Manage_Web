import { useRef } from 'react';
import SmartForm from '@/components/SmartForm';
import { Modal, message } from 'antd';
import { Ajax } from '@/core/trade';

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

  const formFields = [{
    type: 'input',
    label: '类别名称',
    field: 'name',
    required: true,
    message: '请输入菜品类别名称',
    placeholder: '请输入菜品类别名称...',
    initialValue: record ? record.name : '',
  },
  {
    type: 'input',
    label: '简介',
    field: 'profile',
    required: true,
    message: '请输入菜品简介',
    placeholder: '请输入菜品简介...',
    initialValue: record ? record.profile : '',
  },
  ]

  const handleSubmit = () => {
    formRef.current.getForm().validateFields()
      .then(data => {
        let url;
        let param;
        if (record) {  //edit
          url = '/manage/mealdishtype.update-dishtype';
          param = {
            ...data,
            id: record && record.id,
          }
        }
        else { //add
          url = '/manage/mealdishtype.save-dishtype';
          param = {
            ...data,
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
      title='菜品类别编辑'
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