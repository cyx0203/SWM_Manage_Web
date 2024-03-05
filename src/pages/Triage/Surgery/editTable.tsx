import React, {useRef, useEffect} from "react";
import {Ajax} from "@/core/trade";
import SmartForm from "@/components/SmartForm";
import {message, Row, Col, Button} from 'antd';

export type RoleCreateProps = {
  record: any;
  deptList: any[],
  onSuccess: any
};

const EditTable: React.FC<RoleCreateProps> = (props) =>{

  const {
    record,
    deptList,
    onSuccess
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

  const getFields = () => {
    return [
      {initialValue: record ? record.id : '',type:'input',placeholder:'请输入',rules:[{required:true,message:'请输入',},{max:15,message:'最多15个字符'}],field:'id',label:'诊室id',disabled:record},
      {initialValue: record ? record.name : '',type:'input',placeholder:'请输入',rules:[{required:true,message:'请输入',},{max:30,message:'最多30个字符'}],field:'name',label:'诊室名称'},
      {initialValue: record ? record.parentids.split(',') : '',type:'select',placeholder:'请输入',rules:[{required:true,message:'请输入',}],mode:'multiple',field:'parentids',label:'所属科室',options:deptList},
      
    ]
  }

  const refForm = (e) => {
    formRef.current = e;
  }

  // 更新和插入诊室信息
  const handleInsert = (fields) => {
    // console.log(fields);
    Ajax.Post('TriageUrl', record && `/updateRoom`||`/addRoom`,
      {
        ...fields,
      }
      , (ret: any) => {
        if(ret){
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
      ,
      //这里可以传指定的特殊http地址
    );
  }


  const handleSubmit = () => {
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