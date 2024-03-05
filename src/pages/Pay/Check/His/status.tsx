import { Modal, Alert, Calendar,Row,Tag } from "antd";
import { useState,useRef,useEffect } from "react";
import { Ajax } from "@/core/trade";
import moment from "moment";
import styles from "../style.module.less";
import _ from "lodash";


export default (props) => {
  const { visible,onClose,merUserInfo ,clickCalendar} = props;
  const [hisStatuses, setHisStatuses] = useState(null);
  //const [date, setDate] = useState([moment().startOf('month').subtract(7,"d").format("YYYY-MM-DD"),moment().endOf('month').add(14,"d").format("YYYY-MM-DD")]);

  const date = useRef(moment());

  // const queryHisStatus = useCallback(() => {
  //   Ajax.Post('PayUrl', '/manage/chkBizStatus.selectStat',
  //     {
  //       startDate: moment(date.current).startOf('month').subtract(7,"d").format('YYYYMMDD'),
  //       endDate: moment(date.current).endOf('month').add(14,"d").format('YYYYMMDD'),
  //       merchantId:merchantId
  //     },
  //     (ret: any) => {
  //       setHisStatuses(ret);
  //     }
  //   );
  // }, [merchantId])
  const queryHisStatus = () => {
    Ajax.Post('PayUrl', '/manage/chkBizStatus.selectStat',
      {
        startDate: moment(date.current).startOf('month').subtract(7, "d").format('YYYYMMDD'),
        endDate: moment(date.current).endOf('month').add(14, "d").format('YYYYMMDD')
      },
      (ret: any) => {
        setHisStatuses(ret.list);
      });
  }

  useEffect(() => {
    queryHisStatus();
  }, []);

  const showBlockContent = (item) => {
    if (item.status === '0')
      return <span><Tag color='green'>收取成功</Tag>{item.merchantName}</span>
    if (item.status === '1')
      return <span><Tag color='red'>收取异常</Tag>{item.merchantName}</span>
    return <span><Tag>无记录</Tag>{item.merchantName}</span>
  }

  const dateCellRender = (value) => {
    // const dateBlock = value.format("YYYYMMDD");
    // if (dateBlock >= moment().format("YYYYMMDD")) return null;
    // let showStatus = null;
    // for (const item of hisStatuses.list) {
    //   if (item.accountDate === dateBlock) {
    //     // 找到到当前日期块
    //     showStatus = item.status;
    //     break;
    //   }
    // }
    // return (
    //   showBlockContent(showStatus)
    // )

  

    if (!hisStatuses) return '';
    const dateBlock = value.format("YYYYMMDD"); // 日期块
    if (dateBlock >= moment().format("YYYYMMDD")) return '';  // 如果是今日以后，显示空日期块
    const blockContent = _.cloneDeep(merUserInfo);
    for (const itemR of hisStatuses) {
      if (itemR.accountDate === dateBlock) {
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
    console.log("merUserInfo:",merUserInfo);
    return (
      <div onClick={() => clickCalendar(dateBlock)}>
        {blockContent.map(item =>
          // eslint-disable-next-line react/jsx-key
          <Row style={{ marginBottom: 1 }}>{showBlockContent(item)}</Row>)}
      </div>
    )


  }

  const onChangeMonth = (e) => {
    date.current = e;
    queryHisStatus();
  }

  return (
    <Modal
      width={1400}
      visible={visible}
      onCancel={onClose}
      closable={false}
      destroyOnClose
      footer={null}
    >
      <Alert message='点击日期块，可回显该天的账单明细' type="info" showIcon />
      {hisStatuses &&
        <Calendar className={styles.calendar} onPanelChange={onChangeMonth} dateCellRender={dateCellRender} />}
    </Modal>
    
     
  )
}