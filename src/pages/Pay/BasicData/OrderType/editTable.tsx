import React, { useEffect } from 'react';
import { Button, Form, Input } from 'antd';

export type RoleCreateProps = {
  form: any;
  onFinish: any;
  disabled: boolean;
};

const EditTable: React.FC<RoleCreateProps> = props => {
  useEffect(() => {}, []);

  return (
    <Form
      form={props.form}
      name="pay_goods"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      style={{ maxWidth: 600 }}
      initialValues={{ remember: true }}
      onFinish={props.onFinish}
      autoComplete="off"
    >
      <Form.Item label="代码" name="id" rules={[{ required: true, message: '请输入!' }]}>
        <Input disabled={props.disabled} placeholder={'请输入'} />
      </Form.Item>

      <Form.Item label="名称" name="name" rules={[{ required: true, message: '请输入!' }]}>
        <Input placeholder={'请输入'} />
      </Form.Item>

      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button type="primary" htmlType="submit">
          确认
        </Button>
      </Form.Item>
    </Form>
  );
};
export default EditTable;
