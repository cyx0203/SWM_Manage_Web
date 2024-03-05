import { Ajax } from "@/components/PageRoot";
import { Modal, Button, message } from "antd";
import { Descriptions, Image, Input, Checkbox, Col, Row } from 'antd';
import './index.moudle.less'

export default (props) => {
  
  const { visible, onClose, record, onOk } = props;
  const account = localStorage.getItem("account");
  const { TextArea } = Input;
  let printNum = 1;
  let reason = '';
  const status = 1 //审核通过时状态值

  const handleUpdCaseBookStatus = async (status, reason) => {
    try {
      Ajax.Post('CareUrl', '/manage/caseBook.updCaseBookStatus',
        {
          id: record?.id,
          checkAccount: account,
          printNum,
          reason,
          status
        }
        , (ret: any) => {
          message.success('操作成功');
          onOk(true); // 关闭弹窗并刷新数据
        }
      );
    } catch (error) {
      console.log(error);
    }
  };

  const handlehisCommit = async () => {
    try {
      Ajax.Post('CareUrl', '/healthcare-manage/caseBook/pricing',
        {
          id: record?.id,
          account: account,
          printNum,
          reason: null,
        }
        , (ret: any) => {
          message.success('操作成功');
          onOk(true); // 关闭弹窗并刷新数据
        }
      );
    } catch (error) {
      console.log(error);
    }
  };

  const handleApprove = () => {
    if (record?.status === 1) {
      message.warning('该记录已审核通过，无法再次操作');
    } else {
      Modal.confirm({
        title: '请输入打印张数',
        content: (
          <input type="number" min={1} defaultValue={1} onChange={e => printNum = parseInt(e.target.value)} />
        ),
        onOk: () => {
          // 发送his划价
          handlehisCommit();
        },
        onCancel: () => { },
      });
    }
  }

  const handleReject = () => {
    if (record?.status === 1) {
      message.warning('该记录已审核通过，无法再次操作');
    } else {
      Modal.confirm({
        title: '请输入拒绝理由',
        content: (
          <TextArea rows={4} placeholder="不超过100字" maxLength={100} onChange={e => reason = e.target.value} />
        ),
        onOk: () => {
          handleUpdCaseBookStatus(2, reason);
        },
        onCancel: () => { },
      });
    }
  }
  
  const caseType = (record?.caseType || '').split(',');
  
  return (
    <Modal
      visible={visible}
      title="病案复印预约登记详情"
      onCancel={onClose}
      destroyOnClose
      footer={null}
      width={960}
    >
      <Descriptions bordered>
        <Descriptions.Item label="住院病区">{record?.wardId}</Descriptions.Item>
        <Descriptions.Item label="住院床号">{record?.bedNo}</Descriptions.Item>
        <Descriptions.Item label="患者编号">{record?.patientId}</Descriptions.Item>
        <Descriptions.Item label="住院号">{record?.inPatientId}</Descriptions.Item>
        <Descriptions.Item label="申请时间">{record?.createTime}</Descriptions.Item>
        <Descriptions.Item label="打印张数">{record?.printNum ? record?.printNum : "--"}</Descriptions.Item>
        <Descriptions.Item label="入院时间">{record?.inTime ? record?.inTime : "--"}</Descriptions.Item>
        <Descriptions.Item label="出院时间">{record?.outTime ? record?.outTime : "--"}</Descriptions.Item>
        <Descriptions.Item label="申请人姓名">{record?.applyName}</Descriptions.Item>
        <Descriptions.Item label="申请人身份证号" span={2}>{record?.applyId}</Descriptions.Item>
        <Descriptions.Item label="申请人手机号">{record?.applyPhoneNo}</Descriptions.Item>
        <Descriptions.Item label="申请人身份照片信息" span={3}>
          <Image
            src={`${record?.applyPhotoPath}`}
            alt="陪护人照片"
            style={{ maxWidth: '100%', maxHeight: '400px', marginRight: '10px' }}
            width={200}
            preview={{
              mask: <div style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }} />,
              maskClassName: 'custom-mask',
            }}
          />
          <Image
            src={`${record?.idFrontPath}`}
            alt="身份证正面"
            style={{ maxWidth: '100%', maxHeight: '400px', marginRight: '10px' }}
            width={200}
            preview={{
              mask: <div style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }} />,
              maskClassName: 'custom-mask',
            }}
          />
          <Image
            src={`${record?.idBackPath}`}
            alt="身份证反面"
            style={{ maxWidth: '100%', maxHeight: '400px' }}
            width={200}
            preview={{
              mask: <div style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }} />,
              maskClassName: 'custom-mask',
            }}
          />
        </Descriptions.Item>
        <Descriptions.Item label="收件信息" span={4}>
          收件人姓名:{record?.recipientName}
          <br />
          收件人手机号:{record?.recipientPhoneNo}
          <br />
          收件人城市:{record?.recipientCity}
          <br />
          收件人详细地址:{record?.recipientAddress}
          <br />
          收件人邮编:{record?.recipientPostalCode}
          <br />
        </Descriptions.Item>
        <Descriptions.Item label="病案类型列表" span={4}>
          <Checkbox.Group style={{ width: '100%' }} value={caseType} disabled className="caseType">
            <Row>
              <Col span={8}>
                <Checkbox value="0">全套病案</Checkbox>
              </Col>
              <Col span={8}>
                <Checkbox value="1">出院记录</Checkbox>
              </Col>
              <Col span={8}>
                <Checkbox value="2">住院志(入院记录)</Checkbox>
              </Col>
              <Col span={8}>
                <Checkbox value="3">手术及麻醉记录单</Checkbox>
              </Col>
              <Col span={8}>
                <Checkbox value="4">病理报告</Checkbox>
              </Col>
              <Col span={8}>
                <Checkbox value="5">医学影像检查资料</Checkbox>
              </Col>
              <Col span={8}>
                <Checkbox value="6">化验单(检验报告)</Checkbox>
              </Col>
              <Col span={8}>
                <Checkbox value="7">医嘱单</Checkbox>
              </Col>
              <Col span={8}>
                <Checkbox value="8">护理记录</Checkbox>
              </Col>
              <Col span={8}>
                <Checkbox value="9">体温单</Checkbox>
              </Col>
              <Col span={8}>
                <Checkbox value="10">病案首页</Checkbox>
              </Col>
              <Col span={8}>
                <Checkbox value="11">住院证</Checkbox>
              </Col>
            </Row>
          </Checkbox.Group>
        </Descriptions.Item>
        <Descriptions.Item label="审核理由"span={4}>{record?.reason ? record?.reason : "--"}</Descriptions.Item>
      </Descriptions>

      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '24px' }}>
        <Button type="primary" style={{ marginRight: '16px' }} onClick={handleApprove} disabled={record?.status === 1}>审核通过</Button>
        <Button danger={true} onClick={handleReject} disabled={record?.status === 1}>审核不通过</Button>
      </div>
    </Modal>
  )
}