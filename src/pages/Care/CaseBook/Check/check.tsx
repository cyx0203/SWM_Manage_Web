import { DomRoot, KeepAlive, Ajax } from "@/components/PageRoot"
import { useState, useEffect, useRef } from "react";
import { Card, Space } from "antd";
import SmartTable from "@/components/SmartTable";
import SmartTop from "@/components/SmartTop";
import moment from "moment";
import Detail from "../Check/detail";
import utils from "../../utils";

const CaseBook = () => {
  const [caseBook, setCaseBook] = useState(null);
  const [detailVisible, setDetailVisible] = useState(false);

  const args: any = useRef({});

  const queryCaseBook = (params) => {
    const query = { ...args.current, ...params };

    if(query.date && query.date.length === 2){
      query.startTime = moment(query.date[0]).startOf('day').format('YYYY-MM-DD HH:mm:ss');
      query.endTime = moment(query.date[1]).endOf('day').format('YYYY-MM-DD HH:mm:ss');
      delete query.date;
    }

    Ajax.Post('CareUrl', '/manage/caseBook.selCaseBook',
      {
        ...query,

      },
      (ret: any) => {
        setCaseBook(ret);
      }
    );
  }

  const showStatus = (status) => {
    if (status === 0)
      return <span > 待审核</span>
    if (status === 1)
      return <span> 审核通过</span>
    if (status === 2)
      return <span> 审核不通过</span>
    if (status === 3)
      return <span> 放弃审核</span>
    return ''
  }

  const searchHandle = (params) => {
    args.current = params;
    queryCaseBook(null);
  }

  useEffect(() => {
    queryCaseBook(null);
  }, []);

  const getFields = () => {
    return [
      {
        type: 'input',
        style: { width: '180px' },
        placeholder: '请输入患者编号',
        field: 'patientId',
        label: '患者编号'
      },
      {
        type: 'input',
        style: { width: '180px' },
        placeholder: '请输入住院编号',
        field: 'inPatientId',
        label: '住院编号'
      },
      {
        type: 'select',
        style: { width: '180px' },
        required: false,
        allowClear: true,
        placeholder: '请输入审核状态',
        options: utils.getCaseStatus() ? utils.getCaseStatus() : [],
        field: 'status',
        label: '审核状态'
      },
      {
        type: 'range-picker',
        style: { width: '100%' },
        label: '申请时间',
        field: 'date',
        initialValue: null,
        required: false,
        showTime: false,
        ranges: {
          '今天': [moment(), moment().endOf('day')],
          '本周': [moment().startOf('week'), moment().endOf('week')],
          '本月': [moment().startOf('month'), moment().endOf('month')],
        },
      },
      {
        type: 'button',
        buttonList: [
          {
            type: 'primary',
            htmlType: 'submit',
            buttonText: '查询',
            style: { marginLeft: '8px' }
          },
          // {
          //   buttonText: '导出',
          //   style: { marginLeft: '8px' },
          //   onClick: () => { }
          // },
        ]
      }
    ]
  }

  const columns: any = [
    {
      title: '患者编号',
      dataIndex: 'patientId',
      key: 'patientId',
      width: 150
    },
    {
      title: '住院号',
      dataIndex: 'inPatientId',
      key: 'inPatientId',
      width: 150,
    },
    {
      title: '申请人姓名',
      dataIndex: 'applyName',
      key: 'applyName',
      width: 150
    },
    {
      title: '申请人手机号',
      dataIndex: 'applyPhoneNo',
      key: 'applyPhoneNo',
      width: 150
    },
    {
      title: '缴费标志',
      dataIndex: 'payFlag',
      key: 'payFlag',
      width: 150,
      render: val => val === "N" ? "否" : "是"
    },
    {
      title: '审核状态',
      dataIndex: 'status',
      key: 'status',
      width: 150,
      render: (text, record) => {
        return {
          children: showStatus(text),
          props: {
            rowSpan: record.rowSpan
          },
        };
      }
    },
    {
      title: '详情',
      key: 'action',
      align: 'center',
      width: 200,
      render: (text: any, row: any, index: any) => (
        <Space size="middle">
          <a style={{ marginRight: '8px' }} onClick={() => { setDetailVisible(true); setCaseBook(row); }}>详情</a>
        </Space>
      ),
    },
  ];

  return (
    <DomRoot>
      {/* 查询条件区域 */}
      <Card>
        <SmartTop handleSubmit={searchHandle} getFields={getFields}><div /></SmartTop>
      </Card>
      {/* 表格 */}
      <Card style={{ marginTop: 8 }}>
        <SmartTable
          bordered
          dataSource={caseBook || []}
          columns={columns}
          handleChange={(params: any) => queryCaseBook(params)}
        />
      </Card>
      {/* 编辑弹出框 */}
      <Detail
        visible={detailVisible}
        record={caseBook}
        onClose={() => {
          setDetailVisible(false);
          queryCaseBook(null);
        }}
        onOk={() => {
          setDetailVisible(false);
          queryCaseBook(null);
        }}
      />
    </DomRoot>
  )
}

export default () => (
  <KeepAlive>
    <CaseBook />
  </KeepAlive>
)