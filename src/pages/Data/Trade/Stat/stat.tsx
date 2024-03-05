import { DomRoot, KeepAlive, Ajax } from "@/components/PageRoot";
import { Card } from "antd";
import SmartTop from "@/components/SmartTop";
import moment from "moment";
import { useEffect, useState, useRef } from "react";
import { statWays } from "../../utils";
import SmartTable from "@/components/SmartTable";

const Stat = () => {
  const [stats, setStats] = useState(null);
  const [channels, setChannels] = useState(null);
  const [hospitals, setHospitals] = useState(null);
  const [payTypes, setPayTypes] = useState(null);
  const [trdTypes, setTrdTypes] = useState(null);

  const apps = JSON.parse(localStorage.getItem("codeKV")).XM;
  const hospitalId = useRef(localStorage.getItem('hospitalId'));
  const type = useRef("2");
  const channel = useRef(null);
  const app = useRef(null);
  const date = useRef([moment(new Date()).subtract(1, 'days'), moment(new Date()).subtract(1, 'days')]);
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
        setChannels(ret.channels)
      }
    );
  }
  //查询医院
  const queryHospital = () => {
    Ajax.Post('DataUrl', '/manage/tree/hospital.selectForTree',
      {
        hospitalId: localStorage.getItem("hospitalId"),
        root: localStorage.getItem("hospitalId"),
        id: "id",
        parentid: "parId",
        childName: 'children',
        retKey: 'hospitals'
      },
      (ret: any) => {
        setHospitals(ret.hospitals);
      }
    );
  }

  //查询支付方式
  const queryPayType = () => {
    Ajax.Post('DataUrl', '/manage/kv/code.selectByParId',
      {
        key: 'value',       // key名称
        value: 'txt',   // value名称
        parId: 'ZF',
        retKey: 'payTypes'
      },
      (ret: any) => {
        setPayTypes(ret.payTypes);
      }
    );
  }

  //查询交易方式
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

  const queryStat = (params) => {
    Ajax.Post('DataUrl', '/manage/trdStat.statistics',
      {
        hospitalId: hospitalId.current,
        type: type.current,
        channel: channel.current,
        app: app.current,
        startDate: moment(date.current[0]).format('YYYYMMDD'),
        endDate: moment(date.current[1]).format('YYYYMMDD')
      },
      (ret: any) => {
        const sts = {};
        const stses = [];
        if (ret.list.length > 0) {
          ret.list.map((item) => {
            sts[item.hospitalId + item.devId] = {...sts[item.hospitalId + item.devId],...item};
            // sts[item.hospitalId + item.devId].channel = item.channel;
            // sts[item.hospitalId + item.devId].app = item.app;
            // sts[item.hospitalId + item.devId].devId = item.devId;
            sts[item.hospitalId + item.devId][item.statTag + "_sumFee"] = item.sumFee;
            sts[item.hospitalId + item.devId][item.statTag + "_countOk"] = item.countOk;

          });
          for (const k in sts) {
            stses.push(sts[k]);
          }
          ret.list = stses;
        }
        setStats(ret);
      }
    );
  }

  useEffect(() => {
    queryHospital();
    queryChannel();
    queryPayType();
    queryTrdType();
    queryStat(null);
  }, []);


  const getFields = () => {
    return [
      {
        type: 'range-picker',
        style: { width: '250px' },
        field: 'date',
        label: '日期',
        initialValue: [moment(new Date()).subtract(1, 'days'), moment(new Date()).subtract(1, 'days')],
        disabledDate: (current) => current && current >= moment(new Date()).subtract(1, 'days').endOf('day'),
        allowClear: false
      },
      {
        type: 'treeselect',
        label: '医院',
        style: { width: '250px' },
        field: 'hospitalId',
        treeData: hospitals || [],
        treeDefaultExpandAll: true,
        placeholder: '请选择医院',
        allowClear: true,
        initialValue: localStorage.getItem("hospitalId")
      },
      {
        type: 'select',
        label: '统计类型',
        style: { width: '250px' },
        field: 'type',
        options: statWays(),
        placeholder: '请选择统计类型',
        initialValue: '2'
      },
      {
        type: 'select',
        label: '业务渠道',
        style: { width: '250px' },
        field: 'channel',
        options: channels ? channels.tv : [],
        placeholder: '请选择渠道',
        allowClear: true
      },
      {
        type: 'select',
        label: '项目',
        style: { width: '250px' },
        field: 'app',
        options: apps ?? [],
        placeholder: '请选择项目',
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

  const getColumns = () => {
    const columns = [];
    columns.push(
    //   {
    //   title: '渠道',
    //   dataIndex: 'channel',
    //   key: 'channel',
    //   render: (d) => d === 'al' ? <span>-</span> :<span>{channels?.kv[d]}</span>

    // }, {
    //   title: '项目',
    //   dataIndex: 'app',
    //   key: 'app',
    //   render: (d) => d === 'al' ? <span>-</span>:<span>{apps?.kv[d]}</span>
    // },
      {
      title: '设备编号',
      dataIndex: 'devId',
      key: 'devId',

    });
    if (type.current === "1" && payTypes != null) {
      payTypes.tv.map((item) => {
        columns.push({
          title: item.txt,
          children: [{
            title: '支付金额(元)',
            dataIndex: `${item.value}_sumFee`,
            key: 'sumFee',
            width: 100,
            align: 'right',
            render: (value, row) => value ? <span style={{color:'red'}}>{value}</span> : <span>0</span>
          }, {
            title: '总笔数',
            dataIndex: `${item.value}_countOk`,
            key: 'countOk',
            width: 100,
            align: 'right',
            render: (value, row) => value ? <span style={{color:'red'}}>{value}</span> : <span>0</span>
          }
          ]
        });
      });
    } else if (type.current === "2" && trdTypes != null) {
      trdTypes.tv.map((item) => {
        columns.push({
          title: item.txt,
          children: [{
            title: '支付金额(元)',
            dataIndex: `${item.value}_sumFee`,
            key: 'sumfee',
            width: 100,
            align: 'right',
            render: (value, row) => value ? <span style={{color:'red'}}>{value}</span> : <span>0</span>
          }, {
            title: '总笔数',
            dataIndex: `${item.value}_countOk`,
            key: 'countOk',
            width: 100,
            align:'right',
            render: (value, row) => value ? <span style={{color:'red'}}>{value}</span> : <span>0</span>
          }
          ]
        });
      });
    }
    return columns;

  }

  const searchHandle = (params) => {
    hospitalId.current = params.hospitalId;
    type.current = params.type;
    date.current = params.date;
    channel.current = params.channel;
    app.current = params.app;
    queryStat(null);
  }

  return (
    <DomRoot>
      {/* 查询条件 */}
      <Card>
        <SmartTop handleSubmit={searchHandle} getFields={getFields}><div /></SmartTop>
      </Card>
      <Card>
        <SmartTable
          bordered
          dataSource={stats || []}
          columns={getColumns()}
          // scroll={{x:'true'}}
          handleChange={(params: any) => queryStat(params)}
        />
      </Card>
    </DomRoot>
  );
};

export default () => (
  <KeepAlive>
    <Stat />
  </KeepAlive>
)