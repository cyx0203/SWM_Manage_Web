import { Ajax } from '@/components/PageRoot';
import SmartForm from "@/components/SmartForm";
import { useEffect, useRef } from "react";
import { Modal, message, Tag } from "antd";
import { PlusCircleOutlined, MinusCircleOutlined } from '@ant-design/icons';

export default (props) => {

  const { visible, record, channelKV, deptKV, registerTypeKV, onClose, onOk } = props;

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

  const formFields = () => {
    //初始化渠道已选的select
    let selectedChannelList = [];
    let channelIdList = record ? record.channelIdList : '';
    if (channelIdList && channelIdList.indexOf(",") > -1) {
      if (channelIdList.endsWith(",")) {
        channelIdList = channelIdList.substring(0, channelIdList.length - 1);
      }
      const custChar = channelIdList.split(",");
      for (const item of custChar) {
        selectedChannelList.push(item);
      }
    }
    else {
      selectedChannelList = channelIdList;
    }
    //初始化科室已选的select
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
    //初始化号别已选的select
    let selectedRegTypeList = [];
    let registerTypeList = record ? record.registerTypeList : '';
    if (registerTypeList && registerTypeList.indexOf(",") > -1) {
      if (registerTypeList.endsWith(",")) {
        registerTypeList = registerTypeList.substring(0, registerTypeList.length - 1);
      }
      const idChar = registerTypeList.split(",");
      for (const item of idChar) {
        selectedRegTypeList.push(item);
      }
    }
    else {
      selectedRegTypeList = registerTypeList;
    }
    const newformFields = [];
    newformFields.push({
      type: 'radio',
      label: '规则标识',
      field: 'allow',
      options: [{
        text: <Tag color='green'><PlusCircleOutlined /> 允许</Tag>,
        value: '1',
      }, {
        text: <Tag color='red'><MinusCircleOutlined /> 排斥</Tag>,
        value: '0',
      }],
      initialValue: record ? record.allow : '1',
    }, {
      type: 'select',
      label: '渠道',
      required: true,
      field: 'channelList',
      placeholder: '请选择渠道...',
      mode: 'multiple',
      options: channelKV,
      initialValue: selectedChannelList
    }, {
      type: 'select',
      label: '科室',
      required: true,
      field: 'deptList',
      showSearch: true,
      placeholder: '请选择科室...',
      mode: 'multiple',
      options: deptKV,
      initialValue: selectedList
    }, {
      type: 'select',
      label: '号别',
      field: 'registerTypeList',
      required: true,
      showSearch: true,
      placeholder: '请选择号别...',
      mode: 'multiple',
      options: registerTypeKV,
      initialValue: selectedRegTypeList,
    },
    );
    return newformFields;
  }

  const formatAjaxField = (field) => {
    if (field.indexOf("##") > -1) {
      return '##';
    }
    else {
      return field.toString();
    }
  }

  const handleSubmit = () => {
    formRef.current.getForm().validateFields()
      .then(data => {
        let url;
        let param;
        if (record) {  //edit
          url = '/manage/ruleChannelSchedule.update';
          param = {
            channelIdList: formatAjaxField(data.channelList),
            deptIdList: formatAjaxField(data.deptList),
            registerTypeList: formatAjaxField(data.registerTypeList),
            allow: data.allow,
            id: record && record.id,
          }
        }
        else { //add
          url = '/manage/ruleChannelSchedule.insert';
          param = {
            hospitalId: localStorage.getItem('hospitalId'),
            channelIdList: formatAjaxField(data.channelList),
            deptIdList: formatAjaxField(data.deptList),
            registerTypeList: formatAjaxField(data.registerTypeList),
            allow: data.allow,
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
      title='渠道挂号规则'
      onOk={() => handleSubmit()}
      onCancel={onClose}
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