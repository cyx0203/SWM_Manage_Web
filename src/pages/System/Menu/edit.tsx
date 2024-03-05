import { Ajax } from '@/components/PageRoot';
import SmartForm from "@/components/SmartForm";
import { useEffect, useRef } from "react";
import { message, Row, Button, Col } from "antd";

export default (props) => {

  const { record, onSuccess, allId, flag } = props;

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

  useEffect(() => {
    if (flag) {
      formRef.current.getForm().setFieldsValue({ ...record });
    } else {
      formRef.current.getForm().setFieldsValue({});
    }
  }, []);

  const getFields = () => {
    return [
      {
        type: 'input',
        label: '菜单id',
        field: 'id',
        required: true,
        message: '请输入菜单id',
        placeholder: '请输入菜单id...',
        disabled:flag
      }, {
        type: 'input',
        label: '菜单名称',
        field: 'name',
        required: true,
        message: '请输入菜单名称',
        placeholder: '请输入菜单名称...',
      }, {
        type: 'input',
        label: '访问路径',
        field: 'path',
        required: true,
        message: '请输入访问路径',
        placeholder: '请输入访问路径...',
      }, {
        type: 'input',
        label: '图标名称',
        field: 'icon',
        required: false,
        placeholder: '请输入图标名称...',
      },
      {
        type: 'input',
        label: '组件路径',
        field: 'component',
        required: false,
        placeholder: '请输入组件路径...',
      },
      {
        type: 'input',
        label: '重定向',
        field: 'redirect',
        required: false,
        placeholder: '请输入重定向...',
      },
      {
        type: 'switch',
        field: 'isoper',
        label: '是否为操作',
        defaultChecked: record && flag ? (record.isoper == 0 ? false : true) : false
      }
    ]
  }

  const handleSubmit = () => {
    formRef.current.getForm().validateFields()
      .then(data => {
        if (flag) {
          //修改
          Ajax.Post('BasicUrl', '/manage/menu.update',
            {
              id: record.id,
              name: data.name,
              path: data.path,
              icon: data.icon,
              component: data.component,
              redirect: data.redirect,
              isoper: data.isoper ? 1 : 0
            },
            (ret: any) => {
              if (ret.success) {
                message.success('修改成功');
              } else {
                message.error('修改失败');
              }
              onSuccess();
            });

        } else {

          if(allId.includes(parseInt(data.id))){
            message.error('此id已存在,请输入其他id');
            return;
          }
          //新增
          Ajax.Post('BasicUrl', '/manage/menu.insert',
            {
              id: data.id,
              name: data.name,
              path: data.path,
              icon: data.icon,
              component: data.component,
              redirect: data.redirect,
              parentId: record.id,
              isoper: data.isoper ? 1 : 0
            },
            (ret: any) => {
              if (ret.success) {
                message.success('新增成功');
              } else {
                message.error('新增失败');
              }
              onSuccess();
            });
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
        <Col span={2} offset={7}>
          <Button type="primary" htmlType="submit">提交</Button>
        </Col>
      </Row>
    </SmartForm>
  );
}