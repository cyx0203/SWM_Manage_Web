import { useRef } from "react";
import { hospType, classType, gradeType, activeType } from "./utils";
import { Ajax } from "@/core/trade";
import SmartForm from "@/components/SmartForm";
import { Modal, message } from "antd";

export default (props) => {
  const { visible, row, onClose, onOk, level,branchTree} = props;
  const record = row?.level == level ? row : null

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

  const getBranchTree = (params) => {
    return params?.map((item) => ({
      ...item,
      disabled: item.children?.length > 0 ? true : false,
      children: item.children ? getBranchTree(item.children) : []
    }));

  }

  const getFormFields = () => {
    const formFields: any = [ {
      type: 'input',
      label: '医院编号',
      field: 'id',
      required: true,
      message: '请输入医院编号',
      placeholder: `请输入医院编号...`,
      initialValue: record?.id ?? '',
      disabled: record?true:false
    },
    {
      type: 'input',
      label: '医院名称',
      field: 'name',
      required: true,
      message: '请输入医院名称',
      placeholder: `请输入医院名称...`,
      initialValue: record?.name ?? '',
    }];
    if (level === "1") {
      formFields.push({
        type: 'select',
        label: '医院类别',
        field: 'type',
        message: '请选择医院类别',
        placeholder: '请选择医院类别...',
        options: hospType(),
        initialValue: record?.type ??'',
        
      });
      formFields.push({
        type: 'select',
        label: '医院级别',
        field: 'class',
        message: '请选择医院级别',
        placeholder: '请选择医院级别...',
        options: classType(),
        initialValue: record?.class ??'',
        
      });
      formFields.push({
        type: 'select',
        label: '医院等级',
        field: 'grade',
        message: '请选择医院等级',
        placeholder: '请选择医院等级...',
        options: gradeType(),
        initialValue: record?.grade ??''
      });
    }
    formFields.push({
      type: 'input',
      label: '联系方式',
      field: 'phone',
      message: '请输入联系方式',
      placeholder: '请输入联系方式...',
      initialValue: record?.phone ??'',
      
    });
    formFields.push({
      type: 'input',
      label: '医院地址',
      field: 'address',
      message: '请输入地址',
      placeholder: '请输入地址...',
      initialValue: record?.address ??'',
    });

    
    formFields.push({
      type: 'treeselect',
      label: '所属区域机构',
      field: 'branchId',
      message: '请选择区域机构',
      required: true,
      placeholder: '请选择区域机构...',
      treeData: getBranchTree(branchTree),
      initialValue: record?.branchId ?? ''
    });
    

    formFields.push({
      type: 'select',
      label: '是否启用',
      field: 'active',
      message: '请选择启用状态',
      placeholder: '请选择启用状态...',
      options: activeType(),
      initialValue: record?.active ??''
    });
    formFields.push({
      type: 'input',
      label: '加密KEY',
      field: 'md5Key',
      message: '请输入加密KEY',
      placeholder: '请输入加密KEY...',
      initialValue: record?.md5Key ??''
    });
    return formFields;

  }
 

  const handleSubmit = () => {
    formRef.current.getForm().validateFields()
      .then(data => {
        let url;
        let param;
        if (record) {  //edit
          url = '/manage/hospital.updateById';
          param = {
            ...data,
            id: record && record.id,
          }
        }
        else { //add

          url = '/manage/hospital.insert';
          if (level === "2") {
            param = {
              type: row.type,
              class: row.class,
              grade: row.grade,
              parId: row.id,
              level: "2",
              ...data,
            };
          } else {
            param = {
              level: "1",
              parId: "##",
              ...data,
            };
          }
          
        }

       
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
      title='医院信息编辑'
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
        fields={getFormFields()}
      > <div />
      </SmartForm>
    </Modal>
  );



}