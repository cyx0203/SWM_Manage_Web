import { useEffect, useRef, useState } from "react";
import { Button, Col, message, Row, } from "antd";
import { Ajax } from "@/core/trade";
import SmartForm from "@/components/SmartForm";
import moment from "moment";

export default (props) => {
  const {
    record,
    onSuccess,
    dataSource
  } = props;

  const [instList, setInstList] = useState([]); //收单机构的数据

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

  //查询收单机构
  const queryInst = () => {
    Ajax.Post('PayUrl', '/manage/merInstitution.selectAll',
      {
      },
      (ret: any) => {
        const newList = ret.list.map((item) => {
          return {
            txt: item.name,
            value: item.id
          }
        })
        setInstList(newList);
      });
  }

  useEffect(() => {
    formRef.current.getForm().setFieldsValue({ ...record,instName :record.instId });
    queryInst();
  }, []);

  const getFields = () => {
    return [
      {
        type: 'input',
        field: 'merchantId',
        label: '商户编号',
        required: true,
        placeholder: '请输入商户编号...',
      },
      {
        type: 'input',
        field: 'merchantName',
        label: '商户名称',
        required: true,
        placeholder: '请输入商户名称...',
      },
      {
        type: 'select',
        field: 'instName',
        label: '收单机构名称',
        required: true,
        options: instList
      },
      {
        type: 'switch',
        field: 'active',
        label: '开通状态',
        defaultChecked: record.active == 1 ? true : false
      },
    ]
  }

  const refForm = (e) => {
    formRef.current = e;
  }

  const handleSubmit = (keywords) => {
    formRef.current.getForm().validateFields()
      .then(values => {
        let flag = true; //判断重复记录
        if (JSON.stringify(record) == '{}') {
          dataSource.forEach(element => {
            if (values.merchantId == element.merchantId) {
              flag = false;
            }
          });
          if (flag) {
            //新增
            Ajax.Post('PayUrl', '/manage/merMerchant.insert',
              {
                merchantId: values.merchantId,
                merchantName: values.merchantName,
                instId: values.instName,
                active: values.active ? '1' : '0',
                createUser: localStorage.account,
                createTime: moment().format("YYYY-MM-DD HH:mm:ss")
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
          } else {
            message.error('已有重复记录,新增失败!');
            onSuccess();
          }
        } else {
          //更新
          Ajax.Post('PayUrl', '/manage/merMerchant.update',
            {
              odlMerchantId: record.merchantId,
              merchantId: values.merchantId,
              instId: values.instName,
              merchantName: values.merchantName,
              active: values.active ? '1' : '0'
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
        <Col span={2} offset={5}>
          <Button type="primary" htmlType="submit">提交</Button>
        </Col>
      </Row>
    </SmartForm>
  )

}