import { DomRoot, KeepAlive, Ajax } from "@/components/PageRoot";
import { Card, Row, Col, Checkbox, Layout,Tree,Tag, Tooltip, message, Button } from "antd";
import { useEffect, useRef, useState } from "react";
import moment from "moment";
import { DownOutlined, PoweroffOutlined,BarsOutlined } from "@ant-design/icons";
import Detail from "./detail";

const DevList = () => {
  const [desState2001List, setDesState2001List] = useState(null);
 
  const [devMonitorList, setDevMonitorList] = useState(null);
  const [updateTime, setUpdateTime] = useState(moment().format("YYYY年MM月DD日 HH时mm分ss秒"));
  const [branchTree, setBranchTree] = useState(null);
  const [detailVisible, setDetailVisible] = useState(false);
  const [clickDevId, setClickDevId] = useState(null);
  const [devStateDetailList, setDevStateDetailList] = useState(null);

  const queryState: any = useRef(['0', '2', '4', '5', '6', '7', '9']);
  const args: any = useRef(null);
  const hospitalLevel = localStorage.getItem("hospitalLevel");
  //机构树
  const queryHospBranch = () => {
    console.log(hospitalLevel)
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
  
  //查询设备总状态
  const queryDesState = () => {
    Ajax.Post('DataUrl', '/manage/desState.selectAll',
      {
        cat2001: true
      },
      (ret: any) => {
        const st = [{

        }];
        setDesState2001List(ret.list);
      }
    );
  }

  const queryDevList = (params) => {
    const query = { ...args.current, ...params };
    Ajax.Post('DataUrl', '/manage/dev.selectDevListWithState',
      {
        hospitalId: localStorage.getItem('hospitalId'),
        stateList: queryState.current.length === 0 ? null : queryState.current,
        ...query
      },
      (ret: any) => {
        setDevMonitorList(ret.list);
        setUpdateTime(moment().format("YYYY年MM月DD日 HH时mm分ss秒"));
      }
    );
  }

 
  const queryDetailState = (devId) => {
    if (devId) {
      Ajax.Post('DataUrl', '/manage/devState.selectDevStateDetail',
        {
          hospitalId: localStorage.getItem('hospitalId'),
          devId:devId
        },
        (ret: any) => {
          setDevStateDetailList(ret.list);
          setDetailVisible(true);
          setClickDevId(devId);
        }
      );
    } else {
      message.info("暂无设备状态详情");
    }
    
  }

  const startDes = (params) => {
    Ajax.Post('DataUrl', '/startDes',
      {
        hospitalId: localStorage.getItem('hospitalId'),
        ...params
      },
      (ret: any) => {
        queryDevList(null);
      }
    );
  }

  const startDesAll = () => {
    Ajax.Post('DataUrl', '/startDesAll',
      {
        hospitalId: localStorage.getItem('hospitalId')
      },
      (ret: any) => {
        queryDevList(null);
      }
    );
  }

  const stopDes = (params) => {
    Ajax.Post('DataUrl', '/stopDes',
      {
        hospitalId: localStorage.getItem('hospitalId'),
        ...params
      },
      (ret: any) => {
        queryDevList(null);
      }
    );
  }



  useEffect(() => {
    queryHospBranch();
    queryDesState();
    queryDevList(null);
    //定时任务
    const interval = setInterval(() => {
      queryDevList(null);
    }, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);


  const onBranchTreeSelect = (value) => {
    const params = hospitalLevel === "1" ? { hospitalId: value[0] } : { branchList: value[0] }
    args.current = params;
    queryDevList(params);
  }

  const handleCheckbox = (e) => {
    queryState.current = e;
    queryDevList(null);

  }

  const getExtra = (params) => {
    if (params?.stateValue != '9') {
      return (
        <>
          <Tooltip title="点击关闭监控">
            <a onClick={() => stopDes(params)}><PoweroffOutlined style={{ color: 'green' }} /></a>
          </Tooltip>&nbsp;&nbsp;&nbsp;&nbsp;
          <Tooltip title="点击查看详情">
            <a onClick={() => queryDetailState(params.id)}><BarsOutlined style={{ color: 'blue' }} /></a>
          </Tooltip>
        </>
      );
    }else{
      return (
        <>
          <Tooltip title="点击开启监控">
            <a onClick={() => startDes(params)}><PoweroffOutlined style={{ color: 'red' }} /></a>
          </Tooltip>&nbsp;&nbsp;&nbsp;&nbsp;
          <Tooltip title="点击查看详情">
            <a onClick={() => queryDetailState(params.id)}><BarsOutlined style={{ color: 'blue' }} /></a>
          </Tooltip>
        </>
      );
    }
      
  }
  
  return (
    <DomRoot>
      <Card bordered={false}>
        <Row>
          <Col span={15}>设备总体状态：
            {desState2001List &&
              <Checkbox.Group  defaultValue={desState2001List ? queryState.current : []} onChange={handleCheckbox}>
                {desState2001List.map((item) =>
                  <Checkbox value={item.value} >{item.name}</Checkbox>)}
              </Checkbox.Group>}
            <Button type="primary" style={{marginLeft:'10px'}} onClick={()=> startDesAll()}>一键监控</Button>
          </Col>
         
          <Col span={5}>更新时间：{updateTime}</Col>
        </Row>
      </Card>
      <Layout style={{ margin: 8 }}>
        <Layout.Sider style={{ background: '#fff', height:'100%'}}>
          {branchTree && <Tree
            showLine
            switcherIcon={<DownOutlined />}
            defaultExpandAll={true}
            onSelect={onBranchTreeSelect}
            treeData={branchTree}
          />}
        </Layout.Sider>
        <Layout.Content style={{ background: '#F0F2F5', marginLeft: 8 }}>
          {devMonitorList &&
            <Row gutter={8}>
              {devMonitorList.map((item,index) => (
                <Col xxl={4} xl={6} key={index}>
                  <Card
                    //onClick={() => { queryDetailState(item.id) }}
                    title={item.stateName ? <div>{item.id}&nbsp;&nbsp;<Tag color={item.stateColor}>{item.stateName}</Tag></div> : <div>{item.id}&nbsp;&nbsp;<Tag color='#CCCCCC'>未监控</Tag></div>}
                    size='small'
                    bodyStyle={{ height: 140 }}
                    extra={getExtra(item)}
                    hoverable
                  >
                    <p style={{ fontSize: 12, margin: 4 }}>设备类型：{item.devTypeName}</p>
                    <p style={{ fontSize: 12, margin: 4 }}>设备型号：{item.model}</p>
                    <p style={{ fontSize: 12, margin: 4 }}>设备IP：{item.ip}</p>
                    <p style={{ fontSize: 12, margin: 4 }}>区域：{item.branchLv2Name} / {item.branchLv3Name}</p>
                    <p style={{ fontSize: 12, margin: 4 }}>安装地点：{item.instAddr}</p>
                  </Card>
                </Col>
              ))}
            </Row>
          }
        </Layout.Content>
      </Layout>
      <Detail
        visible={detailVisible}
        devId={clickDevId}
        onClose={() => setDetailVisible(false)}
        devStateDetailList={devStateDetailList}
        onOk={() => {
          setDetailVisible(false);
        }}
      />
    </DomRoot>
  );
};

export default () => (
  <KeepAlive>
    <DevList />
  </KeepAlive>
)
