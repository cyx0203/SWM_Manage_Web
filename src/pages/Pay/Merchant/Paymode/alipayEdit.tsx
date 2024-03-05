import { useEffect, useRef } from "react";
import { Button, Col, message, Popconfirm, Row, } from "antd";
import { Ajax } from "@/core/trade";
import SmartForm from "@/components/SmartForm";

export default (props) => {
  const {
    record,
    onSuccess,
    merchantId
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

  useEffect(() => {
    formRef.current.getForm().setFieldsValue({ ...record[0] });
  }, []);

  const getFields = () => {
    return [
      {
        type: 'input',
        field: 'appId',
        label: 'appId',
        required: true,
        placeholder: '请输入appId...',
      },
      {
        type: 'input',
        field: 'thirdMerchantId',
        label: '第三方商户号',
        placeholder: '请输入第三方商户号...',
      },
      {
        type: 'textarea',
        field: 'appPublicKey',
        label: '支付宝应用公钥',
        placeholder: '请输入支付宝应用公钥...',
      },
      {
        type: 'textarea',
        field: 'appPrivateKey',
        label: '支付宝应用私钥',
        placeholder: '请输入支付宝应用私钥...',
      },
      {
        type: 'textarea',
        field: 'publicKey',
        label: '支付宝公钥',
        placeholder: '请输入支付宝公钥...',
      },
      {
        type: 'select',
        field: 'signType',
        label: '支付宝签名算法',
        placeholder: '请选择签名算法...',
        options: [{
          txt: "RSA",
          value: "RSA"
        }, {
          txt: "RSA2",
          value: "RSA2"
        }]
      },
    ]
  }

  const refForm = (e) => {
    formRef.current = e;
  }

  const handleSubmit = () => {
    formRef.current.getForm().validateFields().then(values => {
      if (record.length > 0) {
        //进行修改
        Ajax.Post('PayUrl', '/manage/merParamAlipay.update',
          {
            merchantId: merchantId,
            appId: values.appId,
            thirdMerchantId: values.thirdMerchantId,
            appPublicKey: values.appPublicKey,
            appPrivateKey: values.appPrivateKey,
            publicKey: values.publicKey,
            signType: values.signType
          },
          (ret: any) => {
            if (ret.success) {
              message.success('修改成功');
            } else {
              message.error('修改失败');
            }
            onSuccess();
          }
        );
      } else {
        //进行新增
        Ajax.Post('PayUrl', '/manage/merParamAlipay.insert',
          {
            merchantId: merchantId,
            appId: values.appId,
            thirdMerchantId: values.thirdMerchantId,
            appPublicKey: values.appPublicKey,
            appPrivateKey: values.appPrivateKey,
            publicKey: values.publicKey,
            signType: values.signType
          },
          (ret: any) => {
            if (ret.success) {
              message.success('新增成功');
            } else {
              message.error('新增失败');
            }
            onSuccess();
          }
        );
      }
    }).catch(error => {
    });

  }

  const deleteById = (value) => {
    //进行删除
    Ajax.Post('PayUrl', '/manage/merParamAlipay.delete',
      {
        merchantId: value,
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
        <Col span={2} offset={5}>
          <Popconfirm title="确认删除吗?" onConfirm={() => { deleteById(merchantId); }}>
            <Button>删除参数</Button>
          </Popconfirm>
        </Col>
        <Col span={2} offset={9}>
          <Button type="primary" htmlType="submit">提交</Button>
        </Col>
      </Row>
    </SmartForm>
  )

}