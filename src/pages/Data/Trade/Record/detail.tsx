import { Modal } from "antd";
export default (props) => {

  const { visible, devId, onClose,record } = props;

  const spanTab: any = {
    wordBreak: 'normal',
    width: 'auto',
    display: 'block',
    whiteSpace: 'pre-wrap',
    wordWrap: 'break-word',
    overflow: 'hidden',

    marginTop: '10px',
    fontSize: '13px'
  };

  const titleCss = {
    fontWeight: 'bold',
  }

  const hrCss = {
    marginTop: '20px',
    marginBottm: '20px',
    border: '0'
  }

  return (
    <Modal
      visible={visible}
      title="交易详情"
      onCancel={onClose}
      destroyOnClose
      footer={null}
    >
      <div>

        <h4 style={titleCss}>患者信息</h4>
        <span style={spanTab}>姓名：{record.patName}</span>
        <span style={spanTab}>身份证号：{record.patIdno}</span>
        <span style={spanTab}>患者ID：{record.patId}</span>
        <span style={spanTab}>诊疗卡号：{record.cardNo}</span>
        <span style={spanTab}>身份类别：{record.patTypeName}</span>
        {/* <span style={spanTab}>银行卡号：{record.bankcardNo}</span> */}

        <hr style={hrCss}></hr>

        <h4 style={titleCss}>交易信息</h4>
        <span style={spanTab}>交易时间：{record.dateTime}</span>
        <span style={spanTab}>交易渠道：{record.channelName}</span>
        <span style={spanTab}>交易类型：{record.trdTypeName}</span>
        <span style={spanTab}>支付方式：{record.payTypeName}</span>
        <span style={spanTab}>客户端流水号：{record.payClientNo}</span>
        <span style={spanTab}>交易订单流水号：{record.payOrderNo}</span>
        <span style={spanTab}>支付方流水号：{record.paySeqNo}</span>
        <span style={spanTab}>自费金额：{Number(record.amt).toFixed(2)}元</span>
        <span style={spanTab}>医保个人账户支付：{Number(record.socAmt).toFixed(2)}元</span>
        <span style={spanTab}>医保统筹金额：{Number(record.poolAmt).toFixed(2)}元</span>
        <span style={spanTab}>交易结果：{record.staName}</span>
        <span style={spanTab}>HIS信息：{record.hisMsg}</span>

        <hr style={hrCss}></hr>

        <h4 style={titleCss}>设备信息</h4>
        <span style={spanTab}>设备编号：{record.devId}</span>
        <span style={spanTab}>HIS操作员号：{record.hisNo}</span>
      </div>
    </Modal>
   
  )
}
