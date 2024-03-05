import { DomRoot, KeepAlive, Ajax } from "@/components/PageRoot"
import { useState, useEffect, useRef } from "react";
import { Card, Layout, Tree,Space } from "antd";
import { DownOutlined } from "@ant-design/icons";
import SmartTable from "@/components/SmartTable";
import SmartTop from "@/components/SmartTop";
import moment from "moment";
import { add } from "../../utils";
import Detail from "./detail";

const Record = () => {
  const [records, setRecords] = useState(null);
  const [channels, setChannels] = useState(null);
  const [payTypes, setPayTypes] = useState(null);
  const [trdTypes, setTrdTypes] = useState(null);
  const [statuses, setStatuses] = useState(null);
  const [branchTree, setBranchTree] = useState(null);
  const [detailVisible, setDetailVisible] = useState(false);
  const [record, setRecord] = useState(false);

  const args: any = useRef({ date: [moment(), moment()] });
  const hospitalId: any = useRef(localStorage.getItem('hospitalId'));
  const branchList: any = useRef(null);
  const hospitalLevel = localStorage.getItem("hospitalLevel");
  //机构树
  const queryHospBranch = () => {
    if (hospitalLevel === "1") {
      Ajax.Post('DataUrl', '/manage/tree/hospital.selectForTree',
        {
          hospitalId: localStorage.getItem("hospitalId"),
          root: localStorage.getItem("hospitalId"),
          id: "id",
          parentid: "parId",
          childName: 'children',
          retKey: 'branchTree'
        },
        (ret: any) => {
          setBranchTree(ret.branchTree);
        }
      );
    } else {
      Ajax.Post('DataUrl', '/manage/tree/hospBranch.selectList',
        {
          hospitalId: localStorage.getItem("hospitalId"),
          root: "0000",
          id: "id",
          parentid: "par_id",
          childName: 'children',
          retKey: 'branchTree'
        },
        (ret: any) => {
          setBranchTree(ret.branchTree);
        }
      );
    }
  }

  //查询渠道
  const queryChannel = () => {
    Ajax.Post('DataUrl', '/manage/kv/platChannel.selectAll',
      {
        key: 'id',       // key名称
        value: 'name',   // value名称
        hospitalId: localStorage.getItem('hospitalId'),
        retKey: 'channels'
      },
      (ret: any) => {
        console.log(ret)
        setChannels(ret.channels)
      }
    );
  }

  //查询支付方式
  const queryPayType = () => {
    Ajax.Post('DataUrl', '/manage/kv/code.selectByParId',
      {
        key: 'value',       // key名称
        value: 'txt',   // value名称
        parId: 'ZFQD',
        retKey: 'payTypes'
      },
      (ret: any) => {
        console.log(ret)
        setPayTypes(ret.payTypes);
      }
    );
  }

  //交易类型
  const queryTrdType = () => {
    Ajax.Post('DataUrl', '/manage/kv/code.selectByParId',
      {
        key: 'value',       // key名称
        value: 'txt',   // value名称
        parId: 'JY',
        retKey: 'trdTypes'
      },
      (ret: any) => {
        setTrdTypes(ret.trdTypes);
      }
    );
  }

  //交易结果
  const queryStatuses = () => {
    Ajax.Post('DataUrl', '/manage/kv/code.selectByParId',
      {
        key: 'value',       // key名称
        value: 'txt',   // value名称
        parId: 'RS',
        retKey: 'statuses'
      },
      (ret: any) => {
        setStatuses(ret.statuses);
      }
    );
  }

  const queryRecords = (params) => {
    const query = { ...args.current, ...params };
    Ajax.Post('DataUrl', '/transRecord',
      {
        ...query,
        hospitalId: hospitalId.current,
        branchList: branchList.current,
        startDate: query.date && moment(query.date[0]).format('YYYYMMDD'),
        endDate: query.date && moment(query.date[1]).format('YYYYMMDD')
      },
      (ret: any) => {
        setRecords(ret);
      }
    );
  }

  const searchHandle = (params) => {
    args.current = params;
    queryRecords(null);
  }

  useEffect(() => {
    queryChannel();
    queryPayType();
    queryTrdType();
    queryStatuses();
    queryHospBranch();
    queryRecords(null);
  },[]);


  const getFields = () => {
    return [
     {
        type: 'range-picker',
        style: { width: '250px' },
        field: 'date',
        label: '日期',
        initialValue: [moment(), moment()],
      },
      {
        type: 'select',
        label: '交易渠道',
        style: { width: '180px' },
        field: 'channel',
        options: channels ? channels.tv : [],
        placeholder: '请选择交易渠道',
        allowClear: true,
      },
      {
        type: 'input',
        style: { width: '180px' },
        placeholder: '患者编号',
        field: 'patId',
        label: '患者编号'
      },
      {
        type: 'input',
        style: { width: '180px' },
        placeholder: '请输入设备编号',
        field: 'devId',
        label: '设备编号'
      },
      {
        type: 'input',
        style: { width: '180px' },
        placeholder: '请输入订单流水号',
        field: 'payOrderNo',
        label: '订单流水号'
      },
      {
        type: 'select',
        style: { width: '180px' },
        placeholder: '请选择支付方式',
        field: 'payType',
        label: '支付方式',
        options: payTypes ? payTypes.tv : [],
        allowClear: true
      },
      {
        type: 'select',
        style: { width: '180px' },
        placeholder: '请选择交易类型',
        field: 'trdType',
        label: '交易类型',
        options: trdTypes ? trdTypes.tv : [],
        allowClear: true
      },
      {
        type: 'select',
        style: { width: '180px' },
        placeholder: '请选择交易结果',
        field: 'status',
        label: '交易结果',
        options: statuses ? statuses.tv : [],
        allowClear: true
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
      title: '交易时间',
      dataIndex: 'dateTime',
      key: 'dateTime',
      width: 200
    },
    {
      title: '操作员号',
      dataIndex: 'devId',
      key: 'devId',
      width: 150
    },
    {
      title: '交易类型',
      dataIndex: 'trdTypeName',
      key: 'trdTypeName',
      width: 150,
    },
    {
      title: '患者编号',
      dataIndex: 'patId',
      key: 'patId',
      width: 150
    },
    {
      title: '患者姓名',
      dataIndex: 'patName',
      key: 'patName',
      width: 150
    },
    {
      title: '支付方式',
      dataIndex: 'payTypeName',
      key: 'payTypeName',
      width: 150,
    },
    {
      title: '自费金额(元)',
      dataIndex: 'amt',
      key: 'amt',
      width: 150,
      render: val => <span>{(val * 0.01).toFixed(2)}</span>
    },
    {
      title: '交易总额(元)',
      dataIndex: '',
      width: 150,
      render: (val,row: any) => <span>{add(add(row.poolAmt,row.socAmt),row.amt)}</span>
    },
    {
      title: '操作流水号',
      dataIndex: 'payClientNo',
      key: 'payClientNo',
      width: 150
    },
    {
      title: '交易结果',
      dataIndex: 'staName',
      key: 'staName',
      width: 150
    },
    {
      title: '操作',
      key: 'action',
      align: 'center',
      width: 200,
      render: (text: any, row: any, index: any) => (
        <Space size="middle">
          <a style={{ marginRight: '8px' }} onClick={() => { setDetailVisible(true); setRecord(row); }}>详情</a>
        </Space>
      ),
    },
  ];

  const onBranchTreeSelect = (value,info) => {
    console.log(value,info);
    if (hospitalLevel === "1") {
      hospitalId.current = value[0];
    } else {
      branchList.current = value[0];
    }
    queryRecords(null);
  }

  return (
    <DomRoot>
      {/* 查询条件 */}
      <Card>
        <SmartTop handleSubmit={searchHandle} getFields={getFields}><div /></SmartTop>
      </Card>

      {/* 查询状态 */}
      <Layout style={{ margin: 8 }}>
        <Layout.Sider style={{ background: '#fff', }}>
          {branchTree && <Tree
            showLine
            switcherIcon={<DownOutlined />}
            defaultExpandAll={true}
            onSelect={onBranchTreeSelect}
            treeData={branchTree}
          />}
        </Layout.Sider>
        <Layout.Content style={{ background: '#F0F2F5', marginLeft: 8 }}>
          <Card>
            <SmartTable
              bordered
              dataSource={records || []}
              columns={columns}
              handleChange={(params: any) => queryRecords(params)}
            />
          </Card>
        </Layout.Content>
      </Layout>
      <Detail
        visible={detailVisible}
        record={record}
        onClose={() => setDetailVisible(false)}
        onOk={() => {
          setDetailVisible(false);
        }}
      />
    </DomRoot>
  )
}

export default () => (
  <KeepAlive>
    <Record />
  </KeepAlive>
)