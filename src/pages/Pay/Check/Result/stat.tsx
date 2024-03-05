import { Row, Col } from "antd";
import _ from 'lodash';
import { useEffect } from "react";
import IncomeIcon from './icon/income.png';
import OutIcon from './icon/out.png';
import SumIcon from './icon/sum.png';

export default (props) => {

  const { inOutStat } = props;

  return (
    <Row gutter={16}>
      <Col span={1}>
        <span style={{ marginTop: 8, display: 'inline-block', height: 64, width: 64, backgroundImage: `url(${IncomeIcon})` }} />
      </Col>
      <Col span={7} style={{ marginLeft: 16, }}>
        <span>渠道收费（{inOutStat.thirdIn ? inOutStat.thirdIn.thirdCount : '0'} 笔）：</span>
        <span style={{ fontSize: 25, color: '#0066FF' }}>{inOutStat.thirdIn ? (inOutStat.thirdIn.thirdSum / 100).toFixed(2) : '0.00'} 元</span><br />
        <span>医院收费（{inOutStat.bizIn ? inOutStat.bizIn.bizCount : '0'} 笔）：</span>
        <span style={{ fontSize: 25, color: '#0066FF' }}>{inOutStat.bizIn ? (inOutStat.bizIn.bizSum / 100).toFixed(2) : '0.00'} 元</span>
      </Col>
      <Col span={1}>
        <span style={{ marginTop: 8, display: 'inline-block', height: 64, width: 64, backgroundImage: `url(${OutIcon})` }} />
      </Col>
      <Col span={7} style={{ marginLeft: 16, }}>
        <span>渠道退费（{inOutStat.thirdOut ? inOutStat.thirdOut.thirdCount : '0'} 笔）：</span>
        <span style={{ fontSize: 25, color: '#0066FF' }}>{inOutStat.thirdOut ? (inOutStat.thirdOut.thirdSum / 100).toFixed(2) : '0.00'} 元</span><br />
        <span>医院退费（{inOutStat.bizOut ? inOutStat.bizOut.bizCount : '0'} 笔）：</span>
        <span style={{ fontSize: 25, color: '#0066FF' }}>{inOutStat.bizOut ? (inOutStat.bizOut.bizSum / 100).toFixed(2) : '0.00'} 元</span><br />
      </Col>
      <Col span={1}>
        <span style={{ marginTop: 8, display: 'inline-block', height: 64, width: 64, backgroundImage: `url(${SumIcon})` }} />
      </Col>
      <Col span={6} style={{ marginLeft: 16, }}>
        <span>渠道回款：</span>
        <span style={{ fontSize: 25, color: '#0066FF' }}>{inOutStat.thirdOut ? (_.subtract(inOutStat.thirdIn.thirdSum, inOutStat.thirdOut.thirdSum) / 100).toFixed(2) : inOutStat.thirdIn ? (inOutStat.thirdIn.thirdSum / 100).toFixed(2): '0.00'} 元</span><br />
        <span>医院总计：</span>
        <span style={{ fontSize: 25, color: '#0066FF' }}>{inOutStat.bizOut ? (_.subtract(inOutStat.bizIn.bizSum, inOutStat.bizOut.bizSum) / 100).toFixed(2) : inOutStat.bizIn ? (inOutStat.bizIn.bizSum / 100).toFixed(2): '0.00'} 元</span><br />
      </Col>
    </Row>
  )
}