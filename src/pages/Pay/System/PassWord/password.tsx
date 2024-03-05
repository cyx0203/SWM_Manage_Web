import { useEffect } from 'react';
import { DomRoot, Ajax, KeepAlive } from '@/components/PageRoot';
import { Form,Input, Button, Card, Row, Col, message } from 'antd';
import MD5 from 'blueimp-md5';

const Password = () => {

  const [form] = Form.useForm();

  //更新密码
  const onFinish = (values: any) => {
    Ajax.Post('PayUrl', '/manage/PayUserPassword.updatePassword',
    {
        userid : localStorage.userid,
        oldPassword : MD5(values.oldPassword),
        password : MD5(values.password)
    },
    (ret: any) => {
        form.resetFields();
        if(ret.success){
            message.success('改密成功');
        }else{
            message.error('改密失败');
        }
    }
    );
  };

  useEffect(() => {
  }, []);

  return (
    <DomRoot>
        <Card >
            <Row justify="center" align="top">
                <Col span={8}>
                    <Row justify="center" align="top">
                        <p style={{fontSize:"24px"}}>修改超级密码</p>
                    </Row>
                    
                    <Form
                        name="passwordForm"
                        onFinish={onFinish}
                        form={form}
                        labelCol={{
                            span: 6,
                          }}
                        wrapperCol={{
                            span: 16,
                          }}
                        >
                        <Form.Item name="oldPassword" label="用户密码" rules={[{ required: true, message: '请输入用户密码!' }]} >
                            <Input.Password placeholder="请输入用户密码..."/>
                        </Form.Item>
                        <Form.Item name="password" label="新超级密码" rules={[{ required: true, message: '请输入新超级密码!' }]}>
                            <Input.Password placeholder="请输入新超级密码..."/>
                        </Form.Item>
                        <Form.Item name="confirmPassword" label="确认超级密码" 
                            rules={[
                                { required: true, message: '确认密码不能为空!'},
                                ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('password') === value) {
                                    return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('两次密码不一致!'));
                                }
                                })
                            ]}>
                            <Input.Password placeholder="请输入确认超级密码..."/>
                        </Form.Item>
                        <Row justify="center">
                            <Button type="primary" htmlType="submit">
                                提交
                            </Button>
                        </Row>
                    </Form> 
                </Col>
            </Row> 
        </Card>
    </DomRoot>
  )
}

export default () => (
  <KeepAlive>
    <Password />
  </KeepAlive>
)
