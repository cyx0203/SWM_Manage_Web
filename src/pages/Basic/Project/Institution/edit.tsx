import { Ajax } from '@/components/PageRoot';
import SmartForm from "@/components/SmartForm";
import { useEffect, useRef } from "react";
import { message, Row, Button, Col } from "antd";

export default (props) => {

  const { record, onSuccess, allId, flag, isCreate ,hospitalId} = props;

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
    if (flag) {
      formRef.current.getForm().setFieldsValue({ ...record });
    } else {
      formRef.current.getForm().setFieldsValue({});
    }

    if (isCreate) {
      formRef.current.getForm().setFieldsValue({ id: '0000' });
    }
  }, []);

  const getFields = () => {
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
          readOnly : true,
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
    } else {
      //新增
      return [
        {
          type: 'input',
          label: '区域编号',
          field: 'id',
          required: true,
          message: '请输入区域编号',
          placeholder: '请输入区域编号...',
          readOnly : isCreate ? true : false
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

        if (isCreate) {
          //新增
          Ajax.Post('BasicUrl', '/manage/hospBranch.insert', 
            {
            hospitalId : hospitalId,
            id : data.id,
            name : data.name,
            parId : "####",
            list : "0000",
            level : "1",
            address : data.address,
            },
            (ret: any) => {
              if(ret.success){
                message.success('新增成功');
              }else{
                message.error('新增失败');
              }
              onSuccess();
              
            });
        }else if (flag) {
          //修改
          Ajax.Post('BasicUrl', '/manage/hospBranch.update',
            {
              id : record.id,
              name : data.name,
              address : data.address,
            },
            (ret: any) => {
              if(ret.success){
                message.success('修改成功');
              }else{
                message.error('修改失败');
              }
              onSuccess();
            }
          );
        } else {
          //新增
          //id：新的id为自己设置，需要和allId判断是否有重复
          const newId = data.id;
          while (true) {
            const temp = allId.includes(newId);
            console.log(newId, temp);
            if (temp) {
              message.error('ID重复');
            } else {
              console.log('得到的id', newId);
              break;
            }
          }
          //level：根据父id的父id是否为"####"判断
          let newLevel = 1;
          if (record.parId === '####') {
            newLevel = 2;
          } else {
            newLevel = 3;
          }
          //list：根据父id的父id是否为"####"判断
          let newList = newId;
          if (record.parId === '####') {
            newList = record.id + "," + newId;
          } else {
            newList = record.parId + ","+ record.id + "," + newId;
          }
          //新增
          Ajax.Post('BasicUrl', '/manage/hospBranch.insert', 
            {
            hospitalId : record.hospitalId,
            id : newId,
            name : data.name,
            parId : record.id,
            list : newList,
            level : newLevel,
            address : data.address,
            },
            (ret: any) => {
              if(ret.success){
                message.success('新增成功');
              }else{
                message.error('新增失败');
              }
              onSuccess();
            });
        }
      }).catch(error => {
      });
  }

  return (
    <SmartForm
      formItemLayout={formItemLayout}
      ref={(e) => refForm(e)}
      onSubmit={handleSubmit}
      cols={1}
      formLayout="horizontal"
      fields={getFields()}
    >
      <Row gutter={16}>
        <Col span={2} offset={7}>
          <Button type="primary" htmlType="submit">提交</Button>
        </Col>
      </Row>
    </SmartForm>
  );
}