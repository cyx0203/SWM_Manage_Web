import { Ajax } from '@/components/PageRoot';
import SmartForm from "@/components/SmartForm";
import { useEffect, useRef } from "react";
import { Modal, message } from "antd";
import moment from 'moment';

export default (props) => {
  const { visible, record, onClose, onOk, hospitalKV } = props;

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

  const formFields = [{
    type: 'input',
    label: '食堂名称',
    field: 'name',
    required: true,
    message: '请输入食堂名称',
    placeholder: '请输入食堂名称...',
    initialValue: record ? record.name : '',
  }, {
    type: 'select',
    label: '所属院区',
    field: 'hospitalId',
    required: true,
    options: hospitalKV ? hospitalKV.tv : [],
    placeholder: '请选择食堂所属院区...',
    initialValue: record ? record.hospitalId : '',
  }, {
    type: 'textarea',
    label: '简介',
    field: 'profile',
    message: '请输入食堂简介（50字以内）',
    placeholder: '请输入食堂简介...',
    maxLength: 50,
    showCount: true,
    initialValue: record ? record.profile : '',
  }, {
    type: 'textarea',
    label: '详情',
    field: 'detail',
    message: '请输入食堂详情（200字以内）',
    placeholder: '请输入食堂详情...',
    maxLength: 200,
    showCount: true,
    initialValue: record ? record.detail : '',
  }, {
    type: 'input',
    label: '联系电话',
    field: 'telephone',
    message: '请输入食堂联系电话',
    placeholder: '请输入食堂联系电话...',
    initialValue: record ? record.telephone : '',
  }, {
    type: 'input',
    label: '地址',
    field: 'canteenAddress',
    message: '请输入食堂地址',
    placeholder: '请输入食堂地址...',
    initialValue: record ? record.canteenAddress : '',
  }, {
    type: 'range-time-picker',
    label: '早餐配送时间',
    field: 'breakfast',
    format: "HH:mm",
    initialValue: record ? [moment(record.deliveryBreakfastBegin, 'HH:mm'), moment(record.deliveryBreakfastEnd, 'HH:mm')] : [],
  }, {
    type: 'range-time-picker',
    label: '中餐配送时间',
    field: 'lunch',
    format: "HH:mm",
    initialValue: record ? [moment(record.deliveryLunchBegin, 'HH:mm'), moment(record.deliveryLunchEnd, 'HH:mm')] : [],
  }, {
    type: 'range-time-picker',
    label: '晚餐配送时间',
    field: 'dinner',
    format: "HH:mm",
    initialValue: record ? [moment(record.deliveryDinnerBegin, 'HH:mm'), moment(record.deliveryDinnerEnd, 'HH:mm')] : [],
  }, {
    type: 'range-time-picker',
    label: '预约点餐时间',
    field: 'orderTime',
    format: "HH:mm",
    initialValue: record ? [moment(record.orderTimeBegin, 'HH:mm'), moment(record.orderTimeEnd, 'HH:mm')] : [],
  }, {
    type: 'range-time-picker',
    label: '今日早餐点餐时间',
    field: 'todaybreakfast',
    format: "HH:mm",
    initialValue: record ? [moment(record.todayBreakfastBegin, 'HH:mm'), moment(record.todayBreakfastEnd, 'HH:mm')] : [],
  }, {
    type: 'range-time-picker',
    label: '今日午餐点餐时间',
    field: 'todaylunch',
    format: "HH:mm",
    initialValue: record ? [moment(record.todayLunchBegin, 'HH:mm'), moment(record.todayLunchEnd, 'HH:mm')] : [],
  }, {
    type: 'range-time-picker',
    label: '今日晚餐点餐时间',
    field: 'todaydinner',
    format: "HH:mm",
    initialValue: record ? [moment(record.todayDinnerBegin, 'HH:mm'), moment(record.todayDinnerEnd, 'HH:mm')] : [],
  }
  ]

  const handleSubmit = () => {
    formRef.current.getForm().validateFields()
      .then(data => {
        let url;
        let param;
        if (record) {  //edit
          url = '/manage/mealcanteen.update-canteen';
          param = {
            ...data,
            id: record && record.id,
          }
        }
        else { //add
          url = '/manage/mealcanteen.save-canteen';
          param = {
            ...data,
          }
        }
        if (data.breakfast) {
          param.deliveryBreakfastBegin = moment(data.breakfast[0]).format('HH:mm');
          param.deliveryBreakfastEnd = moment(data.breakfast[1]).format('HH:mm');
        }
        if (data.lunch) {
          param.deliveryLunchBegin = moment(data.lunch[0]).format('HH:mm');
          param.deliveryLunchEnd = moment(data.lunch[1]).format('HH:mm');
        }
        if (data.dinner) {
          param.deliveryDinnerBegin = moment(data.dinner[0]).format('HH:mm');
          param.deliveryDinnerEnd = moment(data.dinner[1]).format('HH:mm');
        }
        if (data.orderTime) {
          param.orderTimeEnd = moment(data.orderTime[0]).format('HH:mm');
          param.orderTimeEnd = moment(data.orderTime[1]).format('HH:mm');
        }
        if (data.todaybreakfast) {
          param.todayBreakfastBegin = moment(data.todaybreakfast[0]).format('HH:mm');
          param.todayBreakfastEnd = moment(data.todaybreakfast[1]).format('HH:mm');
        }
        if (data.todaylunch) {
          param.todayLunchBegin = moment(data.todaylunch[0]).format('HH:mm');
          param.todayLunchEnd = moment(data.todaylunch[1]).format('HH:mm');
        }
        if (data.todaydinner) {
          param.todayDinnerBegin = moment(data.todaydinner[0]).format('HH:mm');
          param.todayDinnerEnd = moment(data.todaydinner[1]).format('HH:mm');
        }

        Ajax.Post('MealUrl', url, param
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
      visible={visible}
      title='食堂编辑'
      onOk={() => handleSubmit()}
      onCancel={onClose}
      okText="提交"
      cancelText="取消"
      destroyOnClose
    >
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