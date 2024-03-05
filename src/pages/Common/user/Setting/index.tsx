import { Card, Row, Col, Button, message } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { DomRoot, Ajax } from '@/components/PageRoot';
import SmartForm from '@/components/SmartForm';
import MD5 from 'blueimp-md5';
import { history } from 'umi';

export default () => {
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



  const handleSubmit = () => {
    const fields = formRef.current.getForm().getFieldsValue();

    if(fields.newpassword != fields.newpassword2){
      message.error('2次输入的新密码不一致');
      return;
    }
    Ajax.Post('BasicUrl', `/manage/user.changePassword`,
      {
        oldPassword: MD5(fields.oldpassword),
        password: MD5(fields.newpassword),
        account: localStorage.getItem("account")
       
      }
      , (ret: any) => {
          message.success('操作成功,请重新登录');
          formRef.current.getForm().resetFields();
          //跳转到内页的默认页 welcome
          history.push({
            pathname: '/user/login'//'/welcome'
          });
        }
    
      
    );

  }




  useEffect(() => {
    return () => {

    }
  }, []);

  const formFields = [{
    type: 'password',
    label: '原密码',
    field: 'oldpassword',
    required: true,
    placeholder: '请输入原密码...',
    rules:[{ validator: (_, value) =>
      value === localStorage.getItem("GGMIDENDPRO_LOGIN_PWD") ? Promise.resolve() : Promise.reject(new Error('原密码输入不正确'))}]
  },{
    type: 'password',
    label: '新密码',
    field: 'newpassword',
    required: true,
    placeholder: '请输入新密码...',
  },{
    type: 'password',
    label: '再次输入新密码',
    field: 'newpassword2',
    required: true,
    placeholder: '请再次输入新密码...',
    rules:[{ validator: (_, value) =>
      value === formRef.current.getForm().getFieldValue('newpassword') ? Promise.resolve() : Promise.reject(new Error('2次输入的密码不一致')),}]
  }
]


  return (
    <DomRoot>
      <Card title="密码修改" >
        <Row>
          <Col span={8}></Col>
          <Col span={8}>
            <SmartForm
              onSubmit={handleSubmit}
              formItemLayout={formItemLayout}
              ref={refForm}
              cols={1}
              formLayout="horizontal"
              fields={formFields}
            > 
              <Row gutter={16}>
                <Col span={6} offset={5}>
                  <Button type="primary" htmlType="submit">提交</Button>
                </Col>
              </Row>
            </SmartForm>
          </Col>
          <Col span={8}></Col>
        </Row>


        
      </Card>
    </DomRoot>
  );
};

