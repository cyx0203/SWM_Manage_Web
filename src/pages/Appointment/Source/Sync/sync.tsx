import { useEffect, useRef, useState } from 'react';
import { DomRoot, Ajax, KeepAlive } from '@/components/PageRoot';
import { Button, Calendar, Card, Divider, Popover, Tag } from 'antd';
import styles from "./style.module.less";
import { CheckOutlined, LoadingOutlined, WarningOutlined } from '@ant-design/icons';
import moment from 'moment';

const Sync = () => {

  const [syscRecordList, setSyscRecordList] = useState(null);

  const date = useRef(moment());

  const querySyscRecord = () => {
    let firstday = moment(date.current).startOf('month').day() - 1;
    if (firstday < 0) {
      firstday = firstday + 7;
    }
    let lastday = 42 - Number(moment(date.current).endOf('month').format("DD")) - firstday;

    Ajax.Post('AptUrl', '/manage/srcSyncRecord.selectByDate',
      {
        hospitalId: localStorage.getItem('hospitalId'),
        startDate: moment(date.current).startOf('month').subtract(firstday, "d").format('YYYYMMDD'),
        endDate: moment(date.current).endOf('month').add(lastday, "d").format('YYYYMMDD'),
      },
      (ret: any) => {
        setSyscRecordList(ret.list)
      }
    );
  }

  useEffect(() => {
    querySyscRecord();
  }, []);

  //格式化科室列表
  const content = (value) => {
    let i = 0;
    return (
      <div>
        {
          value.map(item => {
            return <span>
              <p>第{++i}次同步:</p>
              <p>同步状态：{item.result == '0' ?
                <Tag color="black">等待结果</Tag> :
                item.result == '1' ?
                  <Tag color="green">成功</Tag> :
                  <Tag color="red">失败</Tag>}</p>
              <p>同步时间：{item.createTime}</p>
              <p>通知时间：{item.updateTime}</p>
              <Divider />
            </span>
          })
        }
      </div>
    )
  }
  //组装日期内容
  const showBlockContent = (item) => {
    if (item) {
      return <Popover content={content(item)} title="同步详情"><span><CheckOutlined style={{ color: 'green' }} /> HIS同步成功</span></Popover>
    }
    return <span><WarningOutlined style={{ color: 'red' }} /> 无同步记录</span>
  }

  const dateCellRender = (value) => {
    const dateBlock = value.format("YYYYMMDD");
    if (dateBlock > moment().add(1, 'd').format("YYYYMMDD")) return null;
    let children = null;
    for (const item of syscRecordList) {
      if (item.date === dateBlock) {
        // 找到到当前日期块
        children = item.children;
        break;
      }
    }
    if (dateBlock === moment().add(1, 'd').format("YYYYMMDD") && children == null) {
      return <span><LoadingOutlined /> 等待同步</span>;
    }
    return (
      showBlockContent(children)
    )
  }

  const onChangeMonth = (e) => {
    date.current = e;
    querySyscRecord();
  }

  return (
    <DomRoot>
      <Card>
        <Button onClick={() => querySyscRecord()}>刷新同步信息</Button>
      </Card>
      <Card style={{ marginTop: 8 }}>
        {syscRecordList &&
          <Calendar className={styles.calendar} onPanelChange={onChangeMonth} dateCellRender={dateCellRender} />}
      </Card>
    </DomRoot>
  )
}

export default () => (
  <KeepAlive>
    <Sync />
  </KeepAlive>
)
