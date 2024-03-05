import { Fragment, useEffect, useRef, useState } from 'react';
import { DomRoot, Ajax, KeepAlive } from '@/components/PageRoot';
import { Card, Table, Input, Tag, Space, Button } from 'antd';
import { PushpinFilled, RightOutlined, StopOutlined } from '@ant-design/icons';
import Util from './util';
import moment from 'moment';

const { Search } = Input;

const View = () => {

  //查询条件
  const queryDeptId = useRef(null);
  //所有从今天起的未来号源排班的结果集
  const [srcScheduleList, setSrcScheduleList] = useState(null);
  // 预先查询的基础数据-科室、医生、号别 
  const [deptList, setDeptList] = useState(null);

  // 查询号源排班数据
  const querySrcSchedule = () => {
    Ajax.Post('AptUrl', '/manage/srcSchedule.selectFromToday',
      {
        hospitalId: localStorage.getItem('hospitalId'),
      },
      (ret: any) => {
        setSrcScheduleList(ret.list)
      }
    );
  }

  // 查询所有科室
  const queryDepartment = () => {
    Ajax.Post('AptUrl', '/manage/com.selectDeptForTable',
      {
        queryDeptId: queryDeptId.current,
        hospitalId: localStorage.getItem('hospitalId'),
      },
      (ret: any) => {
        setDeptList(ret.list);
      }
    );
  }

  useEffect(() => {
    queryDepartment();
    querySrcSchedule();
  }, []);

  const onSearch = (value) => {
    queryDeptId.current = value;
    queryDepartment();
  }

  const showRegisterType = (item) => {
    const active = item.active;  //停诊标记： 1-正常；0-停诊
    return (
      <div style={{ color: (active === '0' ? '#cccccc' : '#000') }} >
        {/* 停诊记号 */}
        {active === '0' && <StopOutlined style={{ color: 'red', marginRight: 3 }} />}
        {/* 号别 */}
        {item.registerTypeName}
        {/* 专家号的icon+医生姓名 */}
        {(item.registerTypeName.indexOf('专家号') > -1 || item.registerTypeName.indexOf('中医') > -1) &&
          <span><PushpinFilled style={{ marginLeft: 3, marginRight: 3 }} />{item.doctorName}</span>}
        {/* 剩余号源 / 号源总数 */}
        <RightOutlined style={{ color: 'blue', marginLeft: 3, marginRight: 3 }} />{item.remainder}/{item.sum}
      </div>)
  }

  // 周排版块区的处理
  const showSchduleBlank = (data) => {
    if (!data) return <Tag color="purple">空</Tag>;
    return (
      <Fragment>
        {data.map(item =>
          <span key={item.id}>
            {showRegisterType(item)}
          </span>)}
      </Fragment>
    )
  }

  // 显示日期表头
  const dateTitle = (i) => {
    const date = moment().add(i, 'days');
    const weekList = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
    return (
      <span>{date.format('YYYY-MM-DD')} / {weekList[date.day()]}</span>
    )
  }

  const tableColumns = () => {
    const columns = [];
    columns.push({
      title: '科室名称',
      dataIndex: 'deptName',
      width: 250,
      fixed: 'left',
      render: (value, row) => (
        <span>{value}（{row.deptName1st}）</span>
      )
    })
    for (let i = 0; i < 10; i++) {
      const dateFormat = moment().add(i, 'days').format('YYYYMMDD');
      columns.push({
        title: dateTitle(i),
        children: [{
          title: '上午',
          width: 250,
          render: (value, row) => {
            const scheduleNoon1 = Util.findBlankSchdule(srcScheduleList, row.deptId, dateFormat, '1');
            return showSchduleBlank(scheduleNoon1)
          }
        }, {
          title: '下午',
          width: 250,
          render: (value, row) => {
            const scheduleNoon1 = Util.findBlankSchdule(srcScheduleList, row.deptId, dateFormat, '2');
            return showSchduleBlank(scheduleNoon1)
          }
        }]
      })
    }
    return columns;
  }

  return (
    <DomRoot>
      {/* 查询条件区域 */}
      <Card>
        <Space>
          <Search
            placeholder="请输入科室名称..."
            enterButton="查询"
            style={{ width: 300 }}
            onSearch={value => onSearch(value)}
          />
          <Button onClick={() => querySrcSchedule()}>刷新号源</Button>
        </Space>
      </Card>
      {/* 表格 */}
      <Card style={{ marginTop: 8 }}>
        {/* 主体周排班模板信息展示 */}
        {srcScheduleList &&
          <Table
            bordered
            size="small"
            columns={tableColumns()}
            dataSource={deptList}
            pagination={false}
            scroll={{ x: 1500, y: 650 }}
          />}
      </Card>
    </DomRoot>
  )
}

export default () => (
  <KeepAlive>
    <View />
  </KeepAlive>
)
