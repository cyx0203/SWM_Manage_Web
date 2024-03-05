import { Ajax } from '@/components/PageRoot';
import SmartForm from "@/components/SmartForm";
import { useEffect, useRef, useState } from "react";
import { Modal, message } from "antd";

export default (props) => {

  const { record, visible, ruleSourceId, onClose, onOk } = props;

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
  const [ruleType, setRuleType] = useState(null); //结束时间
  const [noon, setNoon] = useState(null); //午别

  const refForm = (e) => {
    formRef.current = e;
  }

  //时段变化触发
  const onCancle = () => {
    setRuleType(null);
    setNoon(null);
  }

  //时段变化触发
  const onChangeRuleType = (e) => {
    setRuleType(e.target.value);
  }

  //午别变化触发
  const onChangeNoon = (e) => {
    setNoon(e.target.value);
  }

  useEffect(() => {
  }, []);

  const formFields = () => {

    const newformFields = [];
    newformFields.push(
      {
        type: 'radiobutton',
        label: '上班时段',
        field: 'isGivenTime',
        required: true,
        message: '请选择是否启用规则',
        placeholder: '请选择是否启用规则...',
        options: [
          {
            text: '上班时段',
            value: '0',
          }, {
            text: '指定时段',
            value: '1',
          },
        ],
        initialValue: record ? record.isGivenTime : '0',
        onChange: onChangeRuleType,
      },
      {
        type: 'radio',
        label: '午别',
        field: 'noon',
        required: true,
        message: '请选择是否启用规则',
        placeholder: '请选择是否启用规则...',
        options: [
          {
            text: '早间',
            value: '4',
          }, {
            text: '上午',
            value: '1',
          }, {
            text: '午间',
            value: '3',
          }, {
            text: '下午',
            value: '2',
          }, {
            text: '晚间',
            value: '5',
          },
        ],
        initialValue: record ? record.noon : '1',
        onChange: onChangeNoon,
      },
    );
    if (record && record.isGivenTime == '1' || ruleType === '1') {
      newformFields.push(
        {
          type: 'select',
          label: '开始时段',
          field: 'stime',
          placeholder: '请选择开始时段...',
          options: (noon === '2' || noon === '3' || noon === '5') ||
            (record && (record.noon === '2' || record.noon === '3' || record.noon === '5')) ? optionsP : optionsA,
          required: true,
          message: '请选择开始时段',
          initialValue: record ? record.stime : '',
        },
        {
          type: 'select',
          label: '结束时段',
          field: 'etime',
          placeholder: '请选择结束时段...',
          options: (noon === '2' || noon === '3' || noon === '5') ||
            (record && (record.noon === '2' || record.noon === '3' || record.noon === '5')) ? optionsP : optionsA,
          required: true,
          message: '请选择结束时段',
          initialValue: record ? record.etime : '',
        }
      );
    }
    newformFields.push(
      {
        type: 'radio',
        label: '分时间间隔',
        field: 'timeType',
        required: true,
        message: '请选择分时间间隔',
        placeholder: '请选择分时间间隔...',
        options: [
          {
            text: '30分钟',
            value: '1',
          },
          {
            text: '大时段',
            value: '0',
          },
        ],
        initialValue: record ? record.timeType : '1'
      },
      {
        type: 'number',
        label: '时间段号源数',
        field: 'sourceNum',
        required: true,
        min: 1,
        message: '请输入时间段号源数',
        placeholder: '请输入时间段号源数...',
        initialValue: record ? record.sourceNum : ''
      },
    )

    return newformFields;
  }

  const handleSubmit = () => {
    formRef.current.getForm().validateFields()
      .then(data => {
        if (data.stime) { //判断时间先后
          if (data.stime >= data.etime) {
            message.error("请确认开始-结束时间先后！");
            return;
          }
        }
        let url;
        let param;
        if (record) {  //edit
          url = '/manage/ruleSourceDetail.updateDetail';
          param = {
            ...data,
            ruleSourceId: ruleSourceId,
            hospitalId: localStorage.getItem('hospitalId'),
            oid: record && record.id,
          }
        }
        else { //add
          url = '/manage/ruleSourceDetail.insertById';
          param = {
            ...data,
            ruleSourceId: ruleSourceId,
            hospitalId: localStorage.getItem('hospitalId'),
            createUser: localStorage.getItem('account'),
          }
        }
        Ajax.Post('AptUrl', url, param,
          (ret: any) => {
            onCancle();
            message.success('操作成功');
            formRef.current.getForm().resetFields();
            onOk();
          }
        );
      }
      ).catch(error => {
        message.error(error);
      });
  }

  return (
    <Modal
      open={visible}
      title='规则编辑'
      onOk={() => handleSubmit()}
      onCancel={() => { onCancle(); onClose(); }}
      maskClosable={false}
      destroyOnClose
      width={500}
      confirmLoading={window.GGMIDENDPRO.GLoadingState}
    >
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