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
    Ajax.Post('SurveyUrl', '/manage/questionSurveyResult.selectSuggestion',
      {
        startDate: startDate.substring(0, 4) + startDate.substring(5, 7) + startDate.substring(8, 10),
        endDate: endDate.substring(0, 4) + endDate.substring(5, 7) + endDate.substring(8, 10),
      },
      (ret: any) => {
        const length = ret.list.length;
        const arr = [];
        if (length > 0) {
          const preData = ret.list
          forEach(preData, (o) => {
            o.formatDateTime = o.dateTime.substring(0, 4) + '-'
              + o.dateTime.substring(4, 6) + '-'
              + o.dateTime.substring(6, 8) + ' '
              + o.dateTime.substring(8, 10) + ':'
              + o.dateTime.substring(10, 12) + ':'
              + o.dateTime.substring(12, 14)
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
    Ajax.Post('SurveyUrl', '/downloadSuggestion',
      {
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
      title: '姓名',
      dataIndex: 'userName',
      key: 'userName',
    },
    {
      title: '手机号',
      dataIndex: 'userPhone',
      key: 'userPhone',
    },
    {
      title: '意见建议',
      dataIndex: 'itemResult',
      key: 'itemResult',
    },
    {
      title: '用户ID',
      dataIndex: 'userId',
      key: 'userId',
    },
    {
      title: '提交时间',
      dataIndex: 'formatDateTime',
      key: 'formatDateTime',
    }
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