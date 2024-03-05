import { DomRoot, Ajax, KeepAlive } from '@/components/PageRoot';
import { useState, useEffect, useRef } from 'react';
import SmartTable from '@/components/SmartTable';
import SmartTop from '@/components/SmartTop';
import EditTable from './editTable';
import { Space, message, Modal, Card, Popconfirm } from 'antd';

const Equipment = () => {
  const userName = localStorage.getItem('GGMIDENDPRO_LOGIN_NAME');
  const [tableDate, setTableData] = useState(null);
  const [record, setRecord] = useState(null);
  const [visible, setVisible] = useState(false);
  const topRef = useRef(null);
  // 查询条件区域
  const queryArea: any = useRef(null);
  // 预先查询的基础数据-科室
  const [deptList, setDeptList] = useState(null);
  const [templateOption,setTemplateOption] = useState(null)

  // 查询诊室列表
  const queryOptions = () => {
    Ajax.Post(
      'TriageUrl',
      '/queryRoom',
      {
        key: 'id',
        value: 'name',
      },
      (ret: any) => {
          console.log(ret);
        if (ret && ret.list) {
          // setDeptList(ret.list.tv);
        } else {
          message.error('查询诊室列表失败');
        }
      },
    );

    // 查询屏幕模板(设备)列表
    Ajax.Post(
      'TriageUrl',
      '/queryTemplate',
      {
        key:'template',
        value:'template'
      },
      (ret2: any) => {
        console.log(ret2);
        if (ret2 && ret2.list) {
          setTemplateOption(ret2.list.lv);
        } else {
          message.error('查询设备列表失败');
        }
      },
    );
  };

  // 查询诊室列表
  const initRoom = (t: any) => {
    Ajax.Post(
      'TriageUrl',
      '/queryRoom',
      {
        key: 'id',
        value: 'name',
      },
      (ret: any) => {
        if (ret&&ret.list) {
          console.log(ret.list);
          setDeptList(ret.list.tv)
          const _t = t;
          const temp = [..._t.list]
          for(let i=0;i<temp.length;i++){
            const res = temp[i].id_levels.split(',');
            if(res.length<2){
            for(let j=0;j<ret.list.lv.length;j++){
              if(temp[i].id_levels===ret.list.lv[j].value){
                temp[i].room = ret.list.lv[j].label
              }
            }
          }else{
            temp[i].room = ''
            for(let m=0;m<res.length;m++){
            for(let j=0;j<Object.keys(ret.list.kv).length;j++){
              if(res[m]===Object.keys(ret.list.kv)[j]){
                temp[i].room += Object.values(ret.list.kv)[j]+','
              }
            }
          }
          temp[i].room = temp[i].room.substring(0,temp[i].room.length-1) // 删除最后一个逗号','
          }
          }
          setTableData(_t);
          // queryOptions() // 每次更新数据后选择框数据也更新
        } else {
          message.error('初始化科室失败');
        }
      },
    );
  };

  // 查询设备信息
  const selectByPrimary = (params={})=>{
    Ajax.Post(
      'TriageUrl',
      '/queryDevice',
      {
        ...params,
      },
      (ret: any) => {
        console.log(ret);
        if (ret) {
          const temp = ret;
          initRoom(temp);
        } else {
          message.error('获取设备信息失败');
        }
      },
      (err: any) => {
        //后台异常、网络异常的回调处理
        //该异常处理函数，可传可不传
        console.log('Ajax Post Error');
        console.log(err);
      },
    );
  }

  // 按id删除设备信息
  const deleteByPrimary = (row: any) => {
    Ajax.Post(
      'TriageUrl',
      '/deleteDevice',
      {
        ...row,
      },
      (ret: any) => {
        if (ret && ret.hasOwnProperty('success') && ret.success) {
          selectByPrimary();
        } else message.error('删除失败');
      },
      (err: any) => {
        //后台异常、网络异常的回调处理
        //该异常处理函数，可传可不传
        console.log('Ajax Post Error');
        console.log(err);
      },
    );
  };

  // 按诊室id查询设备信息
  const selectByPrimary_id = (params = {}) => {
    const query = { ...queryArea.current, ...params };
    console.log(query);

    Ajax.Post(
      'TriageUrl',
      '/queryDevice',
      {
        ...query,
      },
      (ret: any) => {
        console.log(ret);
        if (ret) {
          const temp = ret
          initRoom(temp);
        } else {
          message.error('获取诊室信息失败');
        }
      },
    );
  };

  const topSubmit = (params = {}) => {
    queryArea.current = params;
    selectByPrimary_id(null);
  };

  const getFields = () => {
    return [
      {
        type: 'button',
        buttonList: [
          {
            type: 'primary',
            buttonText: '+ 新建',
            onClick: () => {
              setVisible(true);
              setRecord(null);
            },
          },
        ],
      },
      {
        type: 'select',
        style: { width: 250 },
        field: 'id_level',
        placeholder: '请选择查询诊室...',
        showSearch: true,
        options: deptList,
        allowClear: true,
        message: '请选择诊室',
      },
      {
        type: 'button',
        buttonList: [
          {
            type: 'primary',
            htmlType: 'submit',
            buttonText: '查询',
            style: { marginLeft: 8 }
          }, 
          {
            buttonText: '重置',
            style: { marginLeft: 8 },
            onClick: () => {
              selectByPrimary()
            }
          }
        ]
      }
    ];
  };

  const columns = [
    {
      title: '设备ID',
      dataIndex: 'id',
      key: 'id',
      width:100
    },
    
    {
      title: '所属诊室',
      dataIndex: 'room',
      key: 'room',
      width:250
    },
    {
      title: '设备类型',
      dataIndex: 'catagory',
      key: 'catagory',
      render: (val, _, index) => <Space key={index}>{val && val === 1 && '软呼叫' || val === 2 && '诊间屏' || val === 3 && '综合大屏'}</Space>,
      width:250
    },
    {
      title: '模板',
      dataIndex: 'template',
      key: 'template',
      width:250
    },
    {
      title: '操作',
      key: 'action',
      align: 'center',
      render: (_, row, index) => (
        <Space size="middle">
          <a
            style={{ marginRight: '8px' }}
            onClick={() => {
              setVisible(true);
              setRecord(row);
            }}
          >
            修改
          </a>
          <Popconfirm
            title="确定删除?"
            onConfirm={() => deleteByPrimary(row)}
            okText="是"
            cancelText="否"
          >
            <a onClick={() => {}}>删除</a>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  useEffect(() => {
    selectByPrimary();
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
          handleChange={params => selectByPrimary(params)}
        />
      </Card>
      <Modal
        title="编辑诊室"
        visible={visible}
        onCancel={() => setVisible(false)}
        width="40%"
        footer={null}
        destroyOnClose
      >
        <EditTable
          record={record}
          deptList={deptList}
          templateOption={templateOption}
          onSuccess={() => {
            setVisible(false);
            selectByPrimary();
          }}
        />
      </Modal>
    </DomRoot>
  );
};

export default () => (
  <KeepAlive>
    <Equipment />
  </KeepAlive>
);
