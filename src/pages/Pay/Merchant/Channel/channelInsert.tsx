import { useEffect, useRef, useState } from "react";
import { Button, Col, message, Row, } from "antd";
import { Ajax } from "@/core/trade";
import SmartForm from "@/components/SmartForm";
import moment from "moment";

export default (props) => {
  const {
    record,
    onSuccess,
    dataSource,
    hospitalArray
  } = props;

  const [hospitals, setHospitals] = useState([]); //批量插入子表

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
    formRef.current.getForm().setFieldsValue({ ...record });
    const hospitals = [];
    hospitalArray.forEach((item) => {
      hospitals.push(item.id);
    })
    setHospitals(hospitals);
  }, []);

  const getFields = () => {
    return [
      {
        type: 'input',
        field: 'channelId',
        label: '渠道编号',
        required: true,
        placeholder: '请输入渠道编号...',
        disabled: JSON.stringify(record) != '{}'
      },
      {
        type: 'input',
        field: 'channelName',
        label: '渠道名称',
        required: true,
        placeholder: '请输入渠道名称...',
      },
      {
        type: 'input',
        field: 'app',
        label: '应用名称',
        required: true,
        placeholder: '请输入应用名称...',
      },
      {
        type: 'input',
        field: 'company',
        label: '企业名称',
        placeholder: '请输入企业名称...',
      },
      {
        type: 'input',
        field: 'desc',
        label: '渠道介绍',
        placeholder: '请输入渠道介绍...',
      },
      {
        type: 'input',
        field: 'accessToken',
        label: '授权码',
        placeholder: '请输入授权码...',
      },
      {
        type: 'switch',
        field: 'checkSkin',
        label: '验签',
        required: true,
        defaultChecked: record.checkSkin == '1' ? true : false
      },
      {
        type: 'switch',
        field: 'active',
        label: '激活',
        defaultChecked: record.active == '1' ? true : false
      }
    ]
  }

  const refForm = (e) => {
    formRef.current = e;
  }

  const handleSubmit = () => {
    formRef.current.getForm().validateFields()
      .then(values => {
        let flag = true; //判断重复记录
        dataSource.forEach(element => {
          if(values.channelId == element.channelId){
            flag=false;
          }
        });
        if (flag) {
          //新增
          Ajax.Post('PayUrl', '/manage/merPlatChannel.insert',
            {
              id: values.channelId,
              name: values.channelName,
              app: values.app,
              company: values.company,
              desc: values.desc,
              accessToken: values.accessToken,
              checkSkin: values.checkSkin ? '1' : '0',
              active: values.active ? '1' : '0',
              createUser: localStorage.account,
              createTime: moment().format("YYYY-MM-DD HH:mm:ss")
            },
            (ret: any) => {
              if (ret.success) {
                const temp = [];
                hospitals.forEach(item =>{
                  temp.push({
                    channelId: values.channelId,
                    hospitalId: item,
                    active: '0',
                    createTime: moment().format("YYYY-MM-DD HH:mm:ss")
                  })
                })
                //子表新增
                Ajax.Post('PayUrl', '/manage/merPlatChannelHospital.insertBatch',
                  {
                    hospitals : temp
                  },
                  (ret1: any) => {
                    if (ret1.success) {
                      message.success('新增成功');
                    } else {
                      message.error('新增失败');
                    }
                    onSuccess();
                  })
              } else {
                message.error('新增失败');
                onSuccess();
              }
            }
          );
        } else {
          if(JSON.stringify(record) == '{}'){
            message.error('已有重复记录,新增失败!');
            onSuccess();
          }else{
            Ajax.Post('PayUrl', '/manage/merPlatChannel.update',
            {
              id: record.channelId,
              name: values.channelName,
              app: values.app,
              company: values.company,
              desc: values.desc,
              accessToken: values.accessToken,
              checkSkin: (values.checkSkin && values.checkSkin != '0') ? '1' : '0',
              active: (values.active  && values.active != '0') ? '1' : '0'
            },
            (ret: any) => {
              if(ret.success){
                message.success('修改成功');
              }else{
                message.error('修改失败');
              }
              onSuccess();
            })
          }
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