import { useEffect, useRef } from 'react';
import { Ajax } from '@/components/PageRoot';
import { message, Modal } from "antd";
import SmartForm from "@/components/SmartForm";
import utils from '../../utils';
import _ from 'lodash';

export default (props: any) => {
  const { visible, record, editMode, onClose, onOk, dishleft } = props;

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
      type: 'select',
      label: '菜品',
      field: 'dishId',
      required: true,
      options: record ? [] : (dishleft?.tv || []),
      placeholder: '请输入菜品名称...',
      initialValue: record ? record.name : '',
      disabled: record ? true : false
    }, {
      type: 'select',
      label: '是否启用',
      field: 'status',
      required: true,
      options: utils.getStatus() ? utils.getStatus() : [],
      placeholder: '请选择是否启用...',
      initialValue: record ? record.status : '',
    }, {
      type: 'select',
      label: '供应午别',
      field: 'timeInterval',
      required: true,
      mode: "multiple",
      options: utils.getTimeiInterval() ? utils.getTimeiInterval() : [],
      placeholder: '请选择供应午别...',
      initialValue: record ? record.timeInterval.split(",") : [],
    }
    ]
    return formFields;
  };

  const handleSubmit = (data: any) => {
    let url: string;
    let param: any;
    if (editMode) {
      url = '/manage/mealdishadd.update-dish'
      param = {
        ...data,
        timeInterval: data.timeInterval ? _.join(_.sortBy(data.timeInterval), ",") : null,
        id: record.id,
      }
    }
    else {
      url = '/manage/mealdishadd.save-dish'
      param = {
        ...data,
        timeInterval: data.timeInterval ? _.join(_.sortBy(data.timeInterval), ",") : null,
      }
    }
    formRef.current.getForm().validateFields()
      .then(
        Ajax.Post('MealUrl', url, param
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
      title='加餐信息编辑'
      onOk={() => handleSubmit(formRef.current.getForm().getFieldsValue())}
      onCancel={onClose}
      okText="提交"
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
