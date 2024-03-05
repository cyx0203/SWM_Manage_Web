import { useEffect, useState } from 'react';
import { Card, Row, Col, Button, message } from 'antd';
import { DomRoot, Ajax } from '@/components/PageRoot';
import BraftEditor from 'braft-editor'
import 'braft-editor/dist/index.css'
import _ from 'lodash';

export default (props) => {

  const { deptInfo, queryDept, hospitalId } = props;

  const [outputHTML, setOutputHtml] = useState('');
  const [editorState, setEditorState] = useState(BraftEditor.createEditorState('')); // 设置编辑器初始内容

  useEffect(() => {
    setOutputHtml(deptInfo.deptPrompt1st);
    setEditorState(BraftEditor.createEditorState(deptInfo.deptPrompt1st));
  }, []);

  const handleChange = (text: any) => {
    let html = text.toHTML();
    html = _.replace(html, '<img', '<img style="width: 100%"');
    setEditorState(text);
    setOutputHtml(html);
  }

  const save = () => {

    let url: string;
    let param: any;
    if (outputHTML == null || outputHTML === '' || outputHTML === '<p></p>') {
      url = '/manage/comDept.setPromptNull'
      param = {
        hospitalId: hospitalId,
        oid: deptInfo.deptCode1st,
      }
    }
    else {
      url = '/manage/comDept.update'
      param = {
        hospitalId: hospitalId,
        oid: deptInfo.deptCode1st,
        prompt: outputHTML,
      }
    }

    Ajax.Post('BasicUrl', url, param
      , (ret: any) => {
        message.success('操作成功');
        queryDept();

      }
    );
  };

  return (
    <DomRoot>
      <Row gutter={ 8 }>
        <Col span={10}>
          <Card title='手机效果预览' extra={<Button type='primary' onClick={() => save()}>保存</Button>}>
            <div dangerouslySetInnerHTML={{ __html: outputHTML }} />
          </Card>
        </Col>
        <Col span={14}>
          <Card title={<span>{deptInfo.deptName1st} - 科室协议编辑</span>}>
            <div className="editor-wrapper">
              <BraftEditor
                value={editorState}
                onChange={handleChange}
                controls={[
                  'bold', 'italic', 'underline', 'separator',
                  'text-align', 'text-indent', 'separator',
                  'font-size']}
              />
            </div>
          </Card>
        </Col>
      </Row>
    </DomRoot>
  )
}              