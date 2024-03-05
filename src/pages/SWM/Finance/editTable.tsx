import React, {useRef, useEffect, useState} from "react";
import {Ajax} from "@/core/trade";
import SmartForm from "@/components/SmartForm";
import {message, Row, Col, Button, TreeSelect} from 'antd';
import moment from "moment";
import MD5 from 'blueimp-md5';

export type RoleCreateProps = {
  record: any;
  onSuccess: any;
  treeData: any;
  dataList: any;
  hosList: any[];
};

const EditTable: React.FC<RoleCreateProps> = (props) =>{

  const {
    record,
    onSuccess,
    treeData,
    dataList,
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

  const formRef = useRef(null);
  const [levelName,setLevelName] = useState(record?record.levelName.split(','):[]);
  const [value, setValue] = useState([]);
  const [dis, setDis] = useState(true);
  const initLevelName=()=>{
    const t = record.levelName.split(',')
    setLevelName(t)
  }
  
  useEffect(()=>{
  },[]);


  const { SHOW_PARENT,SHOW_ALL,SHOW_CHILD } = TreeSelect;
  
  const onChange = (newValue: string[],label, extra) => {
    console.log('onChange:', newValue);
    
    // if(newValue[0]==="全选") {
    //   console.log('extra:', extra.allCheckedNodes[0].children);
    //   const arr = [];
    //   for(const i of extra.allCheckedNodes[0].children) {
    //     arr.push(i.node.key)
    //   }
    //   // setValue(arr)
    // } else {
    //   setValue(newValue);
    // }
    setValue(newValue);
    setLevelName(label)
  };
  const tProps ={
    treeData,
    // value,
    onChange,
    treeCheckable: true,
    showCheckedStrategy: SHOW_CHILD,
    style: {
      width: '100%',
    },
  }

  const Domain: any = window.GGMIDENDPRO_EXT_CFG.Domain;
  let fileName = '';
  let fileSize = '';
  let fileSeqNo = '';
  const getFile = (e: any) => {
    console.log("进入到getFile方法")
    if (Array.isArray(e)) return e;
    // console.log("我的event2=", e)
    if (e.fileList.length > 0 && e.fileList[0].status === 'done') {
      fileName = e.fileList[0].name;
      fileSize = e.fileList[0].size;
      fileSeqNo = e.fileList[0].response.name;
    }
    console.log(e)
    console.log(fileName,fileSize,fileSeqNo);
    return e && e.fileList;
  };
  const getFields = () => {
    return [
      {initialValue: record ? record.id : '',type:'input',placeholder:'请输入',rules:[{required:true,message:'请输入',},{max:15,message:'最多15个字符'}],field:'id',label:'人员编号',disabled:record},
      {initialValue: record ? record.jobId : '',type:'input',placeholder:'请输入',rules:[{required:true,message:'请输入',},{max:15,message:'最多15个字符'}],field:'jobId',label:'工号'},
      // {initialValue: record ? record.hospitalId : '',type:'treeselect',placeholder:'请选择院区号',rules:[{required:true,message:'请选择',}],field:'hospitalId',label:'所属院区号',...tProps},
      {initialValue: record ? record.hospitalId : '',type:'select',placeholder:'请选择院区号',rules:[{required:true,message:'请选择',}],field:'hospitalId',label:'所属院区号',options:hosList},
      {initialValue: record ? record.level.split(',') : '',type:'treeselect',placeholder:'请选择院业务技能',rules:[{required:true,message:'请选择',}],field:'level',label:'业务技能',...tProps},
      {initialValue: record ? record.name : '',type:'input',placeholder:'请输入',rules:[{required:true,message:'请输入',},{max:15,message:'最多15个字符'}],field:'name',label:'姓名'},
      {initialValue: null,type:'password',placeholder:'新增或修改密码时填写',rules:record?'':[{required:true,message:'请输入'}],field:'jobPwd_origin',label:record?'原密码':'初始密码',
        onChange:(e: any)=>{
          if(!e.target.value) setDis(true)
          else setDis(false)
        },status:record?'warning':''},
      {initialValue: null,type:'password',placeholder:'修改密码时填写',field:'jobPwd',label:'新密码',disabled:(record&&dis===false)?false:true},
      {initialValue: null,type:'password',placeholder:'修改密码时填写',field:'jobPwd_confine',label:'确认密码',disabled:(record&&dis===false)?false:true},
      {
        type: 'upload',
        label: '头像',
        field: 'imagePath',
        name: 'file',
        maxCount: 1,
        message: '请上传照片',
        valuePropName: 'fileList',
        getValueFromEvent: getFile,
        action: `${Domain.SWMUrl}/manage/uploadFile`
      }
    ]
  }

  const refForm = (e) => {
    formRef.current = e;
  }

  // 验证后插入
  const finalInsert=(fields)=>{
    // console.log(moment().format('YYYY-MM-DD hh:mm:ss'))
    console.log(dataList)
    console.log(fields)
    Ajax.Post('SWMUrl', record && `/updateFinance2`||`/addFinance`,
      {
        ...fields,
        updateTime:moment().format('YYYY-MM-DD hh:mm:ss'),
        levelName:levelName,
        active:dataList?dataList.active:1,
        jobPwd:record?(fields.jobPwd?MD5(fields.jobPwd):null):(fields.jobPwd_origin?MD5(fields.jobPwd_origin):null),
        imagePath:fields['头像']?fields["头像"][0].name:(dataList?dataList.imagePath:null)
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

  // 验证原密码是否一致
  const selectByJobPwd=(fields)=>{
    Ajax.Post('SWMUrl', `/manage/comfinance.queryByJobPwd`,
      {
        ...fields,
        levelName:levelName,
        jobPwd_origin:fields.jobPwd_origin?MD5(fields.jobPwd_origin):null
      }
      , (ret: any) => {
        console.log(ret);
        if(ret&&ret.hasOwnProperty('success')&&ret.success===true&&ret.hasOwnProperty('list')&&ret.list.length>0){
          finalInsert(fields);
        }else{
          message.error('原密码错误!');
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

  // 更新和插入科室信息
  const handleInsert = (fields) => {
    if(record){
      if(fields.jobPwd_origin) {
        if(!fields.jobPwd||!fields.jobPwd_confine){
          message.error('新密码和密码确认不能为空!')
          return;
        }
        if(fields.jobPwd&&fields.jobPwd_confine&&fields.jobPwd!==fields.jobPwd_confine) {
          message.error('新密码和确认密码不一致!')
          return;
        }
        selectByJobPwd(fields);
        return;
      }
      else if((fields.jobPwd||fields.jobPwd_confine)&&!fields.jobPwd_origin){
        message.error('请输入原密码!')
        return;
      } else if (!fields.jobPwd&&!fields.jobPwd_confine&&!fields.jobPwd_origin) {
        finalInsert(fields);
        return;
      }
    }
    else {
      finalInsert(fields);
    }
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