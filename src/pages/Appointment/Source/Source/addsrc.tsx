import { Ajax } from '@/components/PageRoot';
import SmartForm from "@/components/SmartForm";
import { Fragment, useEffect, useRef, useState } from "react";
import { Modal, message, Button, Popconfirm } from "antd";

export default (props) => {

  const { scheduleInfo, visible, onClose, onOk } = props;

  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 6 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 15 },
    }
  }

  //定义早上时间段
  const optionsA = [
    { txt: '00:00', value: '0000', },
    { txt: '00:30', value: '0030', },
    { txt: '01:00', value: '0100', },
    { txt: '01:30', value: '0130', },
    { txt: '02:00', value: '0200', },
    { txt: '02:30', value: '0230', },
    { txt: '03:00', value: '0300', },
    { txt: '03:30', value: '0330', },
    { txt: '04:00', value: '0400', },
    { txt: '04:30', value: '0430', },
    { txt: '05:00', value: '0500', },
    { txt: '05:30', value: '0530', },
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

  //定义下午时间段
  const optionsP = [
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
    { txt: '19:30', value: '1930', },
    { txt: '20:00', value: '2000', },
    { txt: '20:30', value: '2030', },
    { txt: '21:00', value: '2100', },
    { txt: '21:30', value: '2130', },
    { txt: '22:00', value: '2200', },
    { txt: '22:30', value: '2230', },
    { txt: '23:00', value: '2300', },
    { txt: '23:30', value: '2330', },
    { txt: '23:59', value: '2359', },
  ]

  const formRef = useRef(null);
  const [stimeType, setStime] = useState(null); //开始时间
  const [etimeType, setEtime] = useState(null); //结束时间
  const [sourceNum, setSourceNum] = useState(null); //号源数量

  const refForm = (e) => {
    formRef.current = e;
  }

  //开始变化触发
  const onChangeSTime = (value) => {
    setStime(value && value.substring(0, 2) + ':' + value.substring(2));
  }

  //结束时间变化触发
  const onChangeETime = (value) => {
    setEtime(value && value.substring(0, 2) + ':' + value.substring(2));
  }
  
  //数量变化触发
  const onChangeSourceNum = (value) => {
    setSourceNum(value);
  }

  useEffect(() => {
  }, []);

  const formFields = [
    {
      type: 'select',
      label: '开始时段',
      field: 'stime',
      placeholder: '请选择开始时段...',
      options: scheduleInfo && scheduleInfo.noon === '1' ? optionsA : optionsP,
      required: true,
      message: '请选择开始时段',
      onChange: onChangeSTime,
    },
    {
      type: 'select',
      label: '结束时段',
      field: 'etime',
      placeholder: '请选择结束时段...',
      options: scheduleInfo && scheduleInfo.noon === '1' ? optionsA : optionsP,
      required: true,
      message: '请选择结束时段',
      onChange: onChangeETime,
    },
    {
      type: 'number',
      label: '加号数量',
      field: 'addNum',
      min: 0,
      max: 50,
      required: true,
      message: '请输入加号数量',
      placeholder: '请输入加号数量...',
      onChange: onChangeSourceNum,
    }
  ]

  const handleSubmit = () => {
    formRef.current.getForm().validateFields()
      .then(data => {
        if (data) { //判断时间先后
          if (data.stime >= data.etime) {
            message.error("请确认开始-结束时间先后！");
            return;
          }
        }
        Ajax.Post('AptUrl', '/manage/src.addSource',
          {
            ...data,
            noon: scheduleInfo.noon,
            scheduleId: scheduleInfo.scheduleId,
            hospitalId: localStorage.getItem('hospitalId'),
            createUser: localStorage.getItem('account'),
          }, (ret: any) => {
            message.success('加号成功');
            formRef.current.getForm().resetFields();
            onOk();
          }
        );
      }
      ).catch(error => {
        message.error(error);
      });
  }

  //加号确认信息
  const addMessage = () => {
    return (
      <Fragment>
        请核对加号信息：<br />
        开始时间：{stimeType} <br />
        结束时间：{etimeType} <br />
        加号数量：{sourceNum}个
      </Fragment>
    )
  }

  return (
    <Modal
      open={visible}
      title='加号'
      onOk={() => handleSubmit()}
      onCancel={onClose}
      maskClosable={false}
      footer={null}
      destroyOnClose
      confirmLoading={window.GGMIDENDPRO.GLoadingState}
    >
      <SmartForm
        formItemLayout={formItemLayout}
        ref={refForm}
        cols={1}
        formLayout="horizontal"
        fields={formFields}
      > <div />
      </SmartForm>
      <Button style={{ marginTop: 30, marginLeft: 160 }} onClick={() => { onClose() }}>取消</Button>
      <Popconfirm title={addMessage()} onConfirm={() => { handleSubmit() }}>
        <Button type="primary" style={{ marginTop: 30, marginLeft: 30 }}>加号</Button>
      </Popconfirm>
    </Modal>
  );
}