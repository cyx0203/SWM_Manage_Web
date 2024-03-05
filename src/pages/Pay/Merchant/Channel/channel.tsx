import { Fragment, useEffect, useState } from 'react';
import { DomRoot, Ajax, KeepAlive } from '@/components/PageRoot';
import { Table, Card, Space, Input, Button, Modal, Popconfirm, message } from 'antd';
import PayTypeEdit from './payTypeEdit';
import ChannelInsert from './channelInsert';
import Detail from './detail';
import ChannelEdit from './channelEdit';

const { Search } = Input;

const Channel = () => {
  const [datasource, setDatasource] = useState([]); //总数据对象
  const [channelVisible, setChannelVisible] = useState(false); //新增支付渠道
  const [channelEditVisible, setChannelEditVisible] = useState(false); //编辑支付渠道
  const [payTypeVisible, setPayTypeVisible] = useState(false); //支付类型
  const [hospitalObj, setHospitalObj] = useState({}); //医院对象
  const [hospitalArray, setHospitalArray] = useState([]); //医院数组，传给Detail
  const [hospitalTemp, setHospitalTemp] = useState([]); //本用户下的医院集合
  const [record, setRecord] = useState({}); //单条记录


  //查询所有数据
  const queryData = (keywords) => {
    Ajax.Post('PayUrl', '/manage/merPlatChannel.select',
      {
        ...keywords
      },
      (ret: any) => {
        let channels = ret.list;
        Ajax.Post('PayUrl', '/manage/merPlatChannelHospital.select',
          {
          },
          (ret1: any) => {
            for (let i = 0; i < channels.length; i++) {
              const channelId = channels[i].id;
              const hospitalList = [];
              for (let j = 0; j < ret1.list.length; j++) {
                if (ret1.list[j].channelId == channelId && hospitalTemp.includes(ret1.list[j].hospitalId)) {
                  hospitalList.push({
                    id: ret1.list[j].hospitalId,
                    name: hospitalObj[ret1.list[j].hospitalId],
                    active: ret1.list[j].active
                  })
                }
              }
              channels[i].hospitalList = hospitalList;

            }

            const newList = channels.map(item => {
              return {
                ...item,
                channelId: item.id,
                channelName: item.name
              }
            })
            setDatasource(newList)
          })

      })
  }

  const firstQuery = () => {
    Ajax.Post('PayUrl', '/manage/merComHospital.selectByUser',
      {
        id: localStorage.hospitalId
      },
      (ret1: any) => {
        const hostitalData = {}; //存放此用户对应的医院对象
        const hostitalTemp = []; //存放此用户对应的医院Id
        const temp = []; //
        ret1.list.forEach(element => {
          if (element.parId != '##') {
            hostitalData[element.id] = element.name;
            hostitalTemp.push(element.id);
            temp.push(element);
          }
        });

        setHospitalTemp(hostitalTemp); //存放id
        setHospitalObj(hostitalData); //对象形式
        setHospitalArray(temp); //数组形式，给Detail用

        Ajax.Post('PayUrl', '/manage/merPlatChannel.select',
          {
          },
          (ret: any) => {
            let channels = ret.list;
            Ajax.Post('PayUrl', '/manage/merPlatChannelHospital.select',
              {
              },
              (ret1: any) => {
                for (let i = 0; i < channels.length; i++) {
                  const channelId = channels[i].id;
                  const hospitalList = [];
                  for (let j = 0; j < ret1.list.length; j++) {
                    if (ret1.list[j].channelId == channelId && hostitalTemp.includes(ret1.list[j].hospitalId)) {
                      hospitalList.push({
                        id: ret1.list[j].hospitalId,
                        name: hostitalData[ret1.list[j].hospitalId],
                        active: ret1.list[j].active
                      })
                    }
                  }
                  channels[i].hospitalList = hospitalList;

                }

                const newList = channels.map(item => {
                  return {
                    ...item,
                    channelId: item.id,
                    channelName: item.name
                  }
                })
                setDatasource(newList)
              })

          })
      })
  }

  const deleteById = (record) => {
    Ajax.Post('PayUrl', '/manage/merPlatChannel.delete',
      {
        id: record.id
      },
      (ret: any) => {
        if (ret.success) {
          //删除子表
          Ajax.Post('PayUrl', '/manage/merPlatChannelHospital.delete',
            {
              id: record.id
            },
            (ret: any) => { 
              if(ret.success){
                message.success('删除成功');
              }else{
                message.error('删除失败');
              }
              queryData({});
            })
        } else {
          message.error('删除失败');
          queryData({});
        }
      })
  }

  useEffect(() => {
    firstQuery();
  }, []);

  //目录的列表配置
  const columns = [
    {
      title: '渠道编号',
      dataIndex: 'channelId',
      key: 'channelId',
    },
    {
      title: '接入渠道',
      dataIndex: 'channelName',
      key: 'channelName',
    },
    {
      title: '企业名称',
      dataIndex: 'company',
      key: 'company',
    },
    {
      title: '支付类型',
      render: (text, record1) => (
        <a onClick={() => { setPayTypeVisible(true); setRecord(record1); }}
        >支付类型
        </a>
      )
    }, {
      title: '操作',
      dataIndex: 'active',
      render: (text, record2) => (
        <Fragment>
          <a
            style={{ marginLeft: 10 }}
            onClick={() => { setChannelEditVisible(true); setRecord(record2); }}
          >操作
          </a>
          <a
            style={{ marginLeft: 10 }}
            onClick={() => { setChannelVisible(true); setRecord(record2); }}
          >修改
          </a>

          <Popconfirm title="确认删除吗?" onConfirm={() => { deleteById(record2) }}>
            <a style={{ marginLeft: 10 }}>删除</a>
          </Popconfirm>

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
              placeholder="请输入渠道编号 / 渠道名称"
              enterButton="查询"
              style={{ width: 400 }}
              onSearch={value => queryData({ keywords: value })}
            />
            <Button style={{ marginRight: '8px' }} type="primary" onClick={() => {
              setChannelVisible(true);
              setRecord({});
            }} >
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
              expandedRowRender: (record3) => (
                <Detail record={record3} hospitalArray={hospitalArray} />
              )
            }}
          />
        </Card>
      </Space>

      {/* 渠道新增 */}
      <Modal
        visible={channelVisible}
        title='编辑渠道'
        onCancel={() => {
          setChannelVisible(false);
        }}
        width='40%'
        footer={null}
        destroyOnClose
      >
        <ChannelInsert
          dataSource={datasource}
          hospitalArray={hospitalArray}
          record={record}
          onSuccess={() => {
            setChannelVisible(false);
            queryData({});
          }} />
      </Modal>

      {/* 渠道操作 */}
      <Modal
        visible={channelEditVisible}
        title='操作渠道'
        onCancel={() => {
          setChannelEditVisible(false);
        }}
        width='40%'
        footer={null}
        destroyOnClose
      >
        <ChannelEdit
          record={record}
          hospitalArray={hospitalArray}
          onSuccess={() => {
            setChannelEditVisible(false);
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
        width='50%'
        footer={null}
        destroyOnClose
      >
        <PayTypeEdit
          record={record}
          onSuccess={() => {
            queryData({});
          }} />
      </Modal>
    </DomRoot>
  )
}

export default () => (
  <KeepAlive>
    <Channel />
  </KeepAlive>
)
