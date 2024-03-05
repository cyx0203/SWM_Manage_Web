import { Ajax } from '@/components/PageRoot';
import SmartForm from "@/components/SmartForm";
import { Fragment, useEffect, useRef } from "react";
import { Modal, message, Alert } from "antd";

export default (props) => {

  const { visible, tempId,
    tempDtlRecord, deptInfo, week, noon,
    doctorList, registerTypeList,
    onClose, onOk } = props;

  const weekList = ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日'];

  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 4 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 18 },
    }
  }

  const formRef = useRef(null);

  const refForm = (e) => {
    formRef.current = e;
  }

  useEffect(() => {
  }, []);

  const formFields = () => {
    return [{
      type: 'select',
      label: '号别',
      field: 'registerType',
      placeholder: '请选择号别...',
      options: registerTypeList,
      showSearch: true,
      required: true,
      message: '请选择号别',
      initialValue: tempDtlRecord ? tempDtlRecord.registerType : '',
    }, {
      type: 'select',
      label: '医生',
      field: 'doctorId',
      placeholder: '请选择医生...',
      options: doctorList,
      showSearch: true,
      initialValue: tempDtlRecord ? tempDtlRecord.doctorId : '',
    }]
  }

  const handleSubmit = () => {
    formRef.current.getForm().validateFields()
      .then(data => {
        let url;
        let param;
        if (tempDtlRecord) {  //edit
          url = '/manage/schTempDtl.update';
          param = {
            registerType: data.registerType,
            doctorId: data.doctorId ? data.doctorId: '', 
            id: tempDtlRecord.id,
          }
        }
        else { //add
          url = '/manage/schTempDtl.insert';
          param = {
            tempId,
            week,
            noon,
            deptId: deptInfo.deptId,
            registerType: data.registerType,
            doctorId: data.doctorId ? data.doctorId: '', 
            createUser: localStorage.getItem('account'),
          }
        }
        Ajax.Post('AptUrl', url, param
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

  const alertMessage = () => {
    return (
      <Fragment>
        当前编辑单元格：{deptInfo && deptInfo.deptName} / {weekList[week - 1]} {noon === '1' ? '上午' : '下午'}
      </Fragment>
    )
  }

  return (
    <Modal
      visible={visible}
      title='号别医生排班'
      onOk={() => handleSubmit()}
      onCancel={onClose}
      okText="提交"
      cancelText="取消"
      confirmLoading={window.GGMIDENDPRO.GLoadingState}
      destroyOnClose
    >
      <Alert message={alertMessage()} type="info" style={{ width: 408, marginBottom: 20, marginLeft: 25 }} />
      <SmartForm
        formItemLayout={formItemLayout}
        ref={refForm}
        cols={1}
        formLayout="horizontal"
        fields={formFields()}
      > <div />
      </SmartForm>
    </Modal>
  );
}