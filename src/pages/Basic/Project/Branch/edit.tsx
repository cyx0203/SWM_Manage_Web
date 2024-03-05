import { Ajax } from '@/components/PageRoot';
import SmartForm from "@/components/SmartForm";
import { useEffect, useRef } from "react";
import { message, Row, Button, Col,Modal } from "antd";

export default (props) => {

  const { visible, record, onClose, onOk, flag} = props;

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

  const getFormFields = () => {
    if (flag) {
      //修改：区域编号不可修改
      return [
        {
          type: 'input',
          label: '区域编号',
          field: 'id',
          required: true,
          message: '请输入区域编号',
          placeholder: '请输入区域编号...',
          initialValue: record?.id ?? '',
          disabled: record ? true : false
        },
        {
          type: 'input',
          label: '名称',
          field: 'name',
          required: true,
          message: '请输入名称',
          placeholder: '请输入名称...',
          initialValue: record?.name ?? '',
        },
        {
          type: 'input',
          label: '位置',
          field: 'address',
          required: false,
          message: '请输入位置',
          placeholder: '请输入位置...',
          initialValue: record?.address ?? '',
        },
      ];
    }else{
      //新增
      return [
        {
          type: 'input',
          label: '区域编号',
          field: 'id',
          required: true,
          message: '请输入区域编号',
          placeholder: '请输入区域编号...',
        }, 
        {
          type: 'input',
          label: '名称',
          field: 'name',
          required: true,
          message: '请输入名称',
          placeholder: '请输入名称...',
        }, 
        {
          type: 'input',
          label: '位置',
          field: 'address',
          required: false,
          message: '请输入位置',
          placeholder: '请输入位置...',
        }, 
      ]
    }
   
  }

  const handleSubmit = () => {
    formRef.current.getForm().validateFields()
      .then(data => {
        if (flag) {
          //修改
          Ajax.Post('BasicUrl', '/manage/comBranch.update',
            {
              id: record.id,
              name: data.name,
              address: data.address,
            },
            (ret: any) => {
              message.success('操作成功');
              formRef.current.getForm().resetFields();
              onOk();
            }
          );
        } else {
          //新增
          //id：新的id为自己设置，需要和allId判断是否有重复
          const newId = data.id;
         
          //level：根据父id的父id是否为"####"判断
          let newLevel = 3;
          if (record.parId === '##') {
            newLevel = 2;
          } 
          //list：根据父id的父id是否为"####"判断
          let newList = newId;
          if (record.parId === '##') {
            newList = record.id + "," + newId;
          } else {
            newList = record.parId + "," + record.id + "," + newId;
          }
          //新增
          Ajax.Post('BasicUrl', '/manage/comBranch.insert',
            {
              id: newId,
              name: data.name,
              parId: record.id,
              list: newList,
              level: newLevel,
              address: data.address,
            },
            (ret: any) => {
              message.success('操作成功');
              formRef.current.getForm().resetFields();
              onOk();
            });
        }
      }).catch(error => {
      });
  }

  return (
    <Modal
      visible={visible}
      title='医院信息编辑'
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
        fields={getFormFields()}
      > <div />
      </SmartForm>
    </Modal>
  );
}