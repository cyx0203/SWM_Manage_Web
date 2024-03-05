import { Ajax } from '@/components/PageRoot';
import SmartForm from "@/components/SmartForm";
import { useEffect, useRef, useState } from "react";
import { Modal, message } from "antd";
import AddGuardian from './addGuardian';

export default (props) => {

  const { visible, record, regionInfoList, guardianInfo, onClose, onOk } = props;

  const [addGuardianVisible, setAddGuardianVisible] = useState(false);
  const formItemLayout = {
    labelCol: {
      xs: { span: 48 },
      sm: { span: 48 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 24 },
    }
  }

  const formRef = useRef(null);

  const refForm = (e) => {
    formRef.current = e;
  }


  useEffect(() => {
  }, []);

  const formFields = [
    {
      type: 'input',
      label: '姓名',
      field: 'patient_name',
      required: true,
      message: '请输入患者姓名',
      placeholder: '请输入患者姓名...',
      initialValue: record ? record.patient_name : '',
    },
    {
      type: 'input',
      label: '身份证号',
      field: 'idno',
      required: true,
      message: '请输入患者身份证号',
      placeholder: '请输入患者身份证号...',
      initialValue: record ? record.idno : '',
    },
    {
      type: 'select',
      label: '性别',
      field: 'patient_sex',
      required: true,
      message: '性别',
      placeholder: '请选择性别...',
      options: JSON.parse(localStorage.getItem("codeKV")).XB,
      initialValue: record ? record.patient_sex : ''
    },
    {
      type: 'input',
      label: '生日',
      field: 'birth',
      required: true,
      message: '请输入患者生日',
      placeholder: '请输入患者生日...',
      initialValue: record ? record.birthDay : '',
    }, {
      type: 'cascader',
      label: '家庭地址-省市区',
      field: 'address',
      placeholder: record ? ((record.provincename ? record.provincename : '空') + "/" + (record.cityname ? record.cityname : '空') + "/" + (record.areaname ? record.areaname : '空')) : '请选择地址',
      options: regionInfoList,
      initialValue: record ? [record.province, record.city, record.area] : [],
    },
    {
      type: 'input',
      label: '家庭地址-详细地址',
      field: 'full_addr',
      message: '请输入家庭详细地址',
      placeholder: '请输入家庭详细地址...',
      initialValue: record ? record.full_addr : '',
    },
    {
      type: 'input',
      label: '联系电话',
      field: 'phone',
      required: true,
      message: '请输入联系电话',
      placeholder: '请输入联系电话...',
      initialValue: record ? record.phone : '',
    },
    {
      type: 'select',
      label: '婚姻状况',
      field: 'marriage',
      required: true,
      message: '婚姻状况',
      placeholder: '请选择婚姻状况...',
      options: JSON.parse(localStorage.getItem("codeKV")).HY,
      initialValue: record ? record.marriage : ''
    },
    {
      type: 'select',
      label: '血型',
      required: true,
      field: 'blood',
      message: '血型',
      placeholder: '请选择血型...',
      options: JSON.parse(localStorage.getItem("codeKV")).XX,
      initialValue: record ? record.blood : ''
    },
    {
      type: 'select',
      label: '联系人1-关系',
      field: 'relation1',
      allowClear: true,
      //required: true,
      message: '请选择关系',
      placeholder: '请选择关系...',
      options: JSON.parse(localStorage.getItem("codeKV")).GX,
      initialValue: guardianInfo ? guardianInfo.relation1 : '',
    },
    {
      type: 'input',
      label: '联系人1-姓名',
      field: 'name1',
      //required: true,
      message: '请输入联系人姓名',
      placeholder: '请输入联系人姓名',
      initialValue: guardianInfo ? guardianInfo.name1 : '',
    },
    {
      type: 'input',
      label: '联系人1-联系电话',
      field: 'phone1',
      //required: true,
      message: '请输入联系人电话',
      placeholder: '请输入联系人电话...',
      initialValue: guardianInfo ? guardianInfo.phone1 : '',
    },
    {
      type: 'select',
      label: '联系人2-关系',
      field: 'relation2',
      allowClear: true,
      //required: true,
      message: '请选择关系',
      placeholder: '请选择关系...',
      options: JSON.parse(localStorage.getItem("codeKV")).GX,
      initialValue: guardianInfo ? guardianInfo.relation2 : '',
    },
    {
      type: 'input',
      label: '联系人2-姓名',
      field: 'name2',
      //required: true,
      message: '请输入联系人姓名',
      placeholder: '请输入联系人姓名',
      initialValue: guardianInfo ? guardianInfo.name2 : '',
    },
    {
      type: 'input',
      label: '联系人2-联系电话',
      field: 'phone2',
      //required: true,
      message: '请输入联系人电话',
      placeholder: '请输入联系人电话...',
      initialValue: guardianInfo ? guardianInfo.phone2 : '',
    },
    {
      type: 'select',
      label: '联系人3-关系',
      field: 'relation3',
      allowClear: true,
      //required: true,
      message: '请选择关系',
      placeholder: '请选择关系...',
      options: JSON.parse(localStorage.getItem("codeKV")).GX,
      initialValue: guardianInfo ? guardianInfo.relation3 : '',
    },
    {
      type: 'input',
      label: '联系人3-姓名',
      field: 'name3',
      //required: true,
      message: '请输入联系人姓名',
      placeholder: '请输入联系人姓名',
      initialValue: guardianInfo ? guardianInfo.name3 : '',
    },
    {
      type: 'input',
      label: '联系人3-联系电话',
      field: 'phone3',
      //required: true,
      message: '请输入联系人电话',
      placeholder: '请输入联系人电话...',
      initialValue: guardianInfo ? guardianInfo.phone3 : '',
    },

  ]

  const handleSubmit = () => {
    formRef.current.getForm().validateFields()
      .then(data => {
        if ((data.name1 || data.phone1) && !data.relation1) {
          message.error('联系人1关系必须选择，请检查');
          return;
        }
        if ((data.name2 || data.phone2) && !data.relation2) {
          message.error('联系人2关系必须选择，请检查');
          return;
        }
        if ((data.name3 || data.phone3) && !data.relation3) {
          message.error('联系人3关系必须选择，请检查');
          return;
        }
        if ((data.relation1 == data.relation2 && data.relation1) || (data.relation1 == data.relation3 && data.relation1) || (data.relation2 == data.relation3 && data.relation2)) {
          message.error('同一监护人关系只能选择一个，请检查');
          return;
        }
        if (data.relation1 && !(data.name1 && data.phone1)) {
          message.error('联系人1姓名电话请检查，请检查');
          return;
        }
        if (data.relation2 && !(data.name2 && data.phone2)) {
          message.error('联系人2姓名电话请检查，请检查');
          return;
        }
        if (data.relation3 && !(data.name3 && data.phone3)) {
          message.error('联系人3姓名电话请检查，请检查');
          return;
        }

        Ajax.Post('IdentityUrl', '/identity/idnPatientInfo.edit',
          {
            ...data,
            id: record && record.id,
          }
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

  //查询联系人信息
  const queryGuardian = (row) => {
    Ajax.Post('IdentityUrl', '/manage/idnGuardian.selectById',
      {
        id: row.id
      },
      (ret: any) => {
        console.log('ret', ret);
        //setGuardianList(ret.list);
      }
    );
  }

  return (

    <Modal
      open={visible}
      title='患者信息编辑'
      onOk={() => handleSubmit()}
      onCancel={onClose}
      maskClosable={false}
      okText="提交"
      cancelText="取消"
      destroyOnClose={true}
      width={1000}
    >
      <SmartForm
        formItemLayout={formItemLayout}
        ref={refForm}
        cols={3}
        formLayout="inline"
        fields={formFields}
      > <div />
      </SmartForm>
      {/* <Button type="dashed" onClick={() => { setAddGuardianVisible(true); }} block icon={<PlusOutlined />}>
          添加联系人
        </Button> */}
      {/* 编辑弹出框 */}
      <AddGuardian
        visible={addGuardianVisible}
        record={record}
        onClose={() => { onClose(); setAddGuardianVisible(false); }}
        onOk={() => {
          onClose();
          setAddGuardianVisible(false);
          queryGuardian(record);
        }}
      />
    </Modal>
  );
}