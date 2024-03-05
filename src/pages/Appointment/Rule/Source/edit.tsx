import { Ajax } from '@/components/PageRoot';
import SmartForm from "@/components/SmartForm";
import { useEffect, useRef } from "react";
import { Modal, message } from "antd";

export default (props) => {

  const { visible, record, doctorList, registerTypeList, deptList, onClose, onOk } = props;

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

  const formatAjaxField = (field) => {
    if (field.indexOf("##") > -1) {
      return '##';
    }
    else {
      return field.toString();
    }
  }

  const formFields = () => {
    //初始化已选的select
    let selectedList = [];
    let idList = record ? record.deptIdList : '';
    if (idList && idList.indexOf(",") > -1) {
      if (idList.endsWith(",")) {
        idList = idList.substring(0, idList.length - 1);
      }
      const idChar = idList.split(",");
      for (const item of idChar) {
        selectedList.push(item);
      }
    }
    else {
      selectedList = idList;
    }
    //初始化已选的医生
    let selectedDoctorList = [];
    let docList = record ? record.doctorIdList : '';
    if (docList && docList.indexOf(",") > -1) {
      if (docList.endsWith(",")) {
        docList = docList.substring(0, docList.length - 1);
      }
      const doctorChar = docList.split(",");
      for (const item of doctorChar) {
        selectedDoctorList.push(item);
      }
    }
    else {
      selectedDoctorList = docList;
    }


    const newformFields = [
      {
        type: 'select',
        label: '科室列表',
        required: true,
        field: 'deptIdlist',
        placeholder: '请选择或输入科室列表...',
        mode: 'multiple',
        options: deptList,
        initialValue: selectedList
      },
      {
        type: 'select',
        label: '号别',
        field: 'registerType',
        required: true,
        showSearch: true,
        message: '请选择号别',
        placeholder: '请选择号别...',
        options: registerTypeList,
        initialValue: record ? record.registerType : '',
      },
      {
        type: 'select',
        label: '医生列表',
        required: true,
        field: 'doctorIdlist',
        placeholder: '请选择或输入医生列表...',
        mode: 'multiple',
        options: doctorList,
        initialValue: selectedDoctorList
      },
      {
        type: 'radio',
        label: '是否启用',
        field: 'active',
        required: true,
        message: '请选择是否启用规则',
        placeholder: '请选择是否启用规则...',
        options: [
          {
            text: '启用',
            value: '1',
          }, {
            text: '停用',
            value: '0',
          },
        ],
        initialValue: record ? record.active : '1',
      },];
    return newformFields;
  }

  const handleSubmit = () => {
    formRef.current.getForm().validateFields()
      .then(data => {
        let url;
        let param;
        if (record) {  //edit
          url = '/manage/ruleSource.updateById';
          param = {
            deptIdList: formatAjaxField(data.deptIdlist),
            doctorIdList: formatAjaxField(data.doctorIdlist),
            registerType: data.registerType,
            active: data.active,
            oid: record && record.id,
          }
        }
        else { //add
          url = '/manage/ruleSource.insert';
          param = {
            deptIdList: formatAjaxField(data.deptIdlist),
            doctorIdList: formatAjaxField(data.doctorIdlist),
            registerType: data.registerType,
            active: data.active,
            hospitalId: localStorage.getItem('hospitalId'),
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

  return (
    <Modal
      open={visible}
      title='号源规则设定'
      onOk={() => handleSubmit()}
      onCancel={() => { onClose() }}
      maskClosable={false}
      okText="提交"
      cancelText="取消"
      destroyOnClose
    >
      <SmartForm
        formItemLayout={formItemLayout}
        ref={refForm}
        cols={1}
        formLayout="vertical"
        fields={formFields()}
      > <div />
      </SmartForm>
    </Modal>
  );
}