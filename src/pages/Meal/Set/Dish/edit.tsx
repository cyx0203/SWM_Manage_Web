import { useEffect, useRef } from 'react';
import { Ajax } from '@/components/PageRoot';
import { message, Modal } from "antd";
import SmartForm from "@/components/SmartForm";
import utils from '../../utils';
import _ from 'lodash';

export default (props: any) => {
  const { visible, record, canteenKV, dishTypeKV, editMode, onClose, onOk } = props;
  const Domain: any = window.GGMIDENDPRO_EXT_CFG.Domain;
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

  let fileSeqNo = '';

  useEffect(() => {
  }, []);

  const getFile = (e: any) => {
    if (Array.isArray(e)) return e;
    if (e.fileList.length > 0 && e.fileList[0].status === 'done') {
      fileSeqNo = e.fileList[0].response.name;
    }
    return e && e.fileList;
  };

  const getFields = () => {
    const formFields: any = [{
      type: 'input',
      label: '菜品名称',
      field: 'name',
      required: true,
      message: '请输入菜品名称',
      placeholder: '请输入菜品名称...',
      initialValue: record ? record.name : '',
    }, {
      type: 'number',
      label: '单价(元)',
      field: 'price',
      required: true,
      message: '请输入菜品单价',
      placeholder: '请输入菜品单价...',
      initialValue: record ? (record.price * 0.01).toFixed(2) : '',
    }, {
      type: 'textarea',
      label: '简介',
      field: 'profile',
      message: '请输入菜品简介（50字以内）',
      placeholder: '请输入菜品简介...',
      maxLength: 50,
      showCount: true,
      initialValue: record ? record.profile : '',
    }, {
      type: 'textarea',
      label: '详情',
      field: 'detail',
      message: '请输入菜品详情（200字以内）',
      placeholder: '请输入菜品详情...',
      maxLength: 200,
      showCount: true,
      initialValue: record ? record.detail : '',
    }, {
      type: 'select',
      label: '菜品类别',
      field: 'dishTypeId',
      required: true,
      options: dishTypeKV ? dishTypeKV.tv : [],
      placeholder: '请选择菜品类别...',
      initialValue: record ? record.dishTypeId : '',
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
    }, {
      type: 'select',
      label: '所属食堂',
      field: 'canteenId',
      required: true,
      options: canteenKV ? canteenKV.tv : [],
      placeholder: '请选择食堂所属院区...',
      initialValue: record ? record.canteenId + "" : '',
    }
    ]

    if (!editMode) {
      formFields.push({
        type: 'upload',
        label: '菜品图例',
        field: 'upload',
        name: 'file',
        maxCount: 1,
        required: true,
        message: '请上传照片',
        buttonText: '点击上传照片',
        valuePropName: 'fileList',
        getValueFromEvent: getFile,
        action: `${Domain.MealUrl}/uploadDishPic`
      })
    }
    return formFields;
  };

  const handleSubmit = (data: any) => {
    let url: string;
    let param: any;
    if (editMode) {
      url = '/manage/mealdish.update-dish'
      param = {
        ...data,
        timeInterval: data.timeInterval ? _.join(_.sortBy(data.timeInterval), ",") : null,
        price: (data.price * 100).toFixed(),
        id: record.id,
      }
    }
    else {
      url = '/manage/mealdish.save-dish'
      param = {
        ...data,
        price: (data.price * 100).toFixed(),
        timeInterval: data.timeInterval ? _.join(_.sortBy(data.timeInterval), ",") : null,
        picFile: fileSeqNo,
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
      title='菜品信息编辑'
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
