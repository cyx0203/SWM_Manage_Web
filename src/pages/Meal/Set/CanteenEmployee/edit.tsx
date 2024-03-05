import { Ajax } from '@/components/PageRoot';
import SmartForm from "@/components/SmartForm";
import { useEffect, useRef } from "react";
import { Modal, message } from "antd";

export default (props) => {
  const { visible, record, onClose, onOk, canteenKV, userKV } = props;

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
    type: 'select',
    label: '用户',
    field: 'account',
    options: userKV ? userKV.tv : [],
    initialValue: record ? record.account : '',
    disabled: record ? true : false
  }, {
    type: 'select',
    label: '管理食堂',
    field: 'canteenId',
    options: canteenKV ? canteenKV.tv : [],
    placeholder: '请选择食堂...',
    initialValue: record ? record.canteenId : '',
  }
  ]

  const handleSubmit = () => {
    formRef.current.getForm().validateFields()
      .then(data => {
        let url;
        let param;
        if (record) {  //edit
          url = '/manage/mealcanteenemployee.update-canteenemployee';
          param = {
            ...data,
            id: record && record.id,
          }
        }
        else { //add
          url = '/manage/mealcanteenemployee.update-canteenemployee';
          param = {
            ...data,
            id: data.account,
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
      title='食堂管理人员编辑'
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