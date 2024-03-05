import { DomRoot, KeepAlive, Ajax } from "@/components/PageRoot"
import { useState, useEffect, useRef } from "react";
import { Card , Modal , Button , Space } from "antd";
import SmartTable from "@/components/SmartTable";
import SmartTop from "@/components/SmartTop";
import moment from "moment";
import Detail from "../Check/detail";
import Edit from "../Access/edit";
import ADDEdit from "../Check/edit";
import utils from "../../utils";

const CareCard = () => {
  const [careCard, setCareCard] = useState(null);
  const [detailVisible,setDetailVisible] = useState(false);
  const [accessRecord, setAccessRecord] = useState(null);
  const [editVisible, setEditVisible] = useState(false);
  const [addVisible, setAddVisible] = useState(false);
  const [accessVisible, setAccessVisible] = useState(false);
  const [accessTableData, setAccessTableData] = useState([]);

  const args: any = useRef({});

  const queryAccessRecord = (params) => {
    const query = { ...args.current, ...params };
    Ajax.Post('CareUrl', '/manage/accessRecord.selAccessRecord',
      {
        ...query,

      },
      (ret: any) => {
        console.log(`setAccessTableData:`,ret);
        setAccessTableData(ret);
      }
    );
  }

  const queryCareCard = (params) => {
    const query = { ...args.current, ...params };

    if(query.date && query.date.length === 2){
      query.startTime = moment(query.date[0]).startOf('day').format('YYYY-MM-DD HH:mm:ss');
      query.endTime = moment(query.date[1]).endOf('day').format('YYYY-MM-DD HH:mm:ss');
      delete query.date;
    }

    Ajax.Post('CareUrl', '/manage/careCard.selCareCard',
      {
        ...query,

      },
      (ret: any) => {
        setCareCard(ret);
      }
    );
  }

  const showAccessStatus = (status) => {
    if (status === 0)
      return <span> 往期记录</span>
    if (status === 1)
      return <span> 当前记录</span>
    return ''
  }

  const showStatus = (status) => {
    if (status === 0)
      return <span > 待审核</span>
    if (status === 1)
      return <span> 审核通过</span>
    if (status === 2)
      return <span> 审核不通过</span>
    if (status === 3)
      return <span> 有效时间内</span>
    if (status === 9)
      return <span> 停用</span>
    return ''
  }

  const searchHandle = (params) => {
    args.current = params;
    queryCareCard(null);
  }

  useEffect(() => {
    queryCareCard(null);
  },[]);


  const getFields = () => {
    return [
      {
        type: 'input',
        style: { width: '180px' },
        placeholder: '请输入患者号',
        field: 'patientId',
        label: '患者号'
      },
      {
        type: 'input',
        style: { width: '180px' },
        placeholder: '请输入患者姓名',
        field: 'patientName',
        label: '患者姓名'
      },
      {
        type: 'input',
        style: { width: '180px' },
        placeholder: '请输入陪护人手机号',
        field: 'phoneNo',
        label: '陪护人手机号'
      },
      {
        type: 'select',
        style: { width: '180px' },
        allowClear: true,
        required: false,
        placeholder: '请输入审核状态',
        options: utils.getCareStatus() ? utils.getCareStatus() : [],
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
      title: '陪护证号',
      dataIndex: 'cardId',
      key: 'cardId',
      width: 150,
      align: 'center'
    },
    {
      title: '住院号',
      dataIndex: 'patientId',
      key: 'patientId',
      width: 150
    },
    {
      title: '患者姓名',
      dataIndex: 'patientName',
      key: 'patientName',
      width: 150,
    },
    {
      title: '陪护姓名',
      dataIndex: 'name',
      key: 'name',
      width: 150
    },
    {
      title: '陪护人身份证号',
      dataIndex: 'idNo',
      key: 'idNo',
      width: 150
    },
    {
      title: '陪护人手机号',
      dataIndex: 'phoneNo',
      key: 'phoneNo',
      width: 150
    },
    {
      title: '生效时间',
      dataIndex: 'activeStartTime',
      key: 'activeStartTime',
      width: 150
    },
    {
      title: '失效时间',
      dataIndex: 'activeEndTime',
      key: 'activeEndTime',
      width: 150
    },
    // {
    //   title: '入院时间',
    //   dataIndex: 'inTime',
    //   key: 'inTime',
    //   width: 150
    // },
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
      title: '操作',
      key: 'action',
      align: 'center',
      width: 200,
      render: (text: any, row: any, index: any) => (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ marginBottom: '8px' }} >
            {row.status === 0 ? (
              <a style={{ marginRight: '8px' }}  onClick={() => { setDetailVisible(true); setCareCard(row); }}>审核</a>
            ) : (
              <a style={{ marginRight: '8px' }}  onClick={() => { setDetailVisible(true); setCareCard(row); }}>查看</a>
            )}
          </div>
          <div>
            <a
              style={{ marginRight: '8px' }}
              onClick={() => {
                setAccessVisible(true);
                setCareCard(row);
                Ajax.Post(
                  'CareUrl',
                  '/manage/accessRecord.selAccessRecord',
                  { cardId: row.cardId },
                  (ret: any) => {
                    setAccessTableData(ret);
                  }
                );
              }}
            >
              出入管理
            </a>
          </div>
        </div>
      ),
    },
  ];

  const accessColumns: any = [
    {
      title: '外出时间',
      dataIndex: 'outTime',
      key: 'outTime',
      width: 150,
    },
    {
      title: '计划回归时间',
      dataIndex: 'planInTime',
      key: 'planInTime',
      width: 150
    },
    {
      title: '实际回归时间',
      dataIndex: 'actualInTime',
      key: 'actualInTime',
      width: 150
    },
    {
      title: '外出理由',
      dataIndex: 'reason',
      key: 'reason',
      width: 150
    },
    {
      title: '有效状态',
      dataIndex: 'accessStatus',
      key: 'accessStatus',
      width: 80,
      render: (text, record) => {
        return {
          children: showAccessStatus(text),
          props: {
            rowSpan: record.rowSpan
          },
        };
      }
    },
    {
      title: '操作',
      key: 'action',
      align: 'center',
      width: 80,
      render: (text: any, row: any, index: any) => (
        <Space size="middle">
          <a style={{ marginRight: '8px' }} onClick={() => { setEditVisible(true); setAccessRecord(row); }}>更新</a>
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
          dataSource={careCard || []}
          columns={columns}
          handleChange={(params: any) => queryCareCard(params)}
        />
      </Card>
      {/* 编辑弹出框 */}
      <Detail
        visible={detailVisible}
        record={careCard}
        onClose={() => {
          setDetailVisible(false);
          queryCareCard(null);
        }}
        onOk={() => {
          setDetailVisible(false);
          queryCareCard(null);
        }}
      />
      {/* 出入时间段管理 */}
      <Modal
        title="出入时间段管理"
        visible={accessVisible}
        width={980}
        onCancel={() => {
          setAccessVisible(false);
          setDetailVisible(false);
          queryCareCard(null);
        }}
        onOk={() => {
          setDetailVisible(false);
          queryCareCard(null);
        }}
        footer={null}
        >
        <div style={{ marginTop: '10px' }}>
          <Button type="primary" style={{ marginRight: '10px' }}
            onClick={() => {
              { setAddVisible(true);  }
            }}
          >
            新增
          </Button>
        </div>
        <SmartTable
          bordered
          dataSource={accessTableData}
          columns={accessColumns}
          handleChange={(params: any) => queryAccessRecord(accessRecord)}
        /> 
      </Modal>
      {/* 编辑弹出框 */}
      <Edit
        visible={editVisible}
        record={accessRecord}
        onClose={() => {
          setEditVisible(false);
          queryAccessRecord(accessRecord);
        }}
        onOk={() => {
          setEditVisible(false);
          queryAccessRecord({cardId:accessRecord.cardId});
        }}
      />
        <ADDEdit
        visible={addVisible}
        record={careCard}
        onClose={() => {
          setAddVisible(false);
          queryAccessRecord(careCard);
        }}
        onOk={() => {
          setAddVisible(false);
          queryAccessRecord(careCard);
        }}
      />

    </DomRoot>
  )
}

export default () => (
  <KeepAlive>
    <CareCard />
  </KeepAlive>
)