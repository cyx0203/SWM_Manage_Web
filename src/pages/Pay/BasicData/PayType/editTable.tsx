import React, { useEffect } from 'react';
import { Button, Form, Input, Select } from 'antd';

export type RoleCreateProps = {
  form: any;
  onFinish: any;
  disabled: boolean;
  option: any[];
};

const EditTable: React.FC<RoleCreateProps> = props => {
  useEffect(() => {}, []);

  return (
    <Form
      form={props.form}
      name="pay_type"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      style={{ maxWidth: 600 }}
      initialValues={{ remember: true }}
      onFinish={props.onFinish}
      autoComplete="off"
    >
      <Form.Item label="方式代码" name="id" rules={[{ required: true, message: '请输入!' }]}>
        <Input disabled={props.disabled} placeholder={'请输入'} />
      </Form.Item>

      <Form.Item label="方式名称" name="name" rules={[{ required: true, message: '请输入!' }]}>
        <Input placeholder={'请输入'} />
      </Form.Item>

      <Form.Item label="第三方" name="thirdId" rules={[{ required: true, message: '请选择!' }]}>
        <Select
          defaultValue={props.option[0] ? props.option[0].label : null}
          style={{ width: 120 }}
          placeholder={'请选择'}
          options={props.option}
        />
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
