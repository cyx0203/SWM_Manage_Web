import React, {useRef, useEffect,useState} from "react";
import {Ajax} from "@/core/trade";
import SmartForm from "@/components/SmartForm";
import {message, Row, Col, Button} from 'antd';

export type RoleCreateProps = {
  record: any;
  onSuccess:any
};

const Create : React.FC<RoleCreateProps> = (props) =>{

  const {
    record,
    onSuccess
  } = props;  

  const [menuData,setMenuData] = useState(null);
  const [menuidList,setMenuidList] = useState([]);
 
 
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
  
  const searchMenu = () => {
    Ajax.Post('BasicUrl', '/manage/menu/role.selectByPrimaryKey',
      {
        childName: 'children',
        listKey: 'menuData',
      }
      , (ret: any) => {
        if(ret&&ret.hasOwnProperty('success')&&ret.success===true){
          let temp = ret.menuData;
          setMenuData(temp);
         
          record && record.menuidList && setMenuidList(record.menuidList.split(",").map(item => {  
            return +item;  
          }));
         
          record && formRef.current.getForm().setFieldsValue({...record});
        } 
        else 
        {
          message.error('菜单获取失败')
        }
      }
      , (err: any) => {
        //后台异常、网络异常的回调处理
        //该异常处理函数，可传可不传
        console.log('Ajax Post Error');
        console.log(err);
        console.log('OH No~~~😭');
      }
      ,
      //这里可以传指定的特殊http地址
      // { baseUrl: 'http://192.168.1.1:1020' }
    );
  }

  useEffect(()=>{
    searchMenu();
  },[]);

  const onCheck = (checkedKeys, info) => {
      setMenuidList(checkedKeys);
  }

  const getFields = () => {
    return [
      {type:'input',placeholder:'请输入',rules:[{required:true,message:'请输入',},{max:15,message:'最多15个字符'}],field:'name',label:'角色名称'},
      {type:'input',placeholder:'请输入',rules:[{required:true,message:'请输入',},{max:30,message:'最多30个字符'}],field:'desc',label:'说明'},
      {
        type:'tree',
        field:'menuidList',
        label:'菜单',
        checkable:true,
        checkedKeys: menuidList,
        onCheck:(checkedKeys, info)=>onCheck(checkedKeys, info),
        treeData:menuData
      },
    ]
  }

  const refForm = (e) => {
    formRef.current = e;
  }

  const handleInsert = (fields) => {
    if(!menuidList || menuidList.length == 0){
      message.warning('请选择菜单');
      return;
    }

    Ajax.Post('BasicUrl', record && `/manage/role/role.updateByPrimaryKeySelective`|| `/manage/role/role.insertSelective`,
      {
        ...fields,
        id: record && record.id,
        menuidList,
      }
      , (ret: any) => {
        if(ret&&ret.hasOwnProperty('success')&&ret.success===true){
          message.success(record && '修改成功'||'创建成功');
          formRef.current.getForm().resetFields();
          setMenuidList([]);
          onSuccess && onSuccess();
        }else{
          message.error(record && '修改失败'||'创建失败')
        }
      }
      , (err: any) => {
        //后台异常、网络异常的回调处理
        //该异常处理函数，可传可不传
        console.log('Ajax Post Error');
        console.log(err);
        console.log('OH No~~~😭');
      }
      ,
      //这里可以传指定的特殊http地址
      // { baseUrl: 'http://192.168.1.1:1020' }
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
export default Create;