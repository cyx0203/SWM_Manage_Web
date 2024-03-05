import { Fragment, useEffect, useState } from 'react';
import { DomRoot, Ajax, KeepAlive } from '@/components/PageRoot';
import { Table, Card, Space, Input, Button, Tag, Popconfirm, Modal, message } from 'antd';
import { AlipayOutlined, AntDesignOutlined, WechatOutlined } from '@ant-design/icons';
import PayTypeEdit from './payTypeEdit';
import WeChatEdit from './wechatEdit';
import AliPayEdit from './alipayEdit';
import MerchantEdit from './merchantEdit';
import Detail from './detail';

const { Search } = Input;

const Paymode = () => {
  const [datasource, setDatasource] = useState([]); //总数据对象
  const [payTypeVisible, setPayTypeVisible] = useState(false); //支付类型
  const [wechatVisible, setWechatVisible] = useState(false); //微信参数
  const [alipayVisible, setAlipayVisible] = useState(false); //支付宝参数
  const [merchantVisible, setMerchantVisible] = useState(false); //商户编辑
  const [channelObj, setChannelObj] = useState({}); //支付渠道对象
  const [hospitalObj, setHospitalObj] = useState({}); //医院对象
  const [channelArray, setChannelArray] = useState([]); //支付渠道数组，传给Detail
  const [hospitalArray, setHospitalArray] = useState([]); //医院数组，传给Detail
  const [record, setRecord] = useState({}); //单条记录

  //第一次查询，得到channelObj和hostitalData，避免多次查询影响效率
  const firstQuery = () => {
    Ajax.Post('PayUrl', '/manage/merPlatChannel.selectAll',
      {
      },
      (ret: any) => {
        const channelData = {};
        ret.list.forEach(element => {
          channelData[element.id] = element.name;
        });
        setChannelObj(channelData);

        //过滤重复的
        const obj = {};
        const newList = ret.list.reduce(function (item, next) {
          obj[next.id] ? '' : obj[next.id] = true && item.push(next);
          return item;
        }, []);
        setChannelArray(newList);

        Ajax.Post('PayUrl', '/manage/merComHospital.selectByUser',
          {
            id: localStorage.hospitalId
          },
          (ret1: any) => {
            const hostitalData = {};
            const temp = []; //
            ret1.list.forEach(element => {
              if(element.parId != '##'){
                hostitalData[element.id] = element.name;
                temp.push(element);
              }
            });
            setHospitalObj(hostitalData);
            setHospitalArray(temp);

            Ajax.Post('PayUrl', '/manage/merchantPay.queryAll',
              {
              },
              (ret2: any) => {
                for (let i = 0; i < ret2.payMerchantList.length; i++) {
                  const temp = ret2.payMerchantList[i];
                  temp.merchantId = temp.id;
                  temp.merchantName = temp.name;

                  for (let j = 0; j < temp.channelList.length; j++) {
                    temp.channelList[j].channelName = channelData[temp.channelList[j].channelId];
                  }
                  for (let k = 0; k < temp.hospitalList.length; k++) {
                    temp.hospitalList[k].hospitalName = hostitalData[temp.hospitalList[k].hospitalId];
                  }
                }
                setDatasource(ret2.payMerchantList);
              });
          });
      })
  }

  //查询所有数据
  const queryData = (keywords) => {
    Ajax.Post('PayUrl', '/manage/merchantPay.queryAll',
      {
        ...keywords
      },
      (ret: any) => {
        for (let i = 0; i < ret.payMerchantList.length; i++) {
          //添加merchantId、merchantName、channelName、payTypeName
          const temp = ret.payMerchantList[i];
          temp.merchantId = temp.id;
          temp.merchantName = temp.name;

          for (let j = 0; j < temp.channelList.length; j++) {
            temp.channelList[j].channelName = channelObj[temp.channelList[j].channelId];
          }
          for (let k = 0; k < temp.hospitalList.length; k++) {
            temp.hospitalList[k].hospitalName = hospitalObj[temp.hospitalList[k].hospitalId];
          }
        }
        setDatasource(ret.payMerchantList);

      });
  }

  //商户开通/停用
  const updateActiveStatus = (active, record1) => {
    Ajax.Post('PayUrl', '/manage/merMerchant.updateById',
      {
        active,
        merchantId: record1.merchantId
      },
      (ret: any) => {
        if (ret.success) {
          message.success('操作成功');
        } else {
          message.error('操作失败');
        }
        queryData({});
      });
  }

  useEffect(() => {
    firstQuery();
  }, []);

  //目录的列表配置
  const columns = [
    {
      title: '商户编号',
      dataIndex: 'merchantId',
      key: 'merchantId',
    },
    {
      title: '商户名称',
      dataIndex: 'merchantName',
      key: 'merchantName',
    },
    {
      title: '支付类型',
      render: (text, record2) => (
        <a onClick={() => { setPayTypeVisible(true); setRecord(record2); }}
        >支付类型
        </a>
      )
    }, {
      title: '支付参数',
      render: (text, record3) => {
        if(record3.name.indexOf('银联') >= 0){
          return (
            <Fragment>
              <a onClick={() => { }}
              ><AntDesignOutlined /> 银联商务参数
              </a>
            </Fragment>
          )
        }else if(record3.name.indexOf('微信') >= 0){
          return (
            <Fragment>
              <a onClick={() => { setWechatVisible(true); setRecord(record3);}}
              ><WechatOutlined /> 微信支付参数
              </a>
            </Fragment>
          )
        }else if(record3.name.indexOf('支付宝') >= 0){
          return (
            <Fragment>
              <a
                // style={{ marginLeft: 20 }}
                onClick={() => { setAlipayVisible(true); setRecord(record3); }}
              ><AlipayOutlined /> 支付宝参数
              </a>
            </Fragment>
          )
        }else{
          return ''
        }

      }
    }, {
      title: '状态',
      dataIndex: 'active',
      render: (text) => (
        text === '1' ? <Tag color="green">启用</Tag> : <Tag color="red">停用</Tag>
      )
    }, {
      title: '操作',
      dataIndex: 'active',
      render: (text, record4) => (
        <Fragment>
          {text === '1' &&
            <Popconfirm title="确认停用吗?" onConfirm={() => { updateActiveStatus('0', record4); }}>
              <a>停用</a>
            </Popconfirm>}
          {text === '0' &&
            <Popconfirm title="确认启用吗?" onConfirm={() => { updateActiveStatus('1', record4); }}>
              <a>启用</a>
            </Popconfirm>}
          <a
            style={{ marginLeft: 10 }}
            onClick={() => { setMerchantVisible(true); setRecord(record4); }}
          >编辑
          </a>
        </Fragment>
      ),
    }
  ];

  return (
    <DomRoot>
      <Space direction="vertical" style={{
        width: '100%',
      }}>

        <Card>
          <Space direction="horizontal" size="middle" style={{
            width: '100%',
          }}>
            <Search
              placeholder="请输入商户编号 / 商户名称"
              enterButton="查询"
              style={{ width: 400 }}
              onSearch={value => queryData({ keywords: value })}
            />
            <Button style={{ marginRight: '8px' }} type="primary" onClick={() => { setMerchantVisible(true); setRecord({}); }} >
              +  新建
            </Button>
          </Space>
        </Card>

        <Card>
          <Table
            size="small"
            bordered
            columns={columns}
            dataSource={datasource}
            rowKey="id"
            expandable={{
              expandedRowRender: (record5) => (
                <Detail record={record5} channelArray={channelArray} hospitalArray={hospitalArray} />
              )
            }}
          />
        </Card>
      </Space>

      {/* 商户编辑 */}
      <Modal
        visible={merchantVisible}
        title='编辑商户'
        onCancel={() => {
          setMerchantVisible(false);
        }}
        width='40%'
        footer={null}
        destroyOnClose
      >
        <MerchantEdit
          dataSource={datasource}
          record={record}
          onSuccess={() => {
            setMerchantVisible(false);
            queryData({});
          }} />
      </Modal>

      {/* 支付类型配置 */}
      <Modal
        visible={payTypeVisible}
        title='编辑支付类型'
        onCancel={() => {
          setPayTypeVisible(false);
        }}
        width='40%'
        footer={null}
        destroyOnClose
      >
        <PayTypeEdit
          record={record}
          onSuccess={() => {
            queryData({});
          }} />
      </Modal>

      {/* 微信参数配置 */}
      <Modal
        visible={wechatVisible}
        title='编辑微信参数'
        onCancel={() => {
          setWechatVisible(false);
        }}
        width='40%'
        footer={null}
        destroyOnClose
      >
        <WeChatEdit
          record={record["wechatList"]}
          merchantId={record["merchantId"]}
          onSuccess={() => {
            setWechatVisible(false);
            queryData({});
          }}
        />
      </Modal>

      {/* 支付宝参数配置 */}
      <Modal
        visible={alipayVisible}
        title='编辑支付宝参数'
        onCancel={() => {
          setAlipayVisible(false);
        }}
        width='40%'
        footer={null}
        destroyOnClose
      >
        <AliPayEdit
          record={record["alipayList"]}
          merchantId={record["merchantId"]}
          onSuccess={() => {
            setAlipayVisible(false);
            queryData({});
          }} />
      </Modal>

    </DomRoot>
  )
}

export default () => (
  <KeepAlive>
    <Paymode />
  </KeepAlive>
)
