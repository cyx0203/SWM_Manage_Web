import { useEffect, useRef, useState, Fragment } from "react";
import { Ajax } from '@/components/PageRoot';
import { Tag, Row, Alert, Calendar, Popover } from 'antd';
import moment from 'moment';

export default (props) => {

  const { clickCalendar, merUserInfo } = props;
  const dateArray= []; //存储status表有记录的日期
  const queryMonth = useRef(moment().format("YYYYMM"));
  const [checkResultList, setCheckResultList] = useState([]);

  const getDate = (n, month) => {
    let dateOrg;
    if (n > 0) {
      dateOrg = month.substring(4, 6) === "02" ? `${month.substring(0, 4)}-${month.substring(4, 6)}-28` : `${month.substring(0, 4)}-${month.substring(4, 6)}-30`;
    }
    else {
      dateOrg = `${month.substring(0, 4)}-${month.substring(4, 6)}-01`;
    }
    const date = new Date(dateOrg);
    date.setDate(date.getDate() + n);
    let mm = date.getMonth() + 1;
    if (mm.toString().length < 2) {
      mm = `0${mm}`;
    }
    let dd = date.getDate();
    if (dd.toString().length < 2) {
      dd = `0${dd}`;
    }
    return date.getFullYear().toString() + mm.toString() + dd.toString();
  }

  // 查询登录用户名能看到的商户号
  const queryCheckResult = () => {
    Ajax.Post('PayUrl', '/manage/chkResultStatus.selectAll',
      {
        startDate: getDate(-7, queryMonth.current),
        endDate: getDate(14, queryMonth.current),
      },
      (ret: any) => {
        setCheckResultList(ret.list)
      }
    );
  }

  useEffect(() => {
    queryCheckResult();
  }, []);

  // 点击日期块
  const onChangeMonth = (e) => {
    queryMonth.current = e.format("YYYYMM");
    queryCheckResult();
  };

  const showBlockContent = (item) => {
    if (item.status === '0')
      // return <span><Tag color='green'>帐平</Tag>{item.merchantName}</span>
      return ''
    if (item.status === '2')
      return <span><Tag color='red'>帐不平</Tag>{item.merchantName}</span>
    if (item.status === '1')
      return <span><Tag color='orange'>异常</Tag>{item.merchantName}</span>
    return <span><Tag>无记录</Tag>{item.merchantName}</span>
  }

  

  const dateCellRender = (value) => {
    if (!checkResultList) return '';
    const dateBlock = value.format("YYYYMMDD"); // 日期块
    if (dateBlock >= moment().format("YYYYMMDD")) return '';  // 如果是今日以后，显示空日期块
    const blockContent = merUserInfo;
    for (const itemR of checkResultList) {
      if (itemR.accountDate === dateBlock) {
        //重复的不添加
        if(dateArray.indexOf(dateBlock) == -1){
          dateArray.push(dateBlock);
        }
        // 找到到当前日期块
        for (const itemB of blockContent) {
          if (itemB.merchantId === itemR.merchantId) {
            // 找到商户 
            itemB.status = itemR.status;
            break;
          }
        }
        // break;
      }
    }
    return (
      <div onClick={() => clickCalendar(dateBlock)}>
        {/* 如果status全为0，表示所有账全平 */}
        {blockContent.some(function (value, index) {
          return value.status !== '0';
        }) ?
        // status表中有当天的记录就显示账不平，没有就显示无记录
        (dateArray.indexOf(dateBlock) >= 0 ?
          (<Popover 
            content={blockContent.map(item => <Row style={{ marginBottom: 1 }}>{showBlockContent(item)}</Row>)} 
            trigger="hover">
              <Row style={{ marginTop: 20,marginLeft:25 }}><span><Tag color='red' style={{fontSize:'20px'}} >当日账不平</Tag></span></Row>
          </Popover>) : 
          (<Row style={{ marginTop: 20,marginLeft:25 }}><span><Tag style={{fontSize:'20px'}} >当日无记录</Tag></span></Row>)
        )
          : 
          (dateArray.indexOf(dateBlock) >= 0 ?
          (<Row style={{ marginTop: 20,marginLeft:25 }}><span><Tag color='green' style={{fontSize:'20px'}}>当日账全平</Tag></span></Row>) : 
          (<Row style={{ marginTop: 20,marginLeft:25 }}><span><Tag style={{fontSize:'20px'}} >当日无记录</Tag></span></Row>)
        )
          
        }
      </div>
    )
  }

  return (
    checkResultList ?
      <Fragment>
        <Alert message='1.点击日期块，可回显该天的对账结果明细  2.悬浮在当日账不平上，可回显该天的账不平明细' type="info" showIcon />
        <Calendar onPanelChange={onChangeMonth} dateCellRender={dateCellRender} />
      </Fragment> : null
  );

}