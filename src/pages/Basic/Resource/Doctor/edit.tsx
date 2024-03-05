import { useState, useEffect, useRef } from 'react';
import { Ajax } from '@/components/PageRoot';
import { message, Modal } from "antd";
import SmartForm from "@/components/SmartForm";


export default (props: any) => {

  const { visible, docInfo, editMode, onClose, onOk, hospitalId } = props;

  const [deptKV, setDeptKV] = useState([]);
  const [doctorTitleKV, setDoctorTitleKV] = useState([]);
  const Domain: any = window.GGMIDENDPRO_EXT_CFG.Domain;
  const formRef = useRef(null);

  const refForm = (e: any) => {
    formRef.current = e;
  }

  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 5 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 17 },
    }
  };

  let fileName = '';
  let fileSize = '';
  let fileSeqNo = '';

  /**
   * 查询科室编码-名称键值对
   */
  const queryDept = () => {
    Ajax.Post('BasicUrl', '/manage/comDept.selectByHosId',
      {
        hospitalId: hospitalId,
        level: '1',
      },
      (ret: any) => {
        const { list } = ret;
        const arr = [];
        console.log("list=", list);
        if (list && list.length > 0) {
          list.forEach(item => {
            arr.push({
              value: item.id,
              txt: item.name,
            })
          })
          setDeptKV(arr);
        }
      }
    );
  }

  /**
 * 查询医生职称编码-名称键值对
 */
  const queryDoctorLevel = () => {
    Ajax.Post('BasicUrl', '/manage/comDoctorTitle.selectByHosId',
      {
        hospitalId: hospitalId,
      },
      (ret: any) => {
        const { list } = ret;
        console.log("list=", list);
        if (list && list.length > 0) {
          setDoctorTitleKV(list)
        }
      }
    );
  }

  useEffect(() => {
    queryDept();
    queryDoctorLevel();
  }, []);

  const getFile = (e: any) => {
    if (Array.isArray(e)) return e;
    if (e.fileList.length > 0 && e.fileList[0].status === 'done') {
      fileName = e.fileList[0].name;
      fileSize = e.fileList[0].size;
      fileSeqNo = e.fileList[0].response.name;
    }
    return e && e.fileList;
  };

  const getFields = () => {
    const deptIdList = [];
    if (editMode) {
      console.log("docInfo=", docInfo)
      if (docInfo.deptId.indexOf(",") > -1) {
        const deptChar = docInfo.deptId.split(",");
        deptChar.forEach((item) => {
          deptIdList.push(item)
        })
      }
      else {
        // deptIdList = docInfo.deptId;
        deptIdList.push(docInfo.deptId)
      }
      console.log("deptIdList=", deptIdList)
    }

    const arr = [
      // {
      //   type: 'select',
      //   label: '所属科室',
      //   field: 'deptList',
      //   required: true,
      //   message: '选择科室',
      //   placeholder: '请选择科室...',
      //   mode: 'multiple',
      //   options: deptKV,
      //   initialValue: editMode ? deptIdList : ''
      // },
      {
        type: 'input',
        label: '医生编号',
        field: 'id',
        required: true,
        message: '请输入医生编号',
        placeholder: '请输入医生编号...',
        initialValue: editMode ? docInfo.id : ''
      },
      {
        type: 'input',
        label: '医生姓名',
        field: 'name',
        required: true,
        message: '请输入医生姓名',
        placeholder: '请输入医生姓名...',
        initialValue: editMode ? docInfo.name : ''
      },
      {
        type: 'select',
        label: '医生级别',
        field: 'titleId',
        required: true,
        message: '医生级别',
        placeholder: '请选择医生级别...',
        // options: JSON.parse(localStorage.getItem("codeKV")).DL,
        options: doctorTitleKV,
        initialValue: editMode ? docInfo.titleId : ''
      },
      {
        type: 'select',
        label: '所属科室',
        field: 'deptList',
        required: false,
        message: '选择科室',
        placeholder: '请选择科室...',
        mode: 'multiple',
        options: deptKV,
        initialValue: editMode ? ((deptIdList[0] !== "##") ? deptIdList : '') : ''
      },
      {
        type: 'input',
        label: '擅长',
        field: 'expert',
        required: true,
        message: '请输入擅长',
        placeholder: '请输入擅长...',
        initialValue: editMode ? docInfo.expert : ''
      },
      {
        type: 'textarea',
        label: '医生简介',
        field: 'desc',
        rows: '6',
        initialValue: editMode ? docInfo.desc : ''
      },
    ];
    // if (localStorage.getItem("hospitalId") !== 'H001') {
    //   arr.unshift({
    //     type: 'select',
    //     label: '所属科室',
    //     field: 'deptList',
    //     required: true,
    //     message: '选择科室',
    //     placeholder: '请选择科室...',
    //     mode: 'multiple',
    //     options: deptKV,
    //     initialValue: editMode ? deptIdList : ''
    //   })
    // };
    if (!editMode) {
      arr.push({
        type: 'upload',
        label: '医生头像',
        field: 'upload',
        name: 'file',
        required: true,
        message: '请上传照片',
        buttonText: '点击上传照片',
        valuePropName: 'fileList',
        getValueFromEvent: getFile,
        action: `${Domain.BasicUrl}/manage/uploadFile`
      })
    }
    return arr;
  };

  const handleSubmit = () => {
    formRef.current.getForm().validateFields()
      .then(data => {
        let url: string;
        let param: any;
        if (editMode) {
          url = '/manage/comDoctor.update'
          param = {
            hospitalId: hospitalId,
            oid: docInfo.id,
            ...data,
            deptId: data.deptList && data.deptList.length > 0 ? data.deptList.toString() : "##",
          }
        }
        else {
          url = '/manage/comDoctor.insert'
          param = {
            hospitalId: hospitalId,
            ...data,
            deptId: data.deptList ? data.deptList.toString() : "##",
            fileSeqNo: fileSeqNo,
          }
        }
        Ajax.Post('BasicUrl', url, param
          , (ret: any) => {
            message.success('操作成功');
            formRef.current.getForm().resetFields();
            onOk();
          }
        )
      }).catch((err: any) => {
      })
  };

  return (
    <Modal
      open={visible}
      title='医生信息编辑'
      onOk={() => handleSubmit()}
      onCancel={onClose}
      okText="提交"
      cancelText="取消"
      destroyOnClose
    >
      <SmartForm
        formItemLayout={formItemLayout}
        ref={refForm}
        cols='1'
        formLayout='inline'
        fields={getFields()}
      >
        <div />
      </SmartForm>
    </Modal>
  );
}
