import { useEffect, useRef, useState } from 'react';
import { DomRoot, Ajax, KeepAlive } from '@/components/PageRoot';
import { Card } from 'antd';
import moment from 'moment';
import SmartTop from '@/components/SmartTop';
import SmartTable from '@/components/SmartTable';
import { CheckOutlined, CloseOutlined, LockOutlined, PlusCircleOutlined, UnlockOutlined } from '@ant-design/icons';


const Log = () => {

  const [orderInfoList, setOrderInfoList] = useState(null);
  const TopRef = useRef(null);
  const [deptKV, setDeptKV] = useState(null);
  // 查询条件区域 
  const queryArea: any = useRef({ date: [moment(), moment()] });

  //查询预约记录
  const queryOrderInfo = (params = {}) => {
    const query = { ...queryArea.current, ...params };
    Ajax.Post('AptUrl', '/manage/srcOrderDetail.selectByKey',
      {
        ...query,
        startDate: moment(query.date[0]).format('YYYY-MM-DD'),
        endDate: moment(query.date[1]).format('YYYY-MM-DD'),
        hospitalId: localStorage.getItem('hospitalId'),
      },
      (ret: any) => {
        setOrderInfoList(ret);
      }
    );
  }

  // 查询所有科室
  const queryDepartment = () => {
    Ajax.Post('AptUrl', '/manage/schDept.selectKV',
      {
        hospitalId: localStorage.getItem('hospitalId'),
      },
      (ret: any) => {
        setDeptKV(ret.list);
      }
    );
  }

  //SmartTop点击查询
  const topSubmit = (params = {}) => {
    queryArea.current = params;
    queryOrderInfo(null)
  }

  useEffect(() => {
    queryDepartment();
    queryOrderInfo(null);
  }, []);

  const getFields = () => {
    return [{
      type: 'range-picker',
      style: { width: 250 },
      field: 'date',
      label: '日期',
      required: true,
      initialValue: [moment(), moment()],
    }, {
      type: 'select',
      label: '渠道',
      style: { width: 250 },
      field: 'custId',
      placeholder: '请选择渠道...',
      showSearch: true,
      allowClear: true,
      options: [{
        txt: '窗口-HIS',
        value: '001',
      }, {
        txt: '自助机-源启',
        value: '002',
      }, {
        txt: '微信线上-医依帮',
        value: '003',
      }, {
        txt: '支付宝线上-医依帮',
        value: '005',
      }, {
        txt: '医生工作站-HIS',
        value: '004',
      }, {
        txt: '预约平台-国光',
        value: '007',
      }],
    }, {
      type: 'select',
      label: '科室',
      style: { width: 250 },
      field: 'queryDeptId',
      placeholder: '请选择查询科室...',
      showSearch: true,
      options: deptKV,
      allowClear: true,
    }, {
      type: 'input',
      label: '患者信息',
      style: { width: 250 },
      field: 'keywords',
      placeholder: '请输入患者姓名/就诊号/身份证号/手机号...'
    }, {
      type: 'button',
      buttonList: [
        {
          type: 'primary',
          htmlType: 'submit',
          buttonText: '查询',
          style: { marginLeft: 8 }
        }
      ]
    }
    ]
  }

  //定义表格抬头
  const tableColumns: any = [{
    title: '订单编号',
    dataIndex: 'orderNo',
  }, {
    title: '排班编号',
    dataIndex: 'scheduleId',
  }, {
    title: '号源编号',
    dataIndex: 'sourceId',
  }, {
    title: '预约渠道',
    dataIndex: 'custName',
  }, {
    title: '门诊号',
    dataIndex: 'user_id',
  }, {
    title: '姓名',
    dataIndex: 'user_name',
  }, {
    title: '预约就诊日期',
    dataIndex: 'date',
    render: (text) => (
      text ? text.substring(0, 4) + "-" + text.substring(4, 6) + '-' + text.substring(6) : ''
    )
  }, {
    title: '预约科室',
    dataIndex: 'deptName'
  }, {
    title: '预约号别',
    dataIndex: 'regTypeName'
  }, {
    title: '预约医生',
    dataIndex: 'docName',
    render: (value, row, index) => (
      value ? value : '-'
    )
  }, {
    title: '操作类型',
    dataIndex: 'action',
    render: (text) => (
      //0，解锁；1，锁号；2，预约；3，取消；9，已就诊
      text == "0" ? <span><UnlockOutlined style={{ color: 'blue' }} />&nbsp;解锁</span> :
        (text == "1" ? <span><LockOutlined style={{ color: 'black' }} />&nbsp;锁号</span> :
          (text == "2" ? <span><CheckOutlined style={{ color: 'green' }} />&nbsp;预约</span> :
            (text == "3" ? <span><CloseOutlined style={{ color: 'red' }} />&nbsp;退号</span> :
              <span><PlusCircleOutlined style={{ color: 'green' }} />&nbsp;已就诊</span>)))
    )
  }, {
    title: '操作时间',
    dataIndex: 'createTimeF',
  },
  ]

  return (
    <DomRoot>
      {/* 查询条件区域 */}
      <Card>
        <SmartTop handleSubmit={topSubmit} getFields={getFields} onRef={TopRef}><div /></SmartTop>
      </Card>
      {/* 表格 */}
      <Card style={{ marginTop: 8 }}>
        <SmartTable
          bordered
          dataSource={orderInfoList || []}
          columns={tableColumns}
          handleChange={(params: any) => queryOrderInfo(params)}
        />
      </Card>
    </DomRoot>
  )
}

export default () => (
  <KeepAlive>
    <Log />
  </KeepAlive>
)
