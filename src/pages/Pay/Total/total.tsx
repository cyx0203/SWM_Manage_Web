import { DomRoot, KeepAlive, Ajax } from "@/components/PageRoot";
import { useState, useRef, useEffect } from "react";
import { Card, DatePicker, Select, Row, Col, List, Divider, TreeSelect } from "antd";
import styles from './style.less';
import { getTimeDistance, add } from "./utils";
import moment from "moment";
import { Pie, Line, G2, Area } from '@ant-design/charts';
import _ from "lodash";


const color = ['#79a1fb', '#8879fb', '#86d3e9', '#f8e401', '#fda306', '#0098f9', '#11e1cb', '#0559d7'];

const Total = () => {
  const [rangePickerValue, setRangePickerValue] = useState<Pay.RangePickerValue>(getTimeDistance('today'));
  const [lineAmt, setLineAmt] = useState(null);
  const [lineCount, setLineCount] = useState(null);
  const [pieAmt, setPieAmt] = useState(null);
  const [pieCount, setPieCount] = useState(null);
  const [card, setCard] = useState(null);
  const [goods, setGoods] = useState(null);
  const [hospitals, setHospitals] = useState(null);


  const hospitalId = useRef(localStorage.getItem("hospitalId"));
  const startDate = useRef(moment().format('YYYYMMDD'));
  const endDate = useRef(moment().format('YYYYMMDD'));

  const G = G2.getEngine("canvas");
  const pieConfig: any = {
    appendPadding: 10,
    angleField: 'value',
    colorField: 'type',
    radius: 0.6,
    legend: false,
    label: {
      type: 'spilder',
      labelHeight: 40,
      offset: 30,
      formatter: (data, mappingData) => {
        const group = new G.Group({});
        group.addShape({
          type: 'circle',
          attrs: {
            x: 0,
            y: 0,
            width: 40,
            height: 50,
            r: 5,
            fill: mappingData.color,
          },
        });
        group.addShape({
          type: 'text',
          attrs: {
            x: 10,
            y: 8,
            text: `${data.type}`,
            fill: mappingData.color,
          },
        });
        group.addShape({
          type: 'text',
          attrs: {
            x: 0,
            y: 25,
            text: `${(data.percent * 100).toFixed(2)}% (${data.value})`,
            fill: 'rgba(0, 0, 0, 0.65)',
            fontWeight: 700,
          },
        });
        return group;
      },
    },
    interactions: [{ type: 'element-active' }],
  };

  const areaConfig = {
    xField: 'type',
    yField: 'value',
    point: {
      size: 5,
      shape: 'diamond',
    },
    areaStyle: () => {
      return {
        fill: 'l(270) 0:#ffffff 0.5:#7ec2f3 1:#1890ff',
      };
    },
    tooltip: {
      customContent: (title, items) => {
        return (
          <div style={{ padding: '16px 8px' }}>
            <h5>提示</h5>
            <p>日期时间：{title}</p>
            <p style={{ margin: 0 }}>值：{items[0] && lineAmt && lineCount && items[0].data.value}</p>
          </div>
        );
      },
    }

  };


  const getHour = (params: any) => {

    let startTime = moment('000000', 'HHmmss');
    let endTime = moment('015959', 'HHmmss');
    let i = 0;
    const lineAmtList = [];
    const lineCountList = [];
    for (i = 0; i < 12; i++) {
      const s = startTime;
      const e = endTime;
      let listAmt = [];
      let listCount = [];
      let amt = 0; // 时间段内金额总和
      let count = 0;
      listAmt = _.filter(params.lineAmt, function (m) {
        const time = moment(m.cTime, 'HHmmss');
        return (time.isBetween(s, e));
      });
      listCount = _.filter(params.lineCount, function (m) {
        const time = moment(m.cTime, 'HHmmss');
        return (time.isBetween(s, e));
      });
      if (listAmt.length > 0) {
        listAmt.map(d => {
          amt = Number(add(amt, Number(d.value)));
        });
      }
      count = listCount.length;
      const amtMap = {
        "type": startTime.format('HH') + "-" + endTime.add('1', 'minutes').format('HH') + '时',
        "value": amt
      };
      const countMap = {
        "type": startTime.format('HH') + "-" + endTime.add('1', 'minutes').format('HH') + '时',
        "value": count
      };
      lineAmtList.push(amtMap);
      lineCountList.push(countMap);
      startTime = startTime.add(2, 'h');
      endTime = endTime.add(2, 'h');
    }

    setLineAmt(lineAmtList);
    setLineCount(lineCountList);
  }

  const getDays = (params) => {
    let start = moment(startDate.current);
    const enddate = moment(endDate.current);
    const lineAmtList = [];
    const lineCountList = [];
    while (moment(enddate).diff(moment(start), 'days') >= 0) {
      const s = start;
      const e = enddate;
      let listAmt = [];
      let listCount = [];
      let amt = 0; // 时间段内金额总和
      let count = 0;
      listAmt = _.filter(params.lineAmt, function (m) {
        const time = moment(m.type);
        return (moment(time).isSame(s, "days"));
      });
      listCount = _.filter(params.lineCount, function (m) {
        const time = moment(m.type);
        return (moment(time).isSame(s, "days"));
      });
      if (listAmt.length > 0) {
        listAmt.map(d => {
          amt = Number(add(amt, Number(d.value)));
        });
      }
      count = listCount.length;
      const amtMap = {
        "type": start.format('YYYY-MM-DD'),
        "value": amt
      };
      const countMap = {
        "type": start.format('YYYY-MM-DD'),
        "value": count
      };
      lineAmtList.push(amtMap);
      lineCountList.push(countMap);
      start = s.clone().add(1, 'days');

    }
    setLineAmt(lineAmtList);
    setLineCount(lineCountList);
  }

  const getWeek = (params) => {
    let start = moment(startDate.current);
    const enddate = moment(endDate.current);
    const lineAmtList = [];
    const lineCountList = [];
    while (enddate.diff(start, 'days') >= 0) {
      const s = start;
      let listAmt = [];
      let listCount = [];
      let amt = 0; // 时间段内金额总和
      let count = 0;
      let end = moment(start).add(7, 'd');
      if (end.diff(enddate) > 0) { end = enddate };
      listAmt = _.filter(params.lineAmt, function (m) {
        const time = moment(m.type);
        return (time.isBetween(s, end));
      });
      listCount = _.filter(params.lineCount, function (m) {
        const time = moment(m.type);
        return (time.isBetween(s, end));
      });
      if (listAmt.length > 0) {
        listAmt.map(d => {
          amt = Number(add(amt, Number(d.value)));
        });
      }
      count = listCount.length;
      const amtMap = {
        "type": start.format('YYYYMMDD') + "-" + end.format('YYYYMMDD'),
        "value": amt
      };
      const countMap = {
        "type": start.format('YYYYMMDD') + "-" + end.format('YYYYMMDD'),
        "value": count
      };
      lineAmtList.push(amtMap);
      lineCountList.push(countMap);
      start = moment(end).add(1, 'd');
    }
    setLineAmt(lineAmtList);
    setLineCount(lineCountList);
  }

  const getMonths = (params) => {
    let start = moment(startDate.current);
    const enddate = moment(endDate.current);
    const lineAmtList = [];
    const lineCountList = [];
    while (enddate.diff(start, 'days') >= 0) {
      let listAmt = [];
      let listCount = [];
      let amt = 0; // 时间段内金额总和
      let count = 0;
      const s = start;
      let end = moment(start).endOf('month');
      if (end.diff(enddate) > 0) { end = enddate };
      listAmt = _.filter(params.lineAmt, function (m) {
        const time = moment(m.type);
        return (time.isBetween(s, end));
      });
      listCount = _.filter(params.lineCount, function (m) {
        const time = moment(m.type);
        return (time.isBetween(s, end));
      });
      if (listAmt.length > 0) {
        listAmt.map(d => {
          amt = Number(add(amt, Number(d.value)));
        });
      }
      count = listCount.length;
      const amtMap = {
        "type": start.format('MM') + "月",
        "value": amt
      };
      const countMap = {
        "type": start.format('MM') + "月",
        "value": count
      };
      lineAmtList.push(amtMap);
      lineCountList.push(countMap);
      start = moment(end).add(1, 'd');
    }
    setLineAmt(lineAmtList);
    setLineCount(lineCountList);
  }

  const queryGoods = () => {
    Ajax.Post('PayUrl', '/manage/kv/payGoods.selectAll',
      {
        key: 'id',       // key名称
        value: 'name',   // value名称
        retKey: 'goods'
      },
      (ret: any) => {
        setGoods(ret.goods);
      }
    );
  }

  const queryHospital = () => {
    Ajax.Post('PayUrl', '/manage/tree/hospital.selectForTree',
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


  const queryTotal = () => {
    Ajax.Post('PayUrl', '/overview',
      {
        hospitalId: hospitalId.current,
        startDate: startDate.current,
        endDate: endDate.current
      },
      (ret: any) => {
        setCard(ret.card);
        setPieAmt(ret.pieAmt);
        setPieCount(ret.pieConut);
        const month = moment(endDate.current).diff(moment(startDate.current), 'month');
        const days = moment(endDate.current).diff(moment(startDate.current), 'days');
        console.log("===", month, days);
        if (month == 0 && days == 0) {
          getHour(ret);
        } else if (month == 0 && days <= 7) {
          getDays(ret);
        } else if (month == 0 && days > 7) {
          getWeek(ret);
        } else if (month > 0 && days >= 30) {
          getMonths(ret);
        }
      }
    );
  }


  useEffect(() => {
    queryHospital();
    queryGoods();
    queryTotal();
  }, []);

  const isActive = (type: Pay.TimeType) => {
    if (!rangePickerValue) {
      return '';
    }
    const value = getTimeDistance(type);
    if (!value) {
      return '';
    }
    if (!rangePickerValue[0] || !rangePickerValue[1]) {
      return '';
    }
    if (
      rangePickerValue[0].isSame(value[0] as moment.Moment, 'day') &&
      rangePickerValue[1].isSame(value[1] as moment.Moment, 'day')
    ) {
      return styles.currentDate;
    }
    return '';
  };

  const handleRangePickerChange = (value: Pay.RangePickerValue) => {
    setRangePickerValue(value);
    startDate.current = moment(value[0]).format('YYYYMMDD');
    endDate.current = moment(value[1]).format('YYYYMMDD');
    queryTotal();
  };

  const selectDate = (type: Pay.TimeType) => {
    const value: Pay.RangePickerValue = getTimeDistance(type);
    handleRangePickerChange(value);
  };



  const handleSelectChange = (value) => {
    hospitalId.current = value;
    queryTotal();
  }

  return (
    <DomRoot>
      <Card>
        <div className={styles.salesExtraWrap}>
          <TreeSelect
            style={{ width: 250 }}
            allowClear={true}
            placeholder="选择院区"
            defaultValue = {hospitalId}
            onChange={handleSelectChange}
            treeData={hospitals}
            treeDefaultExpandAll={true}
          />
          <DatePicker.RangePicker
            value={rangePickerValue}
            onChange={handleRangePickerChange}
            style={{ width: 256, marginLeft: 16, }}
          />
          <div className={styles.salesExtra}>
            <a className={isActive('today')} onClick={() => selectDate('today')}>
              今日
            </a>
            <a className={isActive('week')} onClick={() => selectDate('week')}>
              本周
            </a>
            <a className={isActive('month')} onClick={() => selectDate('month')}>
              本月
            </a>
            <a className={isActive('year')} onClick={() => selectDate('year')}>
              本年
            </a>
          </div>
        </div>
      </Card>
      <Row gutter={8} style={{ marginTop: 16, }}>
        <Col span={6}>
          <Card
            title="交易分类统计"
          >
            <List
              dataSource={card ? card : []}

              renderItem={(d: any, index) => {
                const clr = color[index % 7];
                return (<>
                  <List.Item>
                    <div style={{ backgroundColor: clr, width: '90%', minHeight: '120px', borderRadius: '10px 0px 10px 10px' }}>
                      {/* <Row>
                        <Col span={10}>
                          <div style={{ fontSize: '13px', color: 'white', margin: '40px 30px', padding: '10px  25px', minHeight: '60px', border: '2px solid white', borderRadius: '50%' }}>
                            <span>笔数：{(d.payCountPercent).toFixed(2)}%</span><br />
                            <span>金额：{(d.payAmtPercent).toFixed(2)}%</span>
                          </div>
                        </Col>
                        <Col span={14}> */}
                      <div style={{ fontSize: '15px', color: 'white', marginTop: '20px' }}>
                        
                          <div style={{paddingLeft:'15px'}}><span>{goods ? goods.kv[d.goods_id] : ''}</span><br /></div>
                        <hr />
                        <Row>
                          <Col span={12}>
                            <div style={{ paddingLeft: '15px' }}>交易笔数：{d.payCount}</div>
                            <div style={{marginTop: '7px',paddingLeft:'15px',paddingBottom:'10px' }}>交易金额：{d.payAmt}</div>
                          </Col>
                          <Col span={12}>
                            <div>， 占比：{(d.payCountPercent).toFixed(2) }%</div>
                            <div style={{marginTop: '7px',paddingBottom:'10px' }}>， 占比：{(d.payAmtPercent).toFixed(2) }%</div> 
                          </Col>
                        </Row>
                        
                      </div>
                        {/* </Col> */}
                      {/* </Row> */}
                      {/* <span style={{ marginLeft: '30px', fontSize: '15px' }}>{orderTypeName ? orderTypeName.kv[d.fOrdertype] : ''}</span><br /> */}
                      {/* <div style={{ fontSize: '12px', float: 'left', width: '100px' ,color:'white'}}>
                        <span>笔数：{(d.payCountPercent).toFixed(2)}%</span><br />
                        <span>金额：{(d.payAmtPercent).toFixed(2)}%</span>
                      </div>
                      <div style={{  fontSize: '19px', width: '100px' ,color:'white'}}>
                        <div>{d.payCount}</div>
                        <div style={{ marginTop: '7px' }}>{d.payAmt}</div>
                      </div> */}
                    </div>
                  </List.Item></>
                )

              }}
            />

          </Card>
        </Col>
        <Col span={6}>
          <Card
            title="交易金额占比"
          >
            {pieAmt && <div><Pie {...pieConfig} data={pieAmt} /></div>}
          </Card>
          <Card
            style={{ marginTop: 12, }}
            title="交易笔数占比"
          >
            {pieCount && <div><Pie {...pieConfig} data={pieCount} /></div>}
          </Card>
        </Col>
        <Col span={12}>
          <Card
            title="交易量走势（单位：元）"
          >
            {lineAmt && <div><Area {...areaConfig} data={lineAmt} /></div>}
          </Card>
          <Card
            style={{ marginTop: 12, }}
            title="交易量走势（单位：笔）"
          >
            {lineCount && <div><Area {...areaConfig} data={lineCount} /></div>}
          </Card>
        </Col>
      </Row>



    </DomRoot>
  )
};

export default () => (
  <KeepAlive>
    <Total />
  </KeepAlive>
)