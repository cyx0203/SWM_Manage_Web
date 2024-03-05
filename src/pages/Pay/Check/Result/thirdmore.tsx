import { Fragment } from "react";
import { Divider, Empty, Popover } from 'antd';
import Plan from "./thirdmore/plan";
// import Done from "./thirdmore/done";
import Refund from "./thirdmore/refund";
import Balance from "./thirdmore/balance";

export default (props) => {

  const { MoreList, getStatResult, info } = props;

  let MoreListSub = MoreList.filter(item => item.errorType != '0'); //formatPlan、formatMerge和formatRefund共用

  const formatPlan = () => {
    const formatList = [];
    MoreListSub.forEach(item => {
      if (item.payOrRefund === 1 && item.errorType !== '0' && !item.refundOrderIdForAdjust) {
        // 收费 && 帐不平 && 没有退款记录
        formatList.push(item)
      }
    })
    return formatList;
  }

  // const formatDone = () => {
  //   const formatList = [];
  //   MoreList.forEach(item => {
  //     if (item.payOrRefund === '1' && item.errorType !== '0' && item.refundOrderIdForAdjust) {
  //       // 收费 && 帐不平 && 有退款记录
  //       formatList.push(item)
  //     }
  //   })
  //   return formatList;
  // }

  const formatMerge = () => {
    const formatList = [];
    const list = []; //将所有有退款记录的单独放到list中
    MoreListSub.forEach(item => {
      if (item.checkOriginId != '') {
        list.push(item);
      }
    });

    //如果有对应的正记录，就将正负记录一起放到List中
    for (let i = 0; i < MoreListSub.length; i++) {
      let item = MoreListSub[i];
      for (let j = 0; j < list.length; j++) {
        let item2 = list[j];
        if (item.checkId == item2.checkOriginId) {
          item.rowSpan = 2;
          item2.rowSpan = 0;
          formatList.push(item);
          formatList.push(item2);

          //去除该正负记录，避免重复添加
          MoreListSub = MoreListSub.filter(item3 => item3.checkId != item2.checkId)
          MoreListSub = MoreListSub.filter(item3 => item3.checkId != item.checkId)
        }
      }
    }
    return formatList;
  }

  const formatRefund = () => {
    const formatList = [];
    MoreListSub.forEach(item => {
      if (item.payOrRefund === -1 && item.errorType !== '0') {
        // 退费 && 帐不平
        formatList.push(item)
      }
    });
    return formatList;
  }

  const formatBalance = () => {
    if (!MoreList) return [];
    const formatList = [];
    let rightPayOrderId = -1;
    MoreList.forEach((obj) => {
      let row = 0;
      if (obj.errorType === '0') {
        if (rightPayOrderId !== obj.orderTrace) {
          // 如果是新的payOrderId，计算rowSpan值
          MoreList.forEach((obj2) => {
            if (obj.orderTrace === obj2.orderTrace) {
              row += 1;
            }
          });
          rightPayOrderId = obj.orderTrace;
        }
        obj.rowSpan = row;
        formatList.push(obj);
      }
    });
    return formatList;
  }

  const mergeList = formatMerge();
  const planList = formatPlan();
  // const doneList = formatDone();
  const refundList = formatRefund();
  const balanceList = formatBalance();


  return (
    <Fragment>
      {planList.length > 0 &&
        <div style={{ padding: 10 }}>
          <Divider orientation="left">
            <div style={{ color: 'red',fontWeight:'bolder',fontSize:'20px' }}>调账不退款</div>
            {/* <Popover content={<span style={{ color: 'red' }}>长款单边账，待调账(调账不退款)</span>} trigger="hover"> */}
              {info}长款
            {/* </Popover> */}
          </Divider>
          <Plan planList={planList} getStatResult={getStatResult} />
        </div>
      }
      {/* {doneList.length > 0 &&
        <div style={{ padding: 10 }}>
          <Divider orientation="left">已调账</Divider>
          <Done doneList={doneList} />
        </div>
      } */}
      {refundList.length > 0 &&
        <div style={{ padding: 10 }}>
          <Divider orientation="left">{info}退款</Divider>
          <Refund refundList={refundList} getStatResult={getStatResult} />
        </div>
      }

      {mergeList.length > 0 &&
        <div style={{ padding: 10 }}>
          <Divider orientation="left">合并同时有正负记录的{info}明细</Divider>
          <Plan planList={mergeList} getStatResult={getStatResult} />
        </div>
      }

      {balanceList.length > 0 &&
        <div style={{ padding: 10 }}>
          <Divider orientation="left">{info}已调账</Divider>
          <Balance balanceList={balanceList} getStatResult={getStatResult}/>
        </div>
      }
      {planList.length === 0 && mergeList.length === 0 && refundList.length === 0 && balanceList.length === 0 &&
        <Empty description='无多账目记录' />}
    </Fragment>
  );

}