import { useEffect, useState } from 'react';
import { DomRoot, Ajax, KeepAlive } from '@/components/PageRoot';
import { Card, Button, DatePicker, Space } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import moment from 'moment';
import { Column } from '@ant-design/plots';
import utils from "../util/util";

const Doctor = () => {

  const [startDate, setStartDate] = useState(utils.getNormalDateAny(-30));     // 查询开始日期
  const [endDate, setEndDate] = useState(utils.getNormalDateAny(7));           // 查询结束日期
  const [resultData, setResultData] = useState(null);

  const handelSerch = (keywords: any) => {
    Ajax.Post('AptUrl', '/manage/stat.selectForDoctStat',
      {
        startDate: startDate.substring(0, 4) + startDate.substring(5, 7) + startDate.substring(8, 10),
        endDate: endDate.substring(0, 4) + endDate.substring(5, 7) + endDate.substring(8, 10),
      },
      (ret: any) => {
        const length = ret.list.length;
        let preData = null;
        if (length > 0) {
          preData = ret.list
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

  const getColumn = (reqData: any) => {
    const data = reqData;
    const config = {
      data,
      xField: 'type',
      yField: 'sales',
      label: {
        // 可手动配置 label 数据标签位置
        position: 'middle',
        // 'top', 'bottom', 'middle',
        // 配置样式
        style: {
          fill: '#FFFFFF',
          opacity: 0.6,
        },
      },
      xAxis: {
        label: {
          autoHide: true,
          autoRotate: false,
        },
      },
      meta: {
        type: {
          alias: '类别',
        },
        sales: {
          alias: '预约人数',
        },
      },
    };
    return <Column {...config} />;
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
        {resultData && getColumn(resultData)}
      </Card>
    </DomRoot>
  )
}

export default () => (
  <KeepAlive>
    <Doctor />
  </KeepAlive>
)