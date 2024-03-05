import { Ajax } from "@/components/PageRoot"
import { Modal, Button, message } from "antd";
import { Descriptions, Image, DatePicker , Input } from 'antd';
import { useState } from "react";
import moment from "moment";

export default (props) => {

  const { visible, onClose, record, onOk } = props;
  const [activeTime, setActiveTime] = useState([moment(), moment().add(1, 'day')]);
  const [showTime, setShowTime] = useState(false);
  const { TextArea } = Input;
  const status = 1 //审核通过时状态值
  let reason = '';
  const account = localStorage.getItem("account");

  const handleUpdCaseBookStatus = async (status , reason) => {
    try {
      Ajax.Post('CareUrl', '/manage/careCard.updCareCardStatus',
        {
          cardId: record?.cardId,
          checkAccount: account,
          reason,
          status,
          activeStartTime: activeTime[0].format('YYYY-MM-DD HH:mm:ss'),
          activeEndTime: activeTime[1].format('YYYY-MM-DD HH:mm:ss'),
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
    setShowTime(true);
  }

  const handleOk = () => {
    if (activeTime === null) {
      message.error("请选择生效时间和失效时间")
    } else {
      handleUpdCaseBookStatus(status,null);
      setShowTime(false);
    }
  }

  const handleCancel = () => {
    setShowTime(false);
  }

  const handleReject = () => {
    Modal.confirm({
      title: '请输入拒绝理由',
      content: (
        <TextArea rows={4} placeholder="不超过100字" maxLength={100} onChange={e => reason = e.target.value}/>
      ),
      onOk: () => {
        handleUpdCaseBookStatus(2 , reason);
      },
      onCancel: () => {},
    });
  }

  const handleStop = () => {
    handleUpdCaseBookStatus(9,null);
  }

  return (
    <Modal
      visible={visible}
      title="患者陪护证登记详情"
      onCancel={onClose}
      destroyOnClose
      footer={null}
      width={960}
    >
      <Descriptions bordered>
        <Descriptions.Item label="住院病区">{record?.wardId}</Descriptions.Item>
        <Descriptions.Item label="住院床号">{record?.bedNo}</Descriptions.Item>
        <Descriptions.Item label="住院号">{record?.patientId}</Descriptions.Item>
        <Descriptions.Item label="患者名称" span={2}>{record?.patientName}</Descriptions.Item>
        <Descriptions.Item label="入院时间">{record?.inTime}</Descriptions.Item>
        <Descriptions.Item label="陪护人姓名">{record?.name}</Descriptions.Item>
        <Descriptions.Item label="陪护人身份证">{record?.idNo}</Descriptions.Item>
        <Descriptions.Item label="陪护人手机号">{record?.phoneNo}</Descriptions.Item>
        <Descriptions.Item label="生效时间" span={2}>{record?.activeStartTime ? record?.activeStartTime : "--"}</Descriptions.Item>
        <Descriptions.Item label="失效时间" span={2}>{record?.activeEndTime ? record?.activeEndTime : "--"}</Descriptions.Item>
        <Descriptions.Item label="陪护人照片信息" span={3}>
          <Image
            src={`${record?.photoPath}`}
            alt="陪护人照片"
            style={{ maxWidth: '100%', maxHeight: '400px', marginRight: '10px' }}
            width={200}
            preview={{
              mask: <div style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }} />,
              maskClassName: 'custom-mask',
            }}
          />
          <Image
            src={`${record?.idPhotoPath}`}
            alt="陪护人身份证照片"
            style={{ maxWidth: '100%', maxHeight: '400px', marginRight: '10px' }}
            width={200}
            preview={{
              mask: <div style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }} />,
              maskClassName: 'custom-mask',
            }}
          />
          <Image
            src={`${record?.checkPhotoPath}`}
            alt="检测报告照片"
            style={{ maxWidth: '100%', maxHeight: '400px' }}
            width={200}
            preview={{
              mask: <div style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }} />,
              maskClassName: 'custom-mask',
            }}
          />
        </Descriptions.Item>

        <Descriptions.Item label="陪护证信息" span={4}>
          创建时间:{record?.createTime}
          <br />
          审核时间:{record?.checkTime}
          <br />
          注销时间:{record?.cancelTime}
          <br />
        </Descriptions.Item>
        <Descriptions.Item label="审核理由">{record?.reason ?record?.reason:"--"}</Descriptions.Item>
      </Descriptions>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '24px' }}>
        <Button type="primary" style={{ marginRight: '16px' }} onClick={handleApprove} disabled={record?.status === 1}>审核通过</Button>
        <Button danger= {true} style={{ marginRight: '16px' }} onClick={handleReject} disabled={record?.status === 1}>审核不通过</Button>
        <Button danger= {true} style={{ marginRight: '16px' }} onClick={handleStop} >停用</Button>
        <Button type="default" style={{ marginRight: '16px' }} onClick={handleApprove} >更新有效时间</Button>
      </div>
      <Modal
        visible={showTime}
        title="请选择生效时间和失效时间"
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <DatePicker.RangePicker
          showTime={true}
          format="YYYY-MM-DD  HH:mm:ss"
          onChange={(value) => setActiveTime(value)}
          defaultValue={[moment(), moment().add(1, 'day')]}
          style={{ width: '100%' }}
          ranges={{
            '今天': [moment(), moment().endOf('day')],
            '本周': [moment().startOf('week'), moment().endOf('week')],
            '本月': [moment().startOf('month'), moment().endOf('month')],
          }}
        />
      </Modal>
    </Modal>
  )
}