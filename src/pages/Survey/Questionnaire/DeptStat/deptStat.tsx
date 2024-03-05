import { useEffect, useState } from 'react';
import { DomRoot, Ajax, KeepAlive } from '@/components/PageRoot';
import { Card, Table, Button, DatePicker, message, Space } from 'antd';
import { SearchOutlined, DownloadOutlined } from '@ant-design/icons';
import moment from 'moment';
import utils from "../util/util";
import { forEach } from 'lodash';

const Record = () => {

  const [startDate, setStartDate] = useState(utils.getNormalDateAny(-30));     // 查询开始日期
  const [endDate, setEndDate] = useState(utils.getNormalDateAny(0));         // 查询结束日期
  const [resultData, setResultData] = useState(null);

  const handelSerch = (keywords: any) => {
    Ajax.Post('SurveyUrl', '/manage/getQuestionResultForDeptStat',
      {
        itemId:'0315',
        startDate: startDate.substring(0, 4) + startDate.substring(5, 7) + startDate.substring(8, 10),
        endDate: endDate.substring(0, 4) + endDate.substring(5, 7) + endDate.substring(8, 10),
      },
      (ret: any) => {
        const length = ret.list.length;
        const arr = [];
        // debugger
        if (length > 0) {
          const preData = ret.list
          forEach(preData, (o) => {
            const sum = o.option1 + o.option2 + o.option3;
            const option1 = o.option1;
            const option2 = o.option2;
            o.count = sum;
            o.option1 = o.option1 ? Math.round(o.option1 / sum * 100) + "%" : "";
            o.option2 = o.option2 ? Math.round(o.option2 / sum * 100) + "%" : "";
            o.option3 = o.option3 ? Math.round(o.option3 / sum * 100) + "%" : "";
            o.rate = (option1 && option2) ? Math.round((option1 + option2) / sum * 100) + "%" : (o.option1 ? o.option1 : (o.option2 ? o.option2 : ""));
            arr.push(o)
          })
        }
        setResultData(arr);
      }
    );
  }

  useEffect(() => {
    handelSerch(null);
  }, []);

  const exportExcel = () => {
    Ajax.Post('SurveyUrl', '/downloadDeptStat',
      {
        itemId:'0315',
        startDate: startDate.substring(0, 4) + startDate.substring(5, 7) + startDate.substring(8, 10),
        endDate: endDate.substring(0, 4) + endDate.substring(5, 7) + endDate.substring(8, 10),
      },
      (ret: any) => {
        window.open(ret.url);
      }
    );
  }

  // 表格列的配置属性
  const tableColumns: any = [
    {
      title: '科室名称',
      dataIndex: 'deptName',
      key: 'deptName',
    },
    {
      title: '参评人次',
      dataIndex: 'count',
      key: 'count',
    },
    {
      title: '满意',
      dataIndex: 'option1',
      key: 'option1',
    },
    {
      title: '基本满意',
      dataIndex: 'option2',
      key: 'option2',
    },
    {
      title: '不满意',
      dataIndex: 'option3',
      key: 'option3',
    },
    {
      title: '满意率',
      dataIndex: 'rate',
      key: 'rate',
    },
  ];

  const onChangeDate = (moment, dateArr) => {
    console.log(moment, dateArr)
    setStartDate(dateArr[0])
    setEndDate(dateArr[1])
  }

  const { RangePicker } = DatePicker;
  const dateFormat = 'YYYY-MM-DD';

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
          <Button type='primary' onClick={() => { handelSerch() }} icon={<SearchOutlined />} >查询</Button>
          <Button type='primary' icon={<DownloadOutlined />} onClick={() => exportExcel()} >导出</Button>
        </Space>
      </Card>

      {/* 查询状态 */}
      <Card bordered={false} hoverable>
        {resultData &&
          <Table
            bordered
            size="small"
            columns={tableColumns}
            dataSource={resultData}
          />
        }
      </Card>
    </DomRoot>
  )
}

export default () => (
  <KeepAlive>
    <Record />
  </KeepAlive>
)