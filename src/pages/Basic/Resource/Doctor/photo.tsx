import { useRef } from 'react';
import { Ajax } from '@/components/PageRoot';
import { message, Modal } from "antd";
import SmartForm from "@/components/SmartForm";


export default (props: any) => {

  const { visible, docInfo, onClose, onOk, hospitalId } = props;
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
    // console.log("进入到getFile方法")
    // console.log("我的event1=", e)
    // debugger;
    if (Array.isArray(e)) return e;
    // console.log("我的event2=", e)
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
      label: '医生头像',
      field: 'upload',
      name: 'file',
      required: true,
      message: '请上传照片',
      buttonText: '点击上传照片',
      valuePropName: 'fileList',
      getValueFromEvent: getFile,
      action: `${Domain.BasicUrl}/manage/uploadFile`
    }]
  };

  const handleSubmit = () => {
    formRef.current.getForm().validateFields()
      .then( () => {
        Ajax.Post('BasicUrl', '/manage/comDoctor.updatePhoto',
          {
            hospitalId: hospitalId,
            oid: docInfo.id,
            fileSeqNo: fileSeqNo,
          }
          , (ret: any) => {
            message.success('操作成功');
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
      title='医生照片上传'
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