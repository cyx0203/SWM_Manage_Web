import { Ajax } from '@/components/PageRoot';
import SmartForm from "@/components/SmartForm";
import { Fragment, useEffect, useRef, useState } from "react";
import { Modal, message, Alert, Button, Popconfirm } from "antd";
import Util from './util';

export default (props) => {

  const { deptId, deptList, registerType, selectInfo, scheduleList, addschVisible, doctorList, noon, onClose, onOk } = props;

  const [sourceType, setSourceType] = useState(null); //号类ID
  const [registerTypeName, setRegisterTypeName] = useState(null); //确认号类
  const [doctorName, setDoctorName] = useState(null); //医生姓名
  const [stimeType, setStime] = useState(null); //开始时间
  const [etimeType, setEtime] = useState(null); //结束时间
  const [sourceNum, setSourceNum] = useState(null); //号源数量
  const formRef = useRef(null);
  
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

  const refForm = (e) => {
    formRef.current = e;
  }

  //定义号类
  const options = () => {
    let registerTypeList = [];
    let deptname = Util.getDeptNameById(deptList || '', deptId); //获取科室
    if (registerType) {
      for (const item of registerType) {
        if (deptname.indexOf('中医') >= 0) {
          if (item.txt.indexOf('专家') >= 0 || item.txt.indexOf('妇产') >= 0 || item.txt.indexOf('口腔') >= 0) { //中医号去掉专家
            continue;
          }
        }
        if (deptname.indexOf('妇') >= 0 || deptname.indexOf('产') >= 0 || deptname.indexOf('口腔') >= 0) {
          if (item.txt === '普通号' || item.txt.indexOf('专家号 - 正高') >= 0 || item.txt.indexOf('专家号 - 副高') >= 0 || item.txt.indexOf('中医') >= 0) { //妇产口腔去掉其他
            continue;
          }
        }
        registerTypeList.push(item)
      }
    }
    return registerTypeList;
  }

  //清理参数
  const clear = () => {
    setStime(null);
    setEtime(null);
    setSourceType(null);
    setRegisterTypeName(null);
    setDoctorName(null);
    setSourceNum(null);
  }

  //开始变化触发
  const onChangeSTime = (value) => {
    setStime(value && value.substring(0,2) + ':' + value.substring(2));
  }

  //结束时间变化触发
  const onChangeETime = (value) => {
    setEtime(value && value.substring(0,2) + ':' + value.substring(2));
  }

  //号类变化触发
  const onChangeRegType = (value) => {
    setSourceType(value);
    for(const item of registerType){
      if(item.value === value){
        setRegisterTypeName(item.txt);
        return;
      }
    }
  }

  //医生变化触发
  const onChangeDoctorId = (value) => {
    for(const item of doctorList){
      if(item.value === value){
        setDoctorName(item.txt);
        return;
      }
    }
  }

  //数量变化触发
  const onChangeSourceNum = (value) => {
    setSourceNum(value);
  }

  useEffect(() => {
  }, []);

  const formFields = () => {
    const newformFields = [];
    newformFields.push(
      {
        type: 'select',
        label: '开始时段',
        field: 'stime',
        placeholder: '请选择开始时段...',
        options: noon === '1' ? optionsA : optionsP,
        required: true,
        message: '请选择开始时段',
        onChange: onChangeSTime,
      },
      {
        type: 'select',
        label: '结束时段',
        field: 'etime',
        placeholder: '请选择结束时段...',
        options: noon === '1' ? optionsA : optionsP,
        required: true,
        message: '请选择结束时段',
        onChange: onChangeETime,
      },
      {
        type: 'select',
        label: '号别',
        field: 'registerType',
        placeholder: '请选择号别...',
        options: options() || [],
        showSearch: true,
        required: true,
        message: '请选择号别',
        onChange: onChangeRegType,
      }
    );
    if (sourceType === '08' || sourceType === '10' || sourceType === '11' || sourceType === '12' ||
      sourceType === '13' || sourceType === '14' || sourceType === '15') {//专家号或知名专家显示医生姓名
      newformFields.push(
        {
          type: 'select',
          label: '医生',
          field: 'doctorId',
          placeholder: '请选择医生...',
          options: doctorList,
          showSearch: true,
          required: true,
          onChange: onChangeDoctorId,
        }
      );
    }
    newformFields.push(
      {
        type: 'number',
        label: '时间段号源数',
        field: 'sourceNum',
        required: true,
        min: 1,
        message: '请输入时间段号源数',
        placeholder: '请输入时间段号源数...',
        onChange: onChangeSourceNum,
      },
    );
    return newformFields;
  }

  const handleSubmit = () => {
    formRef.current.getForm().validateFields()
      .then(data => {
        if (data) { //判断是否符合规则 副高正高才允许有医生 已有的医生当天不允许排班
          if (data.stime >= data.etime) {
            message.error("请确认开始-结束时间先后！");
            return;
          }
          for (const item of scheduleList) {
            if (data.doctorId === item.doctorId) {
              message.error("该医生排班已添加，请确认！");
              return;
            }
            if (!data.doctorId && data.registerType === item.regType) {
              message.error("该排班已添加，如需添加，请去加号！");
              return;
            }
          }
        }
        Ajax.Post('AptUrl', '/manage/src.addSchdule',
          {
            ...data,
            ...selectInfo,
            noon: noon,
            deptId: deptId,
            hospitalId: localStorage.getItem('hospitalId'),
            createUser: localStorage.getItem('account'),
          }, (ret: any) => {
            setSourceType(null);
            message.success('加排班成功');
            formRef.current.getForm().resetFields();
            onOk();
          }
        );
      }
      ).catch(error => {
        message.error(error);
      });
  }

  //格式化星期
  const weekPic = (week) => {
    switch (week) {
      case 0:
        return '周日';
      case 1:
        return '周一';
      case 2:
        return '周二';
      case 3:
        return '周三';
      case 4:
        return '周四';
      case 5:
        return '周五';
      case 6:
        return '周六';
      default:
        return '';
    }
  }

  const alertMessage = () => {
    return (
      <Fragment>
        当前编辑单元格：<br />
        {Util.getDeptNameById(deptList || '', deptId)} /
        {selectInfo && selectInfo.dateFormat} /
        {weekPic(selectInfo && selectInfo.week)} /
        {noon === '1' ? '上午' : '下午'}
      </Fragment>
    )
  }

  //加号确认信息
  const addMessage = () => {
    return (
      <Fragment>
        请核对加排班信息：<br />
        开始时间：{stimeType} <br />
        结束时间：{etimeType} <br />
        排班号别：{registerTypeName} <br />
        排班医生：{doctorName || '轮班医生'} <br />
        排班数量：{sourceNum}个
      </Fragment>
    )
  }

  return (
    <Modal
      open={addschVisible}
      title='加排班'
      onCancel={() => { clear(); onClose() }}
      maskClosable={false}
      footer={null}
      destroyOnClose
      confirmLoading={window.GGMIDENDPRO.GLoadingState}
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
      <Button style={{ marginTop: 30, marginLeft: 160 }} onClick={() => { clear(); onClose() }}>取消</Button>
      <Popconfirm title={addMessage()} onConfirm={() => { handleSubmit() }}>
        <Button type="primary" style={{ marginTop: 30, marginLeft: 30 }}>加排班</Button>
      </Popconfirm>
    </Modal>
  );
}