import React, {useRef, useEffect,useState} from "react";
import {Ajax} from "@/core/trade";
import SmartForm from "@/components/SmartForm";
import {message, Row, Col, Button} from 'antd';

export type RoleCreateProps = {
  record: any;
  deptList: any[],
  templateOption: any[],
  onSuccess: any
};

const EditTable: React.FC<RoleCreateProps> = (props) =>{

  const {
    record,
    deptList,
    templateOption,
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

  const [mode,setMode] = useState('single')

  const catagoryOption = [
    {txt:'软呼叫',value:1},
    {txt:'诊间屏',value:2},
    {txt:'综合大屏',value:3}
  ]

  const catagoryChange=(e)=>{
    if(e===3) setMode('multiple');
    else setMode('single');
  }

  const initMode=()=>{
    if(record&&record.catagory===3) setMode('multiple');
    else setMode('single');
    // return mode;
  }

  const getFields = () => {
    
    return [
      {initialValue: record ? record.id : '',type:'input',placeholder:'请输入',rules:[{required:true,message:'请输入',},{max:30,message:'最多30个字符'}],field:'id',label:'设备id',disabled:record},
      {initialValue: record ? record.id_levels.split(',') : '',type:'select',placeholder:'请输入',rules:[{required:true,message:'请输入',}],mode:mode,field:'id_levels',label:'所属诊室',options:deptList},
      {initialValue: record ? record.catagory : '',type:'select',placeholder:'请输入',rules:[{required:true,message:'请输入',}],field:'catagory',label:'设备类型',options:catagoryOption,onChange:(e)=>{catagoryChange(e)}},
      {initialValue: record ? record.template : '',type:'select',placeholder:'请输入',rules:[{required:true,message:'请输入',}],field:'template',label:'模板',options:templateOption},
    ]
  }

  const refForm = (e) => {
    formRef.current = e;
  }

  // 更新或插入设备信息
  const handleInsert = (fields) => {
    console.log(fields);
    Ajax.Post('TriageUrl', record && `/updateDevice`||`/addDevice`,
      {
        ...fields,
        id_levels:Array.isArray(fields.id_levels)
        ? fields.id_levels
        : [fields.id_levels],
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
    );
  }

  const handleSubmit = () => {
      handleInsert(formRef.current.getForm().getFieldsValue());
  }

  useEffect(()=>{
    initMode()
  },[]);

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