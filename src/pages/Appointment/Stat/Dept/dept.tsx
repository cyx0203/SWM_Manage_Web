import { useEffect, useState } from 'react';
import { DomRoot, Ajax, KeepAlive } from '@/components/PageRoot';
import { Card, Button, DatePicker, Space } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import moment from 'moment';
import { Pie } from '@ant-design/plots';
import { forEach, sumBy } from 'lodash';
import utils from "../util/util";

const Dept = () => {

  const [startDate, setStartDate] = useState(utils.getNormalDateAny(-30));     // 查询开始日期
  const [endDate, setEndDate] = useState(utils.getNormalDateAny(7));           // 查询结束日期
  const [resultData, setResultData] = useState(null);

  const handelSerch = (keywords: any) => {
    Ajax.Post('AptUrl', '/manage/stat.selectForDeptStat',
      {
        startDate: startDate.substring(0, 4) + startDate.substring(5, 7) + startDate.substring(8, 10),
        endDate: endDate.substring(0, 4) + endDate.substring(5, 7) + endDate.substring(8, 10),
      },
      (ret: any) => {
        const length = ret.list.length;
        let preData = null;
        if (length > 0) {
          preData = ret.list
          const count = sumBy(preData, (o) => o.value)  // 计算总数

          forEach(preData, (o) => {
            o.value = o.value / count
          })
        }
        setResultData(preData);
      }
    );
  }

  useEffect(() => {
    handelSerch(null);
  }, [])



  const onChangeDate = (moment, dateArr) => {
    console.log(moment, dateArr)
    setStartDate(dateArr[0])
    setEndDate(dateArr[1])
  }

  const { RangePicker } = DatePicker;
  const dateFormat = 'YYYY-MM-DD';

  const getPie = (reqData: any) => {
    const data = reqData;
    const config = {
      appendPadding: 10,
      autoFit: true,
      data,
      angleField: 'value',
      colorField: 'type',
      radius: 0.75,
      label: {
        type: 'spider',
        labelHeight: 28,
        content: '{name}\n{percentage}',
      },
      interactions: [
        {
          type: 'element-selected',
        },
        {
          type: 'element-active',
        },
      ],
    };
    return <Pie {...config} />;
  };

  return (
    <DomRoot>
      {/* 查询条件 */}
      <Card bordered={false}>
        <Space>
          起止日期：
          <RangePicker
            defaultValue={[moment(startDate, dateFormat), moment(endDate, dateFormat)]}
            onChange={onChangeDate}
          />
          <Button type='primary' onClick={() => {handelSerch(null)}} icon={<SearchOutlined />} >查询</Button>
        </Space>
      </Card>

      {/* 查询状态 */}
      <Card style={{ marginTop: 8 }}>
        {resultData && getPie(resultData)}
      </Card>
    </DomRoot>
  )
}

export default () => (
  <KeepAlive>
    <Dept />
  </KeepAlive>
)