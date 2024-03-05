import { Ajax } from '@/components/PageRoot';
import { useRef, useState } from "react";
import { Modal, message, } from "antd";
import SpecialForm from '../util/index';

export default (props) => {

  const { visible, editMode, record, onClose, onOk, order, changeOrder } = props;

  const [optionOrder, setOptionOrder] = useState(0);


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

  const refForm = (e: any) => {
    formRef.current = e;
  }

  const handleSubmit = (data: any) => {

    let url: string;
    let param: any;
    if (editMode) {
      url = '/manage/questionSurveyItem.updateById'
      param = {
        id: record.id,
        ...data,
      }
    }
    else {
      url = '/manage/saveQuestionItem'
      param = {
        questionId: record.questionId,
        order: order,
        createUser: localStorage.getItem('GGMIDENDPRO_LOGIN_NAME'),
        ...data
      }
    }
    formRef.current.getForm().validateFields()
      .then(() => {
        Ajax.Post('SurveyUrl', url, param,
          (ret: any) => {
            message.success('操作成功');
            formRef.current.getForm().resetFields();
            changeOrder(order + 1)
            onOk();
            setOptionOrder(0);
          }
        )
      }
      )
    .catch((err: any) => {
      // message.error('操作失败')
      // return;
    })
  };

  const addFormFields = () => {
    setOptionOrder(optionOrder + 1)
  }

  const subFormFields = () => {
    setOptionOrder(optionOrder - 1)
  }


  const getFormFields = () => {
    const arr = [
      {
        type: 'input',
        label: '题目编号',
        field: 'itemId',
        required: true,
        message: '请输入题目编号',
        placeholder: '请输入题目编号...',
        style: { width: 250 }
      },
      {
        type: 'select',
        label: '题目类型',
        field: 'type',
        required: true,
        message: '请选择选择类型',
        placeholder: '请选择题目类型...',
        options: JSON.parse(localStorage.getItem("codeKV")).WJ,
        style: { width: 250 }
      },
      {
        type: 'input',
        label: '题目名称',
        field: 'item',
        required: true,
        message: '请输入题目名称',
        placeholder: '请输入题目名称...',
        style: { width: 250 }
      },
    ];
    if (optionOrder > 0) {
      for (let i = 1; i <= optionOrder; i++) {
        const obj: any = {
          type: 'input',
          label: '选项' + i,
          field: 'option' + i,
          required: true,
          message: '请输入选项内容',
          placeholder: '请输入选项内容...',
          style: { width: 250 },
        }
        arr.push(obj)
      }
    }
    return arr;
  }

  return (
    <Modal
      visible={visible}
      title='问题编辑'
      onOk={() => handleSubmit(formRef.current.getForm().getFieldsValue())}
      onCancel={() => {
        onClose();
        setOptionOrder(0);
      }}
      okText="提交"
      cancelText="取消"
      destroyOnClose
    >
      <SpecialForm
        formItemLayout={formItemLayout}
        ref={refForm}
        cols={1}
        formLayout="inline"
        fields={getFormFields()}
        addFormFields={addFormFields}
        subFormFields={subFormFields}
      > <div />
      </SpecialForm>
    </Modal>
  );
}