import { Ajax } from '@/components/PageRoot';
import SmartForm from "@/components/SmartForm";
import { useEffect, useRef } from "react";
import { Modal, message } from "antd";

export default (props) => {

  const { visible, record, onClose, onOk ,code,editFlag,hasChild} = props;

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
    label: '代码编号',
    field: 'id',
    required: true,
    message: '请输入代码编号',
    placeholder: '请输入设代码编号...',
    initialValue: record ? record.value : '',
    disabled:record ? true:false
    
  }, {
    type: 'input',
    label: '代码名称',
    field: 'name',
    required: true,
    message: '请输入代码名称',
    placeholder: '请输入代码名称...',
    initialValue: record ? record.txt : '',
  }, {
    type: 'input',
    label: '笔记',
    field: 'note',
    required: false,
    message: '请输入笔记',
    placeholder: '请输入笔记...',
    initialValue: record ? record.note : '',
  },
  {
    type: 'input',
    label: '备注',
    field: 'pad1',
    required: false,
    message: '请输入备注',
    placeholder: '请输入备注...',
    initialValue: record ? record.pad1 : '',
  },
  ]

  const handleSubmit = () => {
    formRef.current.getForm().validateFields()
    .then(data => {
        let url;
        let param;
        if (record) {  //edit
          url = '/manage/code.update';
          param = {
            ...data,
            oid : record.value,
            oparId: record.parId
          }
        }
        else { //add
          url = '/manage/code.insert';
          param = {
            ...data,
            parId:code,
          }
        }
        Ajax.Post('BasicUrl', url, param
          , (ret: any) => {
            //如果是一级目录的编辑并且有子数据，再进行更新其子数据的指向
            if(editFlag && hasChild){
              Ajax.Post('BasicUrl', '/manage/code.updateSecond', {
                parId : data.id,
                oid : record.value
              }
              , (secondRet: any) => {
                message.success('操作成功');
                formRef.current.getForm().resetFields();
                onOk();
              })
            }else{
              message.success('操作成功');
              formRef.current.getForm().resetFields();
              onOk();
            }
        }
      );

    }).catch(error => {
    });
  }

  return (
    <Modal
      open={visible}
      title='代码编辑'
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