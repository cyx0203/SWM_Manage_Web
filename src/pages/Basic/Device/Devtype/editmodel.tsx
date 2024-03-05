import { Ajax } from '@/components/PageRoot';
import SmartForm from "@/components/SmartForm";
import { useEffect, useState, useRef } from "react";
import { Modal, message, } from "antd";

export default (props) => {

  const { visible, modelInfo, devTypeId, onClose, onOk } = props;
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

  const [factoryList, setfactoryList] = useState(null);
  const [facId, setFacId] = useState("");

  const getFactorys = (keywords) => {
    const factoryKV = [];
    Ajax.Post('BasicUrl', '/manage/devFty.selectAll',
      {
        ...keywords,
      },
      (ret: any) => {
        ret.list.forEach(element => {
          factoryKV.push({
            value: element.id,
            text: element.name,
          })
        });
        setfactoryList(factoryKV)
      }
    );
  }

  const handleChange = (value: { value: string; label: React.ReactNode }) => {
    setFacId(value.value);
  };

  const formRef = useRef(null);

  const refForm = (e) => {
    formRef.current = e;
  }

  const handleSubmit = (data) => {
    let url;
    let param;
    if (modelInfo) {  //edit
      url = '/manage/devModel.update';
      param = {
        ...data,
        oModel: modelInfo && modelInfo.model,
        typeId: modelInfo && modelInfo.type_id,
        facId: facId
      }
    }
    else { //add
      url = '/manage/devModel.insert';
      param = {
        ...data,
        facId: facId,
        typeId: devTypeId
      }
    }

    formRef.current.getForm().validateFields()
      .then(ret => {
        console.log("ret:" + JSON.stringify(ret));
        Ajax.Post('BasicUrl', url, param, (res: any) => {
          message.success('操作成功');
          formRef.current.getForm().resetFields();
          onOk();
        }
        );
      }
      ).catch(error => {
      });
  }

  useEffect(() => {
    getFactorys({
    });
  }, []);

  const formFields = [{
    type: 'input',
    label: '型号',
    field: 'model',
    required: true,
    message: '请输入型号',
    placeholder: '请输入型号...',
    initialValue: modelInfo ? modelInfo.model : ''
  }, {
    type: 'input',
    label: '品牌',
    field: 'mark',
    required: true,
    message: '请输入品牌',
    placeholder: '请输入品牌...',
    initialValue: modelInfo ? modelInfo.mark : ''
  }, {
    type: 'select',
    label: '厂商',
    field: 'fac_id',
    required: true,
    message: '请选择厂商',
    placeholder: '请选择厂商...',
    labelInValue: true,
    onChange: handleChange,
    options: factoryList,
    initialValue: modelInfo ? modelInfo.fac_id : ''
  }]

  return (
    <Modal
      visible={visible}
      title='设备型号编辑'
      onOk={() => handleSubmit(formRef.current.getForm().getFieldsValue())}
      onCancel={onClose}
      okText="提交"
      cancelText="取消"
      destroyOnClose
    >
      <SmartForm
        formItemLayout={formItemLayout}
        ref={refForm}
        cols={1}
        formLayout="horizontal"
        fields={formFields}
      > <div />
      </SmartForm>
    </Modal>
  );
}