import { useEffect, useState } from 'react';
import { DomRoot, Ajax, KeepAlive } from '@/components/PageRoot';
import { Card, Row, Col, Button, message } from 'antd';
import BraftEditor from 'braft-editor'
import 'braft-editor/dist/index.css'
import _ from 'lodash';

const Hospital = () => {

  const [outputHTML, setOutputHtml] = useState('');
  const [editorState, setEditorState] = useState(BraftEditor.createEditorState('')); // 设置编辑器初始内容
  const [newFlag, setNewFlag] = useState(true);

  const queryHosIntro = () => {
    Ajax.Post('BasicUrl', '/manage/hospIntro.selectAll',
      {
        hospitalId: localStorage.getItem('hospitalId'),
      },
      (ret: any) => {
        const { list } = ret;
        if (list.length > 0) {
          setEditorState(BraftEditor.createEditorState(list[0].content));
          setOutputHtml(ret.list[0].content)
          setNewFlag(false);
        }
      }
    );
  }

  useEffect(() => {
    queryHosIntro();
  }, []);

  const handleChange = (text: any) => {
    let html = text.toHTML();
    html = _.replace(html, '<img', '<img style="width: 100%"');
    setEditorState(text);
    setOutputHtml(html);
  }

  const save = () => {
    // if (outputHTML.length > 300000) {
    //   message.error('上传图片大小不能大于300K');
    //   return;
    // }
    const url = newFlag ? '/manage/hospIntro.insert' : '/manage/hospIntro.update';
    const param = {
      hospitalId: localStorage.getItem('hospitalId'),
      content: outputHTML
    };
    Ajax.Post('BasicUrl', url, param
      , (ret: any) => {
        message.success('操作成功');
        setNewFlag(false);
      }
    );
  }

  return (
    <DomRoot>
      <Row gutter={8}>
        <Col span={8}>
          <Card bordered={false} title='手机效果预览' extra={<Button type='primary' onClick={save} >保存</Button>}>
            <div dangerouslySetInnerHTML={{ __html: outputHTML }} />
          </Card>
        </Col >
        <Col span={12}>
          <Card bordered={false} title='编辑' >
            <div className="editor-wrapper">
              <BraftEditor
                value={editorState}
                onChange={handleChange}
                controls={[
                  'bold', 'italic', 'underline', 'separator',
                  'text-align', 'text-indent', 'separator',
                  'media', 'emoji', 'separator',
                  'font-size', 'line-height', 'text-color']}
                media={{
                  accepts: {
                    image: 'image/png,image/jpeg,image/jpg,image/webp,image/apng,image/svg',
                    video: false,
                    audio: false,
                  }
                }}
              />
            </div>
          </Card>
        </Col>
      </Row>
    </DomRoot>
  )
}

export default () => (
  <KeepAlive>
    <Hospital />
  </KeepAlive>
)