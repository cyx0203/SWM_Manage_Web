import { useEffect} from "react";
import { Button, Col, Form, Input, message,  Popconfirm, Row, Select, Space, } from "antd";
import { Ajax } from "@/core/trade";
import { MinusCircleOutlined, PlusCircleOutlined} from "@ant-design/icons";

export default (props) => {
  const {
    record,
    onSuccess,
    merchantId
  } = props;


  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue({ ...record[0] })
  }, []);

  const deleteById = () => {
    // //删除
    Ajax.Post('PayUrl', '/manage/WxParam.delete',
      {
        merchantId
      },
      (ret: any) => {
        if (ret.success) {
          message.success('删除成功');
        } else {
          message.error('删除失败');
        }
        onSuccess();
      }
    );
  }

  const onFinish = () => {
    form.validateFields().then(values => {
      //如果是普通模式，wechatSub为undefined，将其置为[]
      if (!values.wechatSub) {
        values.wechatSub = [];
      }
      //wechatSub中新增serviceMerchantId，用于后端
      const newList = values.wechatSub.map(item => {
        return {
          ...item,
          serviceMerchantId: merchantId
        }
      })
      values.wechatSub = newList;

      //修改操作
      if (record.length > 0) {

        Ajax.Post('PayUrl', '/manage/WxParam.update',
          {
            merchantId,
            appId: values.appId,
            appSecret: values.appSecret,
            payKey: values.payKey,
            cert: values.cert,
            type: values.wechatSub.length > 0 ? '2' : '1',
            wechatSub: values.wechatSub
          },
          (ret: any) => {
            if (ret.success) {
              message.success('更新成功');
            } else {
              message.error('更新失败');
            }
            onSuccess();
          })

      } else {
        Ajax.Post('PayUrl', '/manage/WxParam.insert',
          {
            merchantId,
            appId: values.appId,
            appSecret: values.appSecret,
            payKey: values.payKey,
            cert: values.cert,
            type: values.wechatSub.length > 0 ? '2' : '1',
            wechatSub: values.wechatSub
          },
          (ret: any) => {
            if (ret.success) {
              message.success('新增成功');
            } else {
              message.error('新增失败');
            }
            onSuccess();
          })
      }
    })

  }

  //清空子商户
  const removeAll = (fields, remove) => {
    const array = [];
    for (let i = 0; i < fields.length; i++) {
      array.push(fields[i].name);
    }
    remove(array);
  }


  return (
    <Form
      labelCol={{ span: 6 }}
      wrapperCol={{ span: 14 }}
      onFinish={onFinish}
      form={form}
    >
      <Form.Item name="appId" label="appId" rules={[{ required: true, message: '请输入appId' }]}>
        <Input placeholder="请输入appId..." />
      </Form.Item>
      <Form.Item name="appSecret" label="appSecret">
        <Input placeholder="请输入appSecret..." />
      </Form.Item>
      <Form.Item name="payKey" label="微信支付秘钥">
        <Input placeholder="请输入微信支付秘钥..." />
      </Form.Item>
      <Form.Item name="cert" label="微信p12证书">
        <Input.TextArea placeholder="请输入微信p12证书..." />
      </Form.Item>


      <Form.List name="wechatSub">
        {(fields, { add, remove }) => (
          <>
            <Form.Item label="模式">
              <Select
                defaultValue={record[0] && record[0].type == '2' ? '2' : '1'}
                options={[
                  { value: '1', label: '普通模式' },
                  { value: '2', label: '服务商模式' },
                ]}
                onChange={(values) => { return values == '2' ? add() : removeAll(fields, remove) }}
              />
            </Form.Item>

            {fields.map(({ key, name, ...restField }) => (

              <Space key={key} style={{ display: 'flex' }} align="baseline">
                <Form.Item
                  {...restField}
                  name={[name, 'subMerchantId']}
                  label="子商户号"
                  rules={[{ required: true, message: '请输入子商户号' }]}
                  labelCol={{ span: 10 }}
                  wrapperCol={{ span: 18 }}
                >
                  <Input placeholder="请输入子商户号..." />
                </Form.Item>
                <Form.Item
                  {...restField}
                  name={[name, 'subAppId']}
                  label="公众号appId"
                  labelCol={{ span: 8 }}
                  wrapperCol={{ span: 18 }}
                >
                  <Input placeholder="请输入公众号appId..." />
                </Form.Item>
                <MinusCircleOutlined onClick={() => remove(name)} />
                <PlusCircleOutlined onClick={() => add()} />
              </Space>
            ))}
          </>
        )}
      </Form.List>

      <Row gutter={16}>
        <Col span={2} offset={6}>
          <Popconfirm title="确认删除吗?" onConfirm={() => { deleteById(); }}>
            <Button>删除参数</Button>
          </Popconfirm>
        </Col>
        <Col span={2} offset={9}>
          <Button type="primary" htmlType="submit">提交</Button>
        </Col>
      </Row>

    </Form>


  )

}