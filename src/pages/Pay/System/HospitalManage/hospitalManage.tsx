import { useEffect, useState } from 'react';
import { DomRoot, Ajax, KeepAlive } from '@/components/PageRoot';
import { Table, Modal } from 'antd';
import Create from './create';


const HospitalManage = () => {
  const [datasource, setDatasource] = useState([]);
  const [visible, setVisible] = useState(false);
  const [record, setRecord] = useState(null);

  //查询所有数据
  const queryData = () =>{
    //先查询医院数据,base表
    Ajax.Post('BasicUrl', '/manage/hospital.selectForTree',
    {
    },
    (ret: any) => {
        const hospitalData={};
        ret.list.forEach(element => {
            hospitalData[element.id] = element.name;
        });

        //再查商户与医院对应关系,pay表
        Ajax.Post('PayUrl', '/manage/merHospital.selectAll',
        {
        },
        (ret1: any) => {
        //加工数组,添加key、merchantName和channelType
        const newList = ret1.list.map((item)=>{
            return {...item,
                key:item.merchantId+item.hospitalId,
                hospitalName:hospitalData[item.hospitalId]
            }
        })
        setDatasource(newList);
        }
        );
    }
    );
  }

  useEffect(() => {
    queryData();
  }, []);

  //目录的列表配置
  const columns = [
    {
      title: '商户代码',
      dataIndex: 'merchantId',
      key: 'merchantId',
    },
    {
      title: '医院名称',
      dataIndex: 'hospitalName',
      key: 'hospitalName',
    },
    {
      title: '操作',
      key: 'action',
      render: (_, row) => (
        <a onClick={() => {setVisible(true); setRecord(row) }}>修改</a>
      ),
    },
  ];

  return (
    <DomRoot>
        <Table
            size="small"
            columns={columns}
            dataSource={datasource}
        />

      <Modal
        title='编辑用户'
        visible={visible}
        onCancel={() => setVisible(false)}
        width='40%'
        footer={null}
        destroyOnClose
      >
        <Create record={record} onSuccess={() => { setVisible(false); queryData(); }} />
      </Modal>

    </DomRoot>
  )
}

export default () => (
  <KeepAlive>
    <HospitalManage />
  </KeepAlive>
)
