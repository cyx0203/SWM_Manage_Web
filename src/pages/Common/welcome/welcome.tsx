import { useEffect, useRef, useState } from 'react';
import { DomRoot, KeepAlive } from '@/components/PageRoot';
import { Alert, Card } from 'antd';
import { HomeOutlined } from '@ant-design/icons';

const Welcome = () => {

  useEffect(() => {
    return () => {
      // Destroy Todo...
    }
  }, []);

  //页面渲染
  return (
    <DomRoot>
      <Card>
        <Alert
          message={<h1 style={{ marginTop: 8 }}><HomeOutlined /> 欢迎使用{MAIN_TITLE}</h1>}
          type="success"
        // showIcon
        />
      </Card>
    </DomRoot>
  );
};

export default () => (
  <KeepAlive persistant={true}>
    <Welcome />
  </KeepAlive>)


