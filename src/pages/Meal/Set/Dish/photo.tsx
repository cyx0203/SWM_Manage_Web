import { useRef } from 'react';
import { Ajax } from '@/components/PageRoot';
import { message, Modal } from "antd";
import SmartForm from "@/components/SmartForm";


export default (props: any) => {
  const { visible, record, onClose, onOk } = props;
  const Domain: any = window.GGMIDENDPRO_EXT_CFG.Domain;
  const formRef = useRef(null);
  const refForm = (e: any) => {
    formRef.current = e;
  }
  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 5 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 17 },
    }
  }

  let fileName = '';
  let fileSize = '';
  let fileSeqNo = '';

  const getFile = (e: any) => {
    if (Array.isArray(e)) return e;

    if (e.fileList.length > 0 && e.fileList[0].status === 'done') {
      fileName = e.fileList[0].name;
      fileSize = e.fileList[0].size;
      fileSeqNo = e.fileList[0].response.name;
    }
    return e && e.fileList;
  };

  const getFields = () => {
    return [{
      type: 'upload',
      label: '菜品图例',
      field: 'upload',
      name: 'file',
      maxCount: 1,
      required: true,
      message: '请上传照片',
      buttonText: '点击上传照片',
      valuePropName: 'fileList',
      getValueFromEvent: getFile,
      action: `${Domain.MealUrl}/uploadDishPic`
    }]
  };

  const handleSubmit = () => {
    formRef.current.getForm().validateFields()
      .then(
        Ajax.Post('MealUrl', '/manage/mealdish.update-dish',
          {
            picFile: fileSeqNo,
            id: record.id,
          }
          , (ret: any) => {
            message.success('操作成功');
            formRef.current.getForm().resetFields();
            onOk();
          }
        )
      )
      .catch((err) => {
        message.error(err)
        return;
      })
  };

  return (
    <Modal
      visible={visible}
      title='菜品图例上传'
      onOk={handleSubmit}
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