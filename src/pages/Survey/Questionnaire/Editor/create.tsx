import { useRef } from 'react';
import { Ajax } from '@/components/PageRoot';
import SmartForm from "@/components/SmartForm";
import { message, Modal } from "antd";

export default (props) => {

  const { visible, onClose, onOk } = props;

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
        label: '问卷名称',
        field: 'title',
        required: true,
        message: '请输入问卷名称',
        placeholder: '请输入问卷名称...',
      },
      {
        type: 'input',
        label: '问卷编号',
        field: 'questionId',
        required: true,
        message: '请输入问卷编号',
        placeholder: '请输入问卷编号...',
      }
    ]
  };

  const handleSubmit = (data) => {
    formRef.current.getForm().validateFields()
      .then( () => {
        Ajax.Post('SurveyUrl', '/manage/questionSurveyMain.insert',
          {
            hospitalId: localStorage.getItem('hospitalId'),
            createUser: localStorage.getItem('GGMIDENDPRO_LOGIN_NAME'),
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
      title='问卷新增'
      onOk={() => handleSubmit(formRef.current.getForm().getFieldsValue())}
      onCancel={onClose}
      okText="提交"
      cancelText="取消"
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
