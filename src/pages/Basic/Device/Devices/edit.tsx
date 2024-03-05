import { Modal,message } from "antd";
import SmartForm from "@/components/SmartForm";
import { useEffect, useRef, useState } from "react";
import moment from "moment";
import { Ajax } from "@/core/trade";

export default (props) => {

  const { visible, record, onClose, onOk, branchTree,hospitalId} = props;
  const [devModels, setDevModels] = useState(null);
  const [devTypes, setDevTypes] = useState(null);

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

  const queryDevType = () => {
    console.log(hospitalId)
    Ajax.Post('BasicUrl', '/manage/devType.selectAllModels',
      {
      },
      (ret: any) => {
        setDevTypes(ret.list);
      }
    );
  }

  useEffect(() => {
    queryDevType();
  }, []);
  
  const typeSelectChange = (value) => {
    devTypes.forEach((dev) => {
      if (dev.value === value) {
        setDevModels(dev.models);
      }
    });
  }

  const formFields = [{
    type: 'input',
    label: '设备编号',
    field: 'id',
    required: true,
    message: '请输入设备编号',
    placeholder: `请输入设备编号...`,
    initialValue: record?.id ?? '',
    disabled:record?true:false
  }, {
    type: 'select',
    label: '设备类型',
    field: 'typeId',
    required: true,
    message: '请选择设备类型',
    placeholder: '请选择设备类型...',
    options: devTypes,
    onChange: typeSelectChange,
    initialValue: record?.typeId ??'',
  }, {
    type: 'select',
    label: '设备型号',
    field: 'model',
    required: true,
    message: '请选择设备型号',
    placeholder: '请选择设备型号...',
    options: devModels,
    initialValue: record?.model??'',
  }, {
    type: 'treeselect',
    label: '归属区域',
    field: 'hospBranchId',
    message: '请选择归属区域',
    required: true,
    placeholder: '请选择归属区域...',
    treeData: branchTree,
    initialValue: record?.hospBranchId??'',
  }, {
    type: 'input',
    label: '安装地点',
    field: 'instAddr',
    message: '请输入安装地点',
    placeholder: '请输入安装地点...',
    initialValue: record?.instAddr??'',
  }, {
    type: 'input',
    label: 'IP地址',
    field: 'ip',
    message: '请输入IP地址',
    placeholder: '请输入IP地址...',
    initialValue: record?.ip??'',
  }, {
    type: 'input',
    label: '设备序列号',
    field: 'code',
    message: '请输入设备序列号',
    placeholder: '请输入设备序列号...',
    initialValue: record?.code??'',
  }, {
    type: 'time-picker',
    label: '营业开始时间',
    field: 'work1',
    format: 'HH:mm',
    initialValue: moment(record?.work1??'0700', "HH:mm"),
  }, {
    type: 'time-picker',
    label: '营业结束时间',
    field: 'work2',
    format: 'HH:mm',
    initialValue: moment(record?.work2??'1800', "HH:mm"),
  }];

  const handleSubmit = () => {
    formRef.current.getForm().validateFields()
      .then(data => {
        let url;
        let param;
        if (record) {  //edit
          url = '/manage/dev.update';
          param = {
            ...data,
            oid: record && record.id,
          }
        }
        else { //add
          url = '/manage/dev.insert';
          param = {
            ...data,
          }
        }

        param.hospitalId = hospitalId;
        console.log(hospitalId)
        param.work1 = data.work1.format('HHmm');
        param.work2 = data.work2.format('HHmm');
        Ajax.Post('BasicUrl', url, param
          , (ret: any) => {
            message.success('操作成功');
            formRef.current.getForm().resetFields();
            onOk();
          }
        );
      }
      ).catch(error => {
      });
  }


  return (
    <Modal
      visible={visible}
      title='设备编辑'
      onOk={() => handleSubmit()}
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
