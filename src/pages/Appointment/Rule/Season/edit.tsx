import { Ajax } from '@/components/PageRoot';
import SmartForm from "@/components/SmartForm";
import { Fragment, useEffect, useRef } from "react";
import { Modal, message, Alert } from "antd";

export default (props) => {

  const { visible, record, onClose, onOk } = props;

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

  const optionsM = [
    { txt: '06:00', value: '0600', },
    { txt: '06:30', value: '0630', },
    { txt: '07:00', value: '0700', },
    { txt: '07:30', value: '0730', },
    { txt: '08:00', value: '0800', },
    { txt: '08:30', value: '0830', },
    { txt: '09:00', value: '0900', },
    { txt: '09:30', value: '0930', },
    { txt: '10:00', value: '1000', },
    { txt: '10:30', value: '1030', },
    { txt: '11:00', value: '1100', },
    { txt: '11:30', value: '1130', },
    { txt: '12:00', value: '1200', },
  ]

  const optionsA = [
    { txt: '12:00', value: '1200', },
    { txt: '12:30', value: '1230', },
    { txt: '13:00', value: '1300', },
    { txt: '13:30', value: '1330', },
    { txt: '14:00', value: '1400', },
    { txt: '14:30', value: '1430', },
    { txt: '15:00', value: '1500', },
    { txt: '15:30', value: '1530', },
    { txt: '16:00', value: '1600', },
    { txt: '16:30', value: '1630', },
    { txt: '17:00', value: '1700', },
    { txt: '17:30', value: '1730', },
    { txt: '18:00', value: '1800', },
    { txt: '18:30', value: '1830', },
    { txt: '19:00', value: '1900', },
  ]

  const formRef = useRef(null);

  const refForm = (e) => {
    formRef.current = e;
  }

  useEffect(() => {
  }, []);

  const formFields = [
    (record && record.pid != '0' && {
      type: 'input',
      label: '开始日期',
      field: 'startDate',
      required: true,
      disabled: record ? (record.startDate ? false : true) : false,
      message: '请输入4位开始日期(如0101)',
      placeholder: '请输入4位开始日期(如0101)...',
      initialValue: record ? (record.endDate ? record.startDate : '-') : '',
    }),
    (record && record.pid != '0' && {
      type: 'input',
      label: '结束日期',
      field: 'endDate',
      required: true,
      disabled: record ? (record.endDate ? false : true) : false,
      message: '请输入4位结束日期(如1231)',
      placeholder: '请输入4位结束日期(如1231)...',
      initialValue: record ? (record.endDate ? record.endDate : '-') : '',
    }),
    {
      type: 'select',
      label: '开始时间',
      field: 'startTime',
      required: true,
      message: '请选择开始时间',
      placeholder: '请选择开始时间...',
      options: record && record.sid == '1' ? optionsM : optionsA,
      initialValue: record ? record.startTime : '',
    },
    {
      type: 'select',
      label: '结束时间',
      field: 'endTime',
      required: true,
      message: '请选择结束时间',
      placeholder: '请选择结束时间...',
      options: record && record.sid == '1' ? optionsM : optionsA,
      initialValue: record ? record.endTime : '',
    },
  ]

  const handleSubmit = () => {
    formRef.current.getForm().validateFields()
      .then(data => {
        if (data.startDate && data.startDate.length != 4) {
          message.error('开始日期（4位），请检查');
          return;
        } else if (data.startDate) {
          if (data.startDate.substring(0, 2) > 12 || data.startDate.substring(0, 2) < 1) {
            message.error('开始日期月份非法，请检查');
            return;
          }
          if (data.startDate.substring(2) > 31 || data.startDate.substring(2) < 1) {
            message.error('开始日期日期非法，请检查');
            return;
          }
        }
        if (data.endDate && data.endDate.length != 4) {
          message.error('结束日期（4位），请检查');
          return;
        } else if (data.endDate) {
          if (data.endDate.substring(0, 2) > 12 || data.endDate.substring(0, 2) < 1) {
            message.error('结束日期月份非法，请检查');
            return;
          }
          if (data.endDate.substring(2) > 31 || data.endDate.substring(2) < 1) {
            message.error('结束日期日期非法，请检查');
            return;
          }
        }
        Ajax.Post('AptUrl', '/manage/ruleSeason.update',
          {
            ...data,
            hospitalId: record && record.hospitalId,
            pid: record && record.pid,
            sid: record && record.sid,
          }
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
      <Fragment >
        当前时令：{record && record.seasonName} - {record && record.noodName}
      </Fragment>
    )
  }

  return (
    <Modal
      open={visible}
      title='时令编辑'
      onOk={() => handleSubmit()}
      onCancel={onClose}
      maskClosable={false}
      okText="提交"
      cancelText="取消"
      destroyOnClose
    >
      <Alert message={alertMessage()} type="info" style={{ width: 425, marginBottom: 20, marginLeft: 8 }} />
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