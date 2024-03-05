import { useRef } from 'react';
import SmartForm from "@/components/SmartForm";
import { message, Modal } from "antd";
import { Ajax } from '@/components/PageRoot';

export default (props) => {

  const { deptInfo, editMode, visible, onClose, onOk,hospitalId } = props;

  const formRef = useRef(null);

  const refForm = (e) => {
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
  };

  const getFields = () => {
    return [{
      type: 'input',
      label: '科室编号',
      field: 'id',
      required: true,
      message: '请输入科室编号',
      placeholder: '请输入科室编号...',
      initialValue: editMode ? deptInfo.deptCode2nd : ''
    }, {
      type: 'input',
      label: '科室名称',
      field: 'name',
      required: true,
      message: '请输入科室名称',
      placeholder: '请输入科室名称...',
      initialValue: editMode ? deptInfo.deptName2nd : ''
    }, {
      type: 'input',
      label: '科室位置',
      field: 'position',
      message: '请输入科室位置',
      placeholder: '请输入科室位置...',
      initialValue: editMode ? deptInfo.deptPosition2nd : ''
    }, {
      type: 'textarea',
      label: '科室描述',
      field: 'desc',
      rows: '6',
      initialValue: editMode ? deptInfo.deptDesc2nd : ''
    }, {
      type: 'number',
      label: '排序',
      field: 'order',
      // required: true,
      message: '请输入排序',
      placeholder: '请输入排序...',
      initialValue: editMode ? deptInfo.deptOrder2nd : ''
    },]
  };


  const handleSubmit = (data) => {

    let url: string;
    let param: any;
    if (editMode) {
      url = '/manage/comDept.update'
      param = {
        hospitalId: hospitalId,
        oid: deptInfo.deptCode2nd,
        ...data,
      }
    }
    else {
      url = '/manage/comDept.insert'
      param = {
        hospitalId: hospitalId,
        parId: deptInfo.deptCode1st,
        ...data,
        level: 2,
      }
    }
    formRef.current.getForm().validateFields()
      .then(() => {
        Ajax.Post('BasicUrl', url, param
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
      title='二级科室编辑'
      onOk={() => handleSubmit(formRef.current.getForm().getFieldsValue())}
      onCancel={onClose}
      okText="提交"
      cancelText="取消"
      // confirmLoading={loading}
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
