import { useEffect, useRef } from 'react';
import { Ajax } from '@/components/PageRoot';
import { message, Modal } from "antd";
import SmartForm from "@/components/SmartForm";
import moment from "moment";
import _ from 'lodash';

export default (props: any) => {
  const { visible, record, onClose, onOk , outTimes , planInTimes} = props;

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
      style: { width: '250px' },
      label: '陪护证编号',
      field: 'cardId',
      initialValue: record ? record.cardId : '',
      disabled: record ? true : false
    }, 
    {
      type: 'range-picker',
      style: { width: '100%' },
      label: '外出时间段',
      field: 'outTimes',
      format: "YYYY-MM-DD  HH:mm:ss",
      required: true,
      showTime: true,
      ranges: {
        '今天': [moment(), moment().endOf('day')],
        '本周': [moment().startOf('week'), moment().endOf('week')],
        '本月': [moment().startOf('month'), moment().endOf('month')],
      },
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

    const outTime = moment(data.outTimes[0]).format('YYYY-MM-DD HH:mm:ss');
    const planInTime = moment(data.outTimes[1]).format('YYYY-MM-DD HH:mm:ss');
    
    console.log(data);
    //console.log(planInTime);

    const handleUpdate = () => {
      Ajax.Post('CareUrl', '/manage/accessRecord.updAccessRecordByCardId',
      {
        cardId: record?.cardId,
      }, 
      (ret: any) => {
        console.log('update success')
      })
    }

    formRef.current.getForm().validateFields()
      .then(
        () => {
        handleUpdate(); // 执行 update 语句
        Ajax.Post('CareUrl', '/manage/accessRecord.intAccessRecord',
        {
          cardId: record?.cardId,
          outTime:outTime,
          planInTime:planInTime,
          ...data,
        }, 
        (ret: any) => {
            message.success('操作成功');
            formRef.current.getForm().resetFields();
            onOk();
          }
        )
        })
      .catch((err: any) => {
        message.error(err)
        return;
      })
  };

  return (
    <Modal
      visible={visible}
      title='出入记录新增'
      onOk={() => handleSubmit(formRef.current.getForm().getFieldsValue())}
      onCancel={onClose}
      okText="新增"
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