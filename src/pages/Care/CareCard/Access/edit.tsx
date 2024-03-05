import { useEffect, useRef } from 'react';
import { Ajax } from '@/components/PageRoot';
import { message, Modal } from "antd";
import SmartForm from "@/components/SmartForm";
import moment from "moment";
// import utils from '../../utils';
import _ from 'lodash';

export default (props: any) => {
  const { visible, record, onClose, onOk ,actualInTimes} = props;

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
  };

  useEffect(() => {
  }, []);

  const getFields = () => {
    const formFields = [{
      type: 'input',
      label: '陪护证编号',
      field: 'cardId',
      initialValue: record ? record.cardId : '',
      disabled: record ? true : false
    }, {
      type: 'input',
      label: '外出时间',
      field: 'outTime',
      initialValue: record ? record.outTime : '',
      disabled: record ? true : false
    }, 
    {
      type: 'input',
      label: '计划归来时间',
      field: 'planInTime',
      initialValue: record ? record.planInTime : '',
      disabled: record ? true : false
    }, 
    // {
    //   type: 'select',
    //   label: '有效状态',
    //   field: 'accessStatus',
    //   required: true,
    //   options: utils.getAccessStatus() ? utils.getAccessStatus() : [],
    //   placeholder: '请选择是否继续有效...',
    //   initialValue: record ? record.accessStatus : '',
    // },
    {
      type: 'date-picker',
      style: { width: '250px' },
      field: 'actualInTimes',
      label: '实际回归时间',
      initialValue: moment(),
      required: true,
      showTime: true,
    }, 
    {
      type: 'input',
      label: '外出理由',
      field: 'reason',
      message: '请输入外出理由',
      placeholder: '请输入外出理由...',
      initialValue: record ? record.reason : '',
    }
    ]
    return formFields;
  };

  const handleSubmit = (data: any) => {

    const actualInTime = moment(data.actualInTimes).format('YYYY-MM-DD HH:mm:ss');

    formRef.current.getForm().validateFields()
      .then(
        Ajax.Post('CareUrl', '/manage/accessRecord.updAccessRecord',
        {
          id: record?.id,
          accessStatus: 0,
          actualInTime:actualInTime,
          ...data,
        }  
        , (ret: any) => {
            message.success('操作成功');
            formRef.current.getForm().resetFields();
            onOk();
          }
        )
      )
      .catch((err: any) => {
        message.error(err)
        return;
      })
  };

  return (
    <Modal
      visible={visible}
      title='陪护出入记录编辑'
      onOk={() => handleSubmit(formRef.current.getForm().getFieldsValue())}
      onCancel={onClose}
      okText="更新"
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
  );
}
