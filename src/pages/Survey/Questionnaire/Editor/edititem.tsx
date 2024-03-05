import { Ajax } from '@/components/PageRoot';
import SmartForm from "@/components/SmartForm";
import { useRef } from "react";
import { Modal, message, } from "antd";

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

  const formRef = useRef(null);

  const refForm = (e: any) => {
    formRef.current = e;
  }

  const handleSubmit = (data: any) => {
    // console.log("我的record=", record)
    // console.log("我的data=", data)
    // debugger
    formRef.current.getForm().validateFields()
      .then(() => {
        Ajax.Post('SurveyUrl', '/manage/questionSurveyItem.update',
          {
            itemId: data.itemId,
            item: data.item,
            type: data.type
          }
          , (ret: any) => {
            message.success('操作成功');
            formRef.current.getForm().resetFields();
            onOk();
          }
        )
      }
      )
      .catch((err: any) => {
        // message.error(err)
        // return;
      })
  };


  const getFormFields = () => {
    const arr = [
      {
        type: 'input',
        label: '题目编号',
        field: 'itemId',
        required: true,
        message: '请输入题目编号',
        placeholder: '请输入题目编号...',
        initialValue: record ? record.itemId : '',
        style: { width: 250 },
        disabled: true
      },
      {
        type: 'select',
        label: '题目类型',
        field: 'type',
        required: true,
        message: '请选择选择类型',
        placeholder: '请选择题目类型...',
        options: JSON.parse(localStorage.getItem("codeKV")).WJ,
        initialValue: record ? record.type : '',
        style: { width: 250 },
      },
      {
        type: 'input',
        label: '题目名称',
        field: 'item',
        required: true,
        message: '请输入题目名称',
        placeholder: '请输入题目名称...',
        initialValue: record ? record.item : '',
        style: { width: 250 }
      },
    ];
    // if (!(isEmpty(record)) && ("option" in record) && (record.option.length > 0)) {
    //   for (let i = 1; i <= record.option.length; i++) {
    //     const obj: any = {
    //       type: 'input',
    //       label: '选项' + i,
    //       field: 'option' + i,
    //       message: '请输入选项内容',
    //       placeholder: '请输入选项内容...',
    //       initialValue: record.option ? record.option[i - 1] : '',
    //       style: { width: 250 },
    //       disabled: true
    //     }
    //     arr.push(obj)
    //   }
    // }
    return arr;
  }

  return (
    <Modal
      visible={visible}
      title='问题编辑'
      onOk={() => handleSubmit(formRef.current.getForm().getFieldsValue())}
      onCancel={onClose}
      okText="提交"
      cancelText="取消"
      destroyOnClose
    >
      <SmartForm
        formItemLayout={formItemLayout}
        ref={refForm}
        cols={1}
        formLayout="inline"
        fields={getFormFields()}
      > <div />
      </SmartForm>
    </Modal>
  );
}