import { useEffect, useState, useRef, Fragment } from 'react';
import { Ajax } from '@/components/PageRoot';
import SmartForm from "@/components/SmartForm";
import { Card, Row, Col, message, Button } from 'antd';
import BraftEditor from 'braft-editor'
import 'braft-editor/dist/index.css'
import _ from 'lodash';

export default (props) => {

  const { record, onOk, textTypeList, hospitalId } = props;

  const [outputHTML, setOutputHtml] = useState('');
  const [editorState, setEditorState] = useState(BraftEditor.createEditorState('')); // 设置编辑器初始内容

  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 5 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 17 },
    }
  }

  const formRef = useRef(null);

  const refForm = (e) => {
    formRef.current = e;
  }

  useEffect(() => {
    setOutputHtml(record ? record.content : '');
    setEditorState(BraftEditor.createEditorState(record ? record.content : ''));
  }, []);

  const handleChange = (text: any) => {
    let html = text.toHTML();
    html = _.replace(html, '<img', '<img style="width: 100%"');
    setEditorState(text);
    setOutputHtml(html);
  }

  const formFields = [{
    type: 'input',
    label: '图文标题',
    field: 'title',
    required: true,
    message: '请输入图文标题',
    placeholder: '请输入图文标题...',
    initialValue: record ? record.title : '',
  }, {
    type: 'select',
    label: '图文类型',
    field: 'typeId',
    required: true,
    message: '请输入图文类型',
    placeholder: '请输入图文类型...',
    options: textTypeList, 
    initialValue: record ? record.typeId : '',
  }]

  const handleSave = () => {
    formRef.current.getForm().validateFields()
      .then(data => {
        const contentHtml = outputHTML == null || outputHTML === '' || outputHTML === '<p></p>' ? null : outputHTML;
        let url;
        let param;
        if (record) {  //edit
          url = '/manage/comText.update';
          param = {
            ...data,
            id: record.id,
            content: contentHtml,
            hospitalId: hospitalId,
            updateUser: localStorage.getItem('account'),
          }
        }
        else { //add
          url = '/manage/comText.insert';
          param = {
            ...data,
            content: contentHtml,
            hospitalId: hospitalId,
            createUser: localStorage.getItem('account'),
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
    <Fragment>
      <Row gutter={8}>
        <Col span={20}>
          <SmartForm
            formItemLayout={formItemLayout}
            ref={refForm}
            cols={2}
            formLayout="inline"
            fields={formFields}
          > <div />
          </SmartForm>
        </Col>
        <Col span={4}><Button type='primary' onClick={() => handleSave()}>提交</Button></Col>
      </Row>
      <Row gutter={8}>
        <Col span={10}>
          <Card title='手机效果预览'>
            <div dangerouslySetInnerHTML={{ __html: outputHTML }} />
          </Card>
        </Col>
        <Col span={14}>
          <Card>
            <div className="editor-wrapper">
              <BraftEditor
                value={editorState}
                onChange={handleChange}
                controls={[
                  'bold', 'italic', 'underline', 'separator',
                  'text-align', 'text-indent', 'separator',
                  'media', 'emoji', 'separator',
                  'font-size', 'line-height', 'text-color']}
              />
            </div>
          </Card>
        </Col>
      </Row>
    </Fragment>
  )
}              