import { Fragment, useEffect, useRef, useState } from 'react';
import { DomRoot, Ajax, KeepAlive } from '@/components/PageRoot';
import { Card, Tag, Modal, Empty, List, Avatar, Row, Col, Badge, Tooltip, Space, Button, Progress, message } from 'antd';
import { PushpinFilled, EditOutlined, CheckOutlined, PlusOutlined } from '@ant-design/icons';
import Detail from './detail';
import AddSch from './addsch';
import moment from 'moment';
import SmartTop from '@/components/SmartTop';
import Util from './util';
import Week1Icon from './icon/week1.png';
import Week2Icon from './icon/week2.png';
import Week3Icon from './icon/week3.png';
import Week4Icon from './icon/week4.png';
import Week5Icon from './icon/week5.png';
import Week6Icon from './icon/week6.png';
import Week7Icon from './icon/week7.png';

const Source = () => {

  //所有从今天起的未来号源排班的结果集
  const [srcScheduleList, setSrcScheduleList] = useState(null);
  // 预约明细弹出框
  const [detailVisible, setDetailVisible] = useState(false);
  const [deptName, setDeptName] = useState(null);
  const [scheduleInfo, setScheduleInfo] = useState(null);
  // 预先查询的基础数据-科室、医生
  const [deptList, setDeptList] = useState(null);
  const [doctorList, setDoctorList] = useState(null);
  const topRef = useRef(null);
  // 加排班弹出框
  const [addschVisible, setAddschVisible] = useState(false);
  const [registerType, setRegisterType] = useState(null);
  const [selectInfo, setSelectInfo] = useState(null);
  const [scheduleList, setScheduleList] = useState(null);
  const [deptId, setDeptId] = useState(null);
  const [noon, setNoon] = useState(null);

  // 查询条件区域 
  const queryArea: any = useRef(null);

  // 查询号源排班数据
  const querySrcSchedule = (params = {}) => {
    const query = { ...queryArea.current, ...params };
    Ajax.Post('AptUrl', '/manage/srcSchedule.selectFromToday',
      {
        hospitalId: localStorage.getItem('hospitalId'),
        ...query,
      },
      (ret: any) => {
        setSrcScheduleList(ret.list)
      }
    );
  }

  const topSubmit = (params = {}) => {
    queryArea.current = params;
    querySrcSchedule(null);
  }

  // 查询所有科室
  const queryDepartment = () => {
    Ajax.Post('AptUrl', '/manage/schDept.selectKV',
      {
        hospitalId: localStorage.getItem('hospitalId'),
      },
      (ret: any) => {
        setDeptList(ret.list);
      }
    );
  }

  // 查询所有医生
  const queryDoctor = () => {
    Ajax.Post('AptUrl', '/manage/com.selectDoctor',
      {
        hospitalId: localStorage.getItem('hospitalId'),
      },
      (ret: any) => {
        setDoctorList(ret.list);
      }
    );
  }

  // 查询所有号类
  const queryRegisterType = () => {
    Ajax.Post('AptUrl', '/manage/com.selectRegisterType',
      {
        hospitalId: localStorage.getItem('hospitalId'),
      },
      (ret: any) => {
        setRegisterType(ret.list);
      }
    );
  }

  useEffect(() => {
    queryDepartment();
    queryDoctor();
    queryRegisterType();
  }, []);

  // 停诊，加号，恢复等操作后，关闭明细弹出框，重新查询号源排班
  const queryAfterEdit = () => {
    querySrcSchedule();
    setDetailVisible(false);
  }

  const getFields = () => {
    return [{
      type: 'select',
      label: '科室',
      style: { width: 250 },
      field: 'queryDeptId',
      placeholder: '请选择查询科室...',
      showSearch: true,
      options: deptList,
      allowClear: true,
      required: true,
      message: '请选择科室',
    }, {
      type: 'button',
      buttonList: [
        {
          type: 'primary',
          htmlType: 'submit',
          buttonText: '查询',
          style: { marginLeft: 8 }
        }, {
          buttonText: '刷新号源',
          style: { marginLeft: 8 },
          onClick: () => {
            if (!queryArea.current) {
              message.error('先选择科室');
              return;
            }
            querySrcSchedule(null)
          }
        }
      ]
    }]
  }

  // 按照日期格式化srcScheduleList数据
  const formatListData = () => {
    const returnData = [];
    for (let i = 0; i < 10; i++) {
      const dateObject = moment().add(i, 'days');
      returnData.push({
        dateFormat: dateObject.format('YYYY-MM-DD'),
        date: dateObject.format('YYYYMMDD'),
        week: dateObject.day(),
        canApt: i < 7,
      });
    }
    return returnData;
  }

  const showRegisterType = (item) => {
    const active = item.active;  //停诊标记： 1-正常；0-停诊
    return (
      <Row gutter={[16, 16]}>
        <Col span={10} style={{ color: (active === '0' ? '#cccccc' : '#000') }}>
          {/* 号别 */}
          {item.registerTypeName}
          {/* 专家号的icon+医生姓名 */}
          {(item.registerTypeName.indexOf('专家号') > -1 || item.registerTypeName.indexOf('中医') > -1) &&
            <span><PushpinFilled style={{ marginLeft: 3, marginRight: 3 }} />{item.doctorName}</span>}
          {/* 停诊记号 */}
          {active === '0' && <Tag color='red' style={{ marginLeft: 6 }}>已停诊</Tag>}
        </Col>
        <Col span={2}>
          <Tag color='blue' >余号</Tag>
        </Col>
        <Col span={6}>
          {/* 剩余号源进度条 */}
          <Progress
            percent={item.remainder * 100 / item.sum}
            showInfo={false}
            status={item.remainder * 100 / item.sum >= 80 ? 'success' : (item.remainder * 100 / item.sum < 20 ? 'exception' : 'active')} />
        </Col>
        <Col span={6}>
          {/* 剩余号源 / 号源总数 */}
          {item.remainder}/{item.sum}
          {/* 编辑 */}
          <EditOutlined style={{ marginLeft: 8 }} onClick={() => {
            setScheduleInfo(item);
            setDeptName(Util.getDeptNameById(deptList, item.deptId));
            setDetailVisible(true);
          }
          } />
        </Col>
      </Row>)
  }

  // 上下午块区的处理
  const showSchduleBlank = (data) => {
    if (!data) return <Tag color="purple">空</Tag>;
    return (
      <Fragment>
        {data.map(item => showRegisterType(item))}
      </Fragment>
    )
  }

  // 加排班点击事件
  const addScheduleClick = (item, noon) => {
    const fitList = Util.findSchduleByDateAndNoon(srcScheduleList, item.date, noon);  // 匹配和点击按钮相符的排班
    // if (fitList.length === 0) {
    //   message.error('异常的排班');
    //   return;
    // }
    setScheduleList(fitList); //将已排班号源返回
    setDeptId(queryArea && queryArea.current.queryDeptId);
    setSelectInfo(item);//号源条件（日期、周几、可预约等）
    setNoon(noon); //午别
    setAddschVisible(true);
  }

  // 加号按钮
  const addSchedule = (item) => {
    return (
      <Space>
        <Button size='small' onClick={() => addScheduleClick(item, "1")}>上午</Button>
        <Button size='small' onClick={() => addScheduleClick(item, "2")}>下午</Button>
      </Space>)
  }

  const listTitle = (item) => {
    return (
      <span style={{ fontSize: 16, marginLeft: 8 }}>
        {item.dateFormat}
        {item.canApt && <Tag color='green' style={{ marginLeft: 10 }}><CheckOutlined />可预约</Tag>}
        <Tooltip title={addSchedule(item)} color='blue'>
          <Tag color='blue' style={{ marginLeft: 5 }}><PlusOutlined />加排班</Tag>
        </Tooltip>
      </span>)
  }

  const weekPic = (week) => {
    switch (week) {
      case 0:
        return Week7Icon;
      case 1:
        return Week1Icon;
      case 2:
        return Week2Icon;
      case 3:
        return Week3Icon;
      case 4:
        return Week4Icon;
      case 5:
        return Week5Icon;
      case 6:
        return Week6Icon;
      default:
        return '';
    }
  }

  const listDescription = (item) => {
    return (
      <Row>
        <Col span={10}>
          <Badge.Ribbon text="上午">
            <Card size='small' bordered={false} bodyStyle={{ backgroundColor: 'rgb(249, 251, 250)', borderRadius: 6 }}>
              {showSchduleBlank(Util.findSchduleByDateAndNoon(srcScheduleList, item.date, '1'))}
            </Card>
          </Badge.Ribbon>
        </Col>
        <Col span={1} />
        <Col span={10}>
          <Badge.Ribbon text="下午">
            <Card size='small' bordered={false} bodyStyle={{ backgroundColor: 'rgb(249, 251, 250)', borderRadius: 6 }}>
              {showSchduleBlank(Util.findSchduleByDateAndNoon(srcScheduleList, item.date, '2'))}
            </Card>
          </Badge.Ribbon>
        </Col>
      </Row >
    )
  }

  return (
    <DomRoot>
      {/* 查询条件区域 */}
      <Card>
        <SmartTop handleSubmit={topSubmit} getFields={getFields} onRef={topRef}><div /></SmartTop>
      </Card>
      {/* 表格 */}
      <Card style={{ marginTop: 8 }}>
        {/* 主体信息展示 */}
        {srcScheduleList ?
          <List
            itemLayout="horizontal"
            dataSource={formatListData()}
            renderItem={item => (
              <List.Item>
                <List.Item.Meta
                  avatar={<Avatar style={{ width: 50, height: 50 }} src={weekPic(item.week)} />}
                  title={listTitle(item)}
                  description={listDescription(item)}
                />
              </List.Item>
            )}
          /> : <Empty />}
      </Card>
      {/* 预约明细 */}
      <Modal
        open={detailVisible}
        onCancel={() => setDetailVisible(false)}
        width={1100}
        footer={null}
        destroyOnClose
      >
        <Detail scheduleInfo={scheduleInfo} deptName={deptName} queryAfterEdit={() => queryAfterEdit()} />
      </Modal>
      {/* 编辑加排班框 */}
      <AddSch
        addschVisible={addschVisible}
        selectInfo={selectInfo}
        noon={noon}
        deptId={deptId}
        registerType={registerType}
        deptList={deptList}
        doctorList={doctorList}
        scheduleList={scheduleList}
        onClose={() => setAddschVisible(false)}
        onOk={() => {
          querySrcSchedule();
          setAddschVisible(false);
        }}
      />
    </DomRoot>
  )
}

export default () => (
  <KeepAlive>
    <Source />
  </KeepAlive>
)
