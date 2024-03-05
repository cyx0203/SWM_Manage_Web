import React, {useRef, useEffect, useState} from "react";
import {Ajax} from "@/core/trade";
import SmartForm from "@/components/SmartForm";
import {message, Row, Col, Button, TreeSelect} from 'antd';

export type RoleCreateProps = {
  record: any;
  onSuccess: any;
  // treeData: any[];
  hosList: any[];
};

const EditTable: React.FC<RoleCreateProps> = (props) =>{

  const {
    record,
    onSuccess,
    // treeData
    hosList
  } = props;
 
  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 5 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 14 },
    }
  }

  const userName = localStorage.getItem('GGMIDENDPRO_LOGIN_NAME')
  const formRef = useRef(null);

  useEffect(()=>{
  },[]);


  const { SHOW_PARENT } = TreeSelect;
  const [value, setValue] = useState([]);
  const onChange = (newValue: string[]) => {
    console.log('onChange:', newValue);
    setValue(newValue);
  };
  const tProps ={
    // treeData,
    value,
    onChange,
    treeCheckable: true,
    showCheckedStrategy: SHOW_PARENT,
    style: {
      width: '100%',
    },
  }

  const getFields = () => {
    return [
      {initialValue: record ? record.id : '',type:'input',placeholder:'请输入',rules:[{required:true,message:'请输入',},{max:15,message:'最多15个字符'}],field:'id',label:'座席终端号',disabled:record},
      // {initialValue: record ? record.hospitalId : '',type:'treeselect',placeholder:'请选择院区号',rules:[{required:true,message:'请选择',}],field:'hospitalId',label:'所属院区号',...tProps},
      {initialValue: record ? record.hospitalId : '',type:'select',placeholder:'请选择院区号',rules:[{required:true,message:'请选择',}],field:'hospitalId',label:'所属院区号',options:hosList},
      {initialValue: record ? record.location : '',type:'input',placeholder:'请输入',field:'location',label:'位置'}
    ]
  }

  const refForm = (e) => {
    formRef.current = e;
  }

  // 更新和插入座席信息
  const handleInsert = (fields) => {
    Ajax.Post('SWMUrl', record && `/manage/comseat.updateByPrimaryKeySelective`||`/manage/comseat.insertSelective`,
      {
        ...fields,
      }
      , (ret: any) => {
        console.log(ret);
        if(ret&&ret.hasOwnProperty('success')&&ret.success===true){
          message.success(record && '修改成功'||'创建成功');
          formRef.current.getForm().resetFields();
          if(onSuccess) onSuccess();
        }else{
          message.error(record && '修改失败'||'创建失败')
        }
      }
      , (err: any) => {
        //后台异常、网络异常的回调处理
        //该异常处理函数，可传可不传
        console.log('Ajax Post Error');
        console.log(err);
      }
    );
  }

  const handleSubmit = () => {
    console.log(formRef.current.getForm().getFieldsValue())
      handleInsert(formRef.current.getForm().getFieldsValue());
  }

  return(
    <SmartForm
      formItemLayout={formItemLayout}
      ref={(e) => refForm(e) }
      onSubmit={handleSubmit}
      cols={1}
      formLayout="horizontal"
      fields={getFields()}
    >
      <Row gutter={16}>
        <Col span={2} offset={5}>
          <Button type="primary" htmlType="submit">提交</Button>
        </Col>
      </Row>
    </SmartForm>
  );
}
export default EditTable;