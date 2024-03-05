import { useEffect, useRef, useState } from 'react';
import { DomRoot, Ajax, KeepAlive } from '@/components/PageRoot';
import { Card, Button, Tag, Divider, DatePicker, Tabs, Radio, Modal, Empty } from 'antd';
import { CalendarOutlined } from '@ant-design/icons';
import moment from 'moment';
import Stat from './stat';
import Calendar from './calendar';
import Thirdmore from './thirdmore'
import ReCheck from './recheck'

const { TabPane } = Tabs;

const Result = () => {

  // 查询条件
  const queryDate = useRef(moment().subtract(1, 'days').format('YYYY-MM-DD'));
  const queryMerchantId = useRef(null);

  const [merUserInfo, setMerUserInfo] = useState([]);
  // 查询结果集
  const [checkStatusList, setCheckStatusList] = useState(null);
  const [inOutStat, setInOutStat] = useState(null);
  const [thirdMoreList, setThirdMoreList] = useState([]);
  const [bizMoreList, setBizMoreList] = useState([]);

  const [calendarVisible, setCalendarVisible] = useState(false);
  const [reCheckVisible, setReCheckVisible] = useState(false);

  // 查询对账结果
  const getStatResult = () => {
    Ajax.Post('PayUrl', '/manage/checkResult.getStatResult',
      {
        queryDate: queryDate.current.substring(0, 4) + queryDate.current.substring(5, 7) + queryDate.current.substring(8, 10),
        merchantId: queryMerchantId.current,
      },
      (ret: any) => {
        setCheckStatusList(ret.checkStatusList);//对账结果表中的9个商户的对账结果
        setInOutStat(ret.inOutStat);//统计笔数与总金额，业务和三方共四个
        setThirdMoreList(ret.thirdMoreList);//三方错账
        setBizMoreList(ret.bizMoreList);//业务错账
      }
    );
  }


  // 查询登录用户名能看到的商户号
  const queryMerUserInfo = () => {
    Ajax.Post('PayUrl', '/manage/merUser.selectByUserId',
      {
        account: localStorage.getItem('account'),
      },
      (ret: any) => {
        setMerUserInfo(ret.list);
        if (ret.list && ret.list.length > 0) {
          queryMerchantId.current = ret.list[0].merchantId;
          getStatResult();
        }
      }
    );
  }

  useEffect(() => {
    queryMerUserInfo();
  }, []);

  // 修改查询日期
  const onChangeDate = (date, dateString) => {
    queryDate.current = dateString;
    getStatResult();
  }

  // 修改查询商户号
  const onChangeMerchant = (e) => {
    queryMerchantId.current = e.target.value;
    getStatResult();
  }

  // 显示各商户对账结果
  const getMerchantNameByStatus = (merInfo) => {
    if (!checkStatusList) return null;
    for (const item of checkStatusList) {
      if (item.merchantId === merInfo.merchantId) {
        if (item.status === '0')
          return <span>{merInfo.merchantName}<Tag style={{ marginLeft: 8 }} color='green'>账平</Tag></span>
        if (item.status === '2')
          return <span>{merInfo.merchantName}<Tag style={{ marginLeft: 8 }} color='red'>账不平</Tag></span>
        if (item.status === '1')
          return <span>{merInfo.merchantName}<Tag style={{ marginLeft: 8 }} color='orange'>异常</Tag></span>
      }
      // return <span>{merInfo.merchantName}<Tag style={{ marginLeft: 8 }}>无记录</Tag></span>
    }
    return <span>{merInfo.merchantName}<Tag style={{ marginLeft: 8 }}>无记录</Tag></span>;
  }

  // 点击日期某个日期，回查该日期对账结果
  const clickCalendar = (date) => {
    queryDate.current = `${date.substring(0, 4)}-${date.substring(4, 6)}-${date.substring(6, 8)}`;
    setCalendarVisible(false)
    getStatResult();
  }

  return (
    <DomRoot>
      {/* 查询条件区域 */}
      <Card>
        账单日期：
        <DatePicker style={{ width: 200 }} allowClear={false}
          onChange={onChangeDate}
          defaultValue={moment(queryDate.current, 'YYYY-MM-DD')}
          value={moment(queryDate.current, 'YYYY-MM-DD')} />
        <Button style={{ marginLeft: 20 }} type='primary' onClick={() => setCalendarVisible(true)}><CalendarOutlined />对账结果一览</Button>
        <Button style={{ marginLeft: 20 }} type='primary' onClick={() => { setReCheckVisible(true) }}>重新对账</Button>
      </Card>
      <Card style={{ marginTop: 8 }}>
        {/* 商户选择 */}
        <h3>商户选择：
          <Radio.Group value={queryMerchantId.current} onChange={onChangeMerchant}>
            {merUserInfo && merUserInfo.map(item =>
              <Radio key={item.merchantId} value={item.merchantId}>{getMerchantNameByStatus(item)}</Radio>)}
          </Radio.Group>
        </h3>
        <Divider />
        {/* 显示三方渠道、业务（HIS）的入账、出账的笔数、金额 */}
        {inOutStat && <Stat inOutStat={inOutStat} />}
        <Divider />
        {/* 显示平台多账 */}
        <Tabs defaultActiveKey="1">
          <TabPane tab='渠道多账目明细' key="1">
            {thirdMoreList && thirdMoreList.length > 0 ?  <Thirdmore MoreList={thirdMoreList} getStatResult={getStatResult} info={'渠道'}/> : <Empty/>}
          </TabPane>
          <TabPane tab="医院多账目明细" key="2">
            {/* <Hismore /> */}
            {bizMoreList && bizMoreList.length > 0 ?  <Thirdmore MoreList={bizMoreList}  getStatResult={getStatResult} info={'业务'}/> : <Empty/>}
          </TabPane>
        </Tabs>
      </Card>
      {/* 对账结果一览 */}
      <Modal
        width={1400}
        visible={calendarVisible}
        onCancel={() => setCalendarVisible(false)}
        closable={false}
        destroyOnClose
      >
        <Calendar clickCalendar={date => clickCalendar(date)} merUserInfo={merUserInfo} />
      </Modal>

      {/* 重新对账 */}
      <Modal
        width='40%'
        title='编辑重新对账'
        visible={reCheckVisible}
        onCancel={() => setReCheckVisible(false)}
        footer={null}
        destroyOnClose
      >
        <ReCheck
          onSuccess={() => {
            setReCheckVisible(false);
          }}
        />
      </Modal>
    </DomRoot>
  )
}

export default () => (
  <KeepAlive>
    <Result />
  </KeepAlive>
)
