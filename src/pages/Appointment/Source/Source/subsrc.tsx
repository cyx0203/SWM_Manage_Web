import { Ajax } from '@/components/PageRoot';
import SmartForm from "@/components/SmartForm";
import { Fragment, useEffect, useRef, useState } from "react";
import { Modal, message, Button, Popconfirm } from "antd";

export default (props) => {

  const { detailList, scheduleInfo, visible, onClose, onOk } = props;

  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 6 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 15 },
    }
  }

  const formRef = useRef(null);
  const [startOrder, setStartOrder] = useState(null); //开始号序
  const [endOrder, SetEndOrder] = useState(null); //结束号序

  const refForm = (e) => {
    formRef.current = e;
  }

  //开始号序触发
  const onChangeStartOrder = (value) => {
    setStartOrder(value);
  }

  //结束号序变化触发
  const onChangeEndOrder = (value) => {
    SetEndOrder(value);
  }
  
  useEffect(() => {
  }, []);

  const formFields = [
    {
      type: 'input',
      label: '通知门办时间',
      field: 'noticeTime',
      required: true,
      message: '请输入通知门办时间',
      placeholder: '请输入通知门办时间号...',
    }, 
    {
      type: 'input',
      label: '通知门办方式',
      field: 'noticeType',
      required: true,
      message: '请输入通知门办方式',
      placeholder: '请输入通知门办方式...',
    }, 
    {
      type: 'textarea',
      label: '停号原因',
      field: 'reason',
      required: true,
      rows: 6,
      placeholder: '请输入停号原因...',
    },
    {
      type: 'number',
      label: '停号-开始号序',
      field: 'startOrder',
      min: 1,
      required: true,
      message: '请输入停号-开始号序号序',
      placeholder: '请输入停号-开始号序...',
      onChange: onChangeStartOrder,
    },
    {
      type: 'number',
      label: '停号-结束号序',
      field: 'endOrder',
      min: 2,
      max: detailList && detailList.length || 1000,
      required: true,
      message: '请输入停号-结束号序',
      placeholder: '请请输入停号-结束号序...',
      onChange: onChangeEndOrder,
    }
  ]

  const handleSubmit = () => {
    formRef.current.getForm().validateFields()
      .then(data => {
        if (data) { //判断时间先后
          if (data.startOrder > data.endOrder) {
            message.error("请确认号序大小！");
            return;
          }
        }
        Ajax.Post('AptUrl', '/manage/src.subSource',
          {
            ...data,
            noon: scheduleInfo.noon,
            scheduleId: scheduleInfo.scheduleId,
            hospitalId: localStorage.getItem('hospitalId'),
            createUser: localStorage.getItem('account'),
          }, (ret: any) => {
            message.success('停号成功');
            formRef.current.getForm().resetFields();
            onOk();
          }
        );
      }
      ).catch(error => {
        message.error(error);
      });
  }

  //加号确认信息
  const addMessage = () => {
    return (
      <Fragment>
        请核对停号信息：<br />
        开始号序：{startOrder} <br />
        结束号序：{endOrder} <br />
      </Fragment>
    )
  }

  return (
    <Modal
      open={visible}
      title='停号'
      onOk={() => handleSubmit()}
      onCancel={onClose}
      maskClosable={false}
      footer={null}
      destroyOnClose
      confirmLoading={window.GGMIDENDPRO.GLoadingState}
    >
      <SmartForm
        formItemLayout={formItemLayout}
        ref={refForm}
        cols={1}
        formLayout="horizontal"
        fields={formFields}
      > <div />
      </SmartForm>
      <Button style={{ marginTop: 30, marginLeft: 160 }} onClick={() => { onClose() }}>取消</Button>
      <Popconfirm title={addMessage()} onConfirm={() => { handleSubmit() }}>
        <Button type="primary" style={{ marginTop: 30, marginLeft: 30 }}>停号</Button>
      </Popconfirm>
    </Modal>
  );
}