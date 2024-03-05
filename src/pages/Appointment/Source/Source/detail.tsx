import { Ajax } from '@/components/PageRoot';
import { Fragment, useEffect, useState } from "react";
import { Button, Popover, Space, Tag, Popconfirm, Alert, message } from "antd";
import moment from 'moment';
import { CalendarOutlined, LockOutlined, StopOutlined, PlusOutlined, RedoOutlined, MinusOutlined, ForkOutlined } from '@ant-design/icons';
import Stop from './stop';
import AddSrc from './addsrc';
import SubSrc from './subsrc';

export default (props) => {

  const { scheduleInfo, deptName, queryAfterEdit } = props;

  const [detailList, setDetailList] = useState(null);
  const [stopVisible, setStopVisible] = useState(false);
  const [addVisible, setAddVisible] = useState(false);
  const [subVisible, setSubVisible] = useState(false);

  const alertMessage = () => {
    return (
      <span>
        {/* 科室名称 / 号别 / 医生 */}
        {deptName} / {scheduleInfo.registerTypeName}{scheduleInfo.doctorName ? <span> / {scheduleInfo.doctorName}</span> : ''}
        {/* 日期 / 午别 */}
        <CalendarOutlined style={{ marginLeft: 10 }} /> {moment(scheduleInfo.date).format('YYYY-MM-DD')} {scheduleInfo.noon === '1' ? '上午' : '下午'}
        {scheduleInfo.active === '0' && <Tag color='red' style={{ marginLeft: 20 }}>已停诊</Tag>}
      </span >)
  }

  const reboot = () => {
    Ajax.Post('AptUrl', '/manage/src.reboot',
      {
        scheduleId: scheduleInfo.scheduleId,
      },
      (ret: any) => {
        message.success('重启排班成功');
        queryAfterEdit();
      }
    );
  }

  const alertAction = () => {
    return (
      <Space>
        {scheduleInfo.active === '1' ?
          <Button type='primary' danger onClick={() => setStopVisible(true)}><StopOutlined />停诊</Button> :
          <Popconfirm title='确定要重启该排班？' onConfirm={() => reboot()}>
            <Button style={{ backgroundColor: '#87d068', color: 'white' }}><RedoOutlined />重启排班</Button>
          </Popconfirm>}
        {/* 当生成过号源，可显示加号按钮 */}
        {scheduleInfo.valid === '1' && <Button type='primary' onClick={() => setAddVisible(true)}><PlusOutlined />加号</Button>}
        {scheduleInfo.valid === '1' && <Button style={{ color: 'red' }} onClick={() => setSubVisible(true)}><MinusOutlined />减号</Button>}
      </Space >)
  }

  // 查询号源明细
  const querySource = () => {
    Ajax.Post('AptUrl', '/manage/srcSource.selectScheduleId',
      {
        scheduleId: scheduleInfo.scheduleId,
      },
      (ret: any) => {
        setDetailList(ret.list);
      }
    );
  }

  useEffect(() => {
    querySource();
  }, []);

  const formatTime = (stime, etime) => {
    return <span>{stime.substring(0, 2)}:{stime.substring(2)} - {etime.substring(0, 2)}:{etime.substring(2)}</span>
  }

  const showName = (item) => {
    if (item.status === '2')
      return item.userName.length > 3 ? item.userName.substring(0, 3) + '...' : item.userName;
    if (item.status === '1')
      return <span><LockOutlined /> {item.userName}</span>
    if (item.status === '9')
      return <span><ForkOutlined /> {item.userName}</span>
    return '空闲';
  }

  const popContent = (item) => {
    return (
      <Fragment>
        预约渠道：{item.custName}<br />
        患者编号：{item.userId}<br />
        患者姓名：{item.userName}<br />
        身份证号：{item.idcard}<br />
        手机号码：{item.userPhone}<br /><br />
        {item.status === '1' && <span>锁号时间：{item.updateTime}</span>}
        {item.status === '2' && <span>挂号时间：{item.updateTime}</span>}
      </Fragment>)
  }

  const showBlank = (item) => {
    let color = "#fff";
    if (item.status === '2') {
      color = '#b7eb8f'
    }
    else if (item.status === '1') {
      color = '#e9e9e9'
    }
    else if (item.status === '9') {
      color = '#e6f7ff'
    }
    if (item.numType === '3') {
      color = '#ff4d4f'
    }
    const buttonJSX = (
      <Button style={{ margin: 6, height: 80, backgroundColor: color }}>
        <b>
          {item.numType === '2' ? <span style={{ color: 'blue' }}>{item.order} - 加号</span> :
            item.numType === '3' ? <span>{item.order} - 停号</span> : item.order}<br />
          {showName(item)}<br />
          {formatTime(item.stime, item.etime)}
        </b>
      </Button>
    )
    if (item.status === '1' || item.status === '2') {
      return (
        <Popover content={popContent(item)} trigger="hover" placement="rightTop">
          {buttonJSX}
        </Popover>
      )
    }
    return buttonJSX;
  }

  return (
    <Fragment>
      <Alert message={alertMessage()} type="info"
        style={{ marginLeft: 5, marginRight: 22, marginBottom: 10 }}
        action={alertAction()} />
      {detailList && detailList.map(item => showBlank(item))}
      {/* 停诊确认弹出框 */}
      <Stop
        visible={stopVisible}
        scheduleInfo={scheduleInfo}
        deptName={deptName}
        onClose={() => setStopVisible(false)}
        onOk={() => {
          setStopVisible(false);
          queryAfterEdit();
        }}
      />
      {/* 加号弹出框 */}
      <AddSrc
        visible={addVisible}
        scheduleInfo={scheduleInfo}
        onClose={() => setAddVisible(false)}
        onOk={() => {
          setAddVisible(false);
          queryAfterEdit();
        }}
      />
      {/* 减号弹出框 */}
      <SubSrc
        visible={subVisible}
        scheduleInfo={scheduleInfo}
        detailList={detailList}
        onClose={() => setSubVisible(false)}
        onOk={() => {
          setSubVisible(false);
          queryAfterEdit();
        }}
      />
    </Fragment>
  );
}