import { DomRoot, Ajax, KeepAlive } from '@/components/PageRoot';
import { useState, useEffect, useRef } from "react";
import SmartTable from "@/components/SmartTable";
import SmartTop from '@/components/SmartTop';
import EditTable from './editTable';
import moment from "moment";
import { Space, message, Modal, Card, Button,Row, Col } from "antd";
import { CloudUploadOutlined } from '@ant-design/icons';

const Media = () => {

    const userName = localStorage.getItem('GGMIDENDPRO_LOGIN_NAME')
    const videoBaseUrl = 'http://127.0.0.1:8082/media/'
    const args: any = useRef({ date: [moment(), moment()] });
    const [tableDate, setTableData] = useState(null);

    const [seqNo, setSeqNo] = useState(null);
    const [trdType, setTrdType] = useState(null);

    const [records, setRecords] = useState(null);
    const [visible, setVisible] = useState(false);
    const [media_seq_no,setMediaSeqNo] = useState(null);
    const topRef = useRef(null);
    // 查询条件区域 
    const queryArea: any = useRef(null);
    // 查询视频所有信息
    const selectAll= (params = {})=>{
        Ajax.Post('SWMUrl', '/queryMediaStatus',
          {
          }
          , (ret: any) => {
            console.log(ret)
            if(ret){
              const t = ret.list
              for(const i of t){
                i.date = i.timeCreate+'~'+i.timeEnd;
              }
                setTableData(ret)
            }
            else {
              message.error('获取科室信息失败');
            }
          }
          , (err: any) => {
            //后台异常、网络异常的回调处理
            //该异常处理函数，可传可不传
            console.log('Ajax Post Error');
            console.log(err);
          }
        );
    }

    // 查询流水号
    const querySeqNo=()=>{
      Ajax.Post('SWMUrl', '/manage/kv/mediastatus.queryMediaStatus',
          {
            "key": "mediaSeqNo",       // key名称
            "value": "mediaSeqNo",   // value名称
            "retKey": "mediaSeqNo" //返回参数字段名
          }
          , (ret: any) => {
            console.log(ret)
            if(ret){
              setSeqNo(ret.mediaSeqNo.lv)
            }
            else {
              message.error('获取流水号失败');
            }
          }
          , (err: any) => {
            //后台异常、网络异常的回调处理
            //该异常处理函数，可传可不传
            console.log('Ajax Post Error');
            console.log(err);
          }
        );
    }
   
    // 查询交易类型
    const queryTrdType=()=>{
      Ajax.Post('SWMUrl', '/manage/kv/mediastatus.queryTrdType',
          {
            "key": "trdType",       // key名称
            "value": "name",   // value名称
            "retKey": "trdType" //返回参数字段名
          }
          , (ret: any) => {
            console.log(ret)
            if(ret){
              const t = ret.trdType.tv
              for(const i of t) {
                i.txt = `${i.value}(${i.txt})`
              }
              setTrdType(t)
            }
            else {
              message.error('获取交易类型失败');
            }
          }
          , (err: any) => {
            //后台异常、网络异常的回调处理
            //该异常处理函数，可传可不传
            console.log('Ajax Post Error');
            console.log(err);
          }
        );
    }

  const selectByPrimary = (params) => {
    const query = { ...args.current, ...params };
    console.log(query)
    Ajax.Post('SWMUrl', query.mediaSeqNo?
    '/manage/mediastatus.selectByPrimaryKey':
    // '/manage/mediastatus.selectByTimeAndType',
    '/selectByTimeAndType',
      {
        ...query,
        trdType:trdType===undefined?null:query.trdType,
        startDate: (query.date && moment(query.date[0]).format('YYYY-MM-DD'))||null,
        endDate: (query.date && moment(query.date[1]).format('YYYY-MM-DD'))||null
      },
      (ret: any) => {
        console.log(ret)
        const t = ret.list
        for(const i of t){
          i.date = i.timeCreate+'~'+i.timeEnd;
        }
        setTableData(ret);
      }
    );
  }

      const topSubmit = (params = {}) => {
        queryArea.current = params;
        console.log(params)
        selectByPrimary(params);
      }

      const getFields = () => {
        return [
          {
            type: 'select',
            label: '业务流水号',
            style: { width: '180px' },
            field: 'mediaSeqNo',
            options: seqNo||[],
            placeholder: '请选择业务流水号',
            allowClear: true,
            showSearch:true,
          },
          {
            type: 'select',
            label: '业务种类',
            style: { width: '180px' },
            field: 'trdType',
            options: trdType||[],
            placeholder: '请选择业务种类',
            allowClear: true,
          },
         {
            type: 'range-picker',
            style: { width: '250px' },
            field: 'date',
            label: '业务日期',
            initialValue: [moment(), moment()],
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
              {
                buttonText: '重置',
                style: { marginLeft: 8 },
                onClick: () => {
                  selectAll()
                  
                }
              }
            ]
          }
        ]
      }

      const columns = [
        {
            title: '业务流水号',
            dataIndex: 'mediaSeqNo',
            key: 'mediaSeqNo',
            width:200
          },
          {
            title: '业务种类',
            dataIndex: 'name',
            key: 'name',
            width:250
          }, 
          {
            title: '业务日期',
            dataIndex: 'date',
            key: 'date',
            width:250
          },
          {
            // title: '操作',
            key: 'action',
            align:'center',
            render: (record,row,index) => (
              <Space size="middle">
                <Button shape="round" type="primary" style={{ marginRight: '8px' }} onClick={() => { setVisible(true);setMediaSeqNo(record.mediaSeqNo);console.log(record) }}>查询</Button>
              </Space>
            ),
          }];

  useEffect(() => {
    // queryRecords(null);
    selectAll();
    querySeqNo();
    queryTrdType();
  }, []);

  return (
    <DomRoot>
      <Card>
        <SmartTop handleSubmit={topSubmit} getFields={getFields} onRef={topRef}><div /></SmartTop>
      </Card>
      <Card>
        <SmartTable
            bordered
            dataSource={tableDate || []}
            columns={columns}
            handleChange={params => selectAll(params)}
        />
      </Card>
      <Modal
        title='视频回放'
        visible={visible}
        onCancel={() => setVisible(false)}
        width='80%'
        footer={null}
        destroyOnClose
      >
        {/* <EditTable record={record} onSuccess={() => { setVisible(false); selectByPrimary(); }}/> */}
        <Row gutter={16}>
    <Col span={8}>
      <Card title="座席端视频" bordered>
        <video controls autoPlay style={{width:'100%',height:'150px',objectFit: 'fill'}}>
          <source src={`${videoBaseUrl}${media_seq_no}_local.webm`} type="video/webm" />
        </video>
      </Card>
    </Col>
    <Col span={8}>
      <Card title="SWM端视频" bordered={true}>
        <video controls autoPlay style={{width:'100%',height:'150px',objectFit: 'fill'}}>
          <source src={`${videoBaseUrl}${media_seq_no}_remote.webm`} type="video/webm" />
        </video>
      </Card>
    </Col>
    <Col span={8}>
      <Card title="桌面共享视频" bordered={true}>
        <video controls autoPlay style={{width:'100%',height:'150px',objectFit: 'fill'}}>
          <source src={`${videoBaseUrl}${media_seq_no}_remoteshare.webm`} type="video/webm" />
        </video>
      </Card>
    </Col>
  </Row>
      </Modal>
    </DomRoot>
  );
};

export default () => (
  <KeepAlive>
    <Media />
  </KeepAlive>
)
