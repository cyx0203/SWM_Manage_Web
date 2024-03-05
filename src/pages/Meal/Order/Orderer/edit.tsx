import { useRef, useEffect } from 'react';
import { Modal, message } from 'antd';
import SmartForm from '@/components/SmartForm';
import { Ajax } from '@/components/PageRoot';

export default (props) => {
  const { visible, record, onClose, onOk, hospitalKV } = props;

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
    label: '食堂名称',
    field: 'name',
    required: true,
    message: '请输入食堂名称',
    placeholder: '请输入食堂名称...',
    initialValue: record ? record.name : '',
  }, {
    type: 'select',
    label: '所属院区',
    field: 'hospitalId',
    required: true,
    options: hospitalKV ? hospitalKV.tv : [],
    placeholder: '请选择食堂所属院区...',
    initialValue: record ? record.hospitalId : '',
  }, {
    type: 'textarea',
    label: '简介',
    field: 'profile',
    message: '请输入食堂简介（50字以内）',
    placeholder: '请输入食堂简介...',
    maxLength: 50,
    showCount: true,
    initialValue: record ? record.profile : '',
  }, {
    type: 'textarea',
    label: '详情',
    field: 'detail',
    message: '请输入食堂详情（200字以内）',
    placeholder: '请输入食堂详情...',
    maxLength: 200,
    showCount: true,
    initialValue: record ? record.detail : '',
  }, {
    type: 'input',
    label: '联系电话',
    field: 'telephone',
    message: '请输入食堂联系电话',
    placeholder: '请输入食堂联系电话...',
    initialValue: record ? record.telephone : '',
  },
  ]

  const handleSubmit = () => {
    formRef.current.getForm().validateFields()
      .then(data => {
        let url;
        let param;
        if (record) {  //edit
          url = '/manage/mealcanteen.update-canteen';
          param = {
            ...data,
            id: record && record.id,
          }
        }
        else { //add
          url = '/manage/mealcanteen.save-canteen';
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
      title='食堂编辑'
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