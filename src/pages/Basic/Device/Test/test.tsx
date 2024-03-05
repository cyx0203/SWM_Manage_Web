import { useState } from 'react';
import { DomRoot, KeepAlive } from '@/components/PageRoot';
import { Button, Input, Row, Col, Divider } from 'antd';

const Test = () => {

  const [count, setCount] = useState(0);

  return (
    <DomRoot>
      <Row>
        <Col xxl={6} xl={24}>
          <Button type='primary' size='large' onClick={() => setCount(count + 1)}>按钮</Button>
        </Col>
        <Col span={12}>
          <Button type="primary">Primary Button</Button>
        </Col>
      </Row>
      <Divider>Text</Divider>

      <Input placeholder="Basic usage" />
      {count}
    </DomRoot>
  )
}

export default () => (
  <KeepAlive>
    <Test />
  </KeepAlive>)
