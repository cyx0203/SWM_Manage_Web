import { Ajax } from '@/components/PageRoot';
import SmartForm from "@/components/SmartForm";
import { useEffect, useRef } from "react";
import { Modal, message } from "antd";

export default (props) => {

  const { visible, record, custList, registerTypeList, deptList, onClose, onOk } = props;

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
    const newformFields = [];

    newformFields.push(
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
        label: '渠道列表',
        required: true,
        field: 'channelList',
        placeholder: '请选择或输入渠道列表...',
        mode: 'multiple',
        options: custList,
        initialValue: selectedChannelList
      },
      {
        type: 'select',
        label: '科室列表',
        required: true,
        field: 'deptList',
        placeholder: '请选择或输入科室列表...',
        mode: 'multiple',
        options: deptList,
        initialValue: selectedList
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
      },
    );
    return newformFields;
  }

  const handleSubmit = () => {
    formRef.current.getForm().validateFields()
      .then(data => {
        let url;
        let param;
        if (record) {  //edit
          url = '/manage/ruleRegType.update';
          param = {
            ...data,
            oid: record && record.id,
          }
        }
        else { //add
          url = '/manage/ruleRegType.insertRule';
          param = {
            ...data,
            hospitalId: localStorage.getItem('hospitalId'),
            account: localStorage.getItem('account'),
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
      title='号类规则设定'
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