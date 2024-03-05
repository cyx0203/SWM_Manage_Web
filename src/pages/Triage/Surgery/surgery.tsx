import { DomRoot, Ajax, KeepAlive } from '@/components/PageRoot';
import { useState, useEffect, useRef } from 'react';
import SmartTable from '@/components/SmartTable';
import SmartTop from '@/components/SmartTop';
import EditTable from './editTable';
import { Space, message, Modal, Card, Popconfirm } from 'antd';

const Surgery = () => {
  const userName = localStorage.getItem('GGMIDENDPRO_LOGIN_NAME');
  const [tableDate, setTableData] = useState(null);
  const [record, setRecord] = useState(null);
  const [visible, setVisible] = useState(false);
  const topRef = useRef(null);
  // 查询条件区域
  const queryArea: any = useRef(null);
  // 预先查询的基础数据-科室
  const [deptList, setDeptList] = useState(null);

  // 查询科室列表
  const queryDepartment = () => {
    Ajax.Post(
      'TriageUrl',
      '/queryLevel',
      {
        key: 'id',
        value: 'name',
      },
      (ret: any) => {
          console.log(ret);
          if(ret&&ret.list){
            setDeptList(ret.list.tv);
        } else {
          message.error('查询科室列表失败');
        }
      },
    );
  };

  const initLevel = (t: any) => {
    Ajax.Post(
      'TriageUrl',
      '/queryLevel',
      {
        key: 'id',
        value: 'name',
      },
      (ret2: any) => {
        console.log(ret2);
        
        if (ret2 && ret2.list) {
          console.log(ret2.list);
          const _t = t;
          const temp = [..._t.list]
          console.log(temp);
          for (let i = 0; i < temp.length; i++) {
            const res = temp[i].parentids.split(',');
            if (res.length < 2) {
              for (let j = 0; j < ret2.list.lv.length; j++) {
                if (temp[i].parentids === ret2.list.lv[j].value) {
                  temp[i].level = ret2.list.lv[j].label;
                }
              }
            } else {
              temp[i].level = '';
              for (let m = 0; m < res.length; m++) {
                for (let j = 0; j < ret2.list.lv.length; j++) {
                  if (res[m] === ret2.list.lv[j].value) {
                    temp[i].level += ret2.list.lv[j].label + ',';
                  }
                }
              }
              temp[i].level = temp[i].level.substring(0, temp[i].level.length - 1); // 删除最后一个逗号','
            }
          }
          console.log(_t);
          setTableData(_t);
          queryDepartment() // 每次更新数据后选择框数据也更新
        } else {
          message.error('初始化科室失败');
        }
      },
    );
  };

  // 查询诊室信息
  const selectByPrimary = (params = {}) => {
    Ajax.Post(
      'TriageUrl',
      '/queryRoom',
      {
        ...params,
      },
      (ret: any) => {
        console.log(ret);
        if (ret) {
          const temp = ret;
          // setTableData(ret.room)
          initLevel(temp);
        } else {
          message.error('获取诊室信息失败');
        }
      },
      (err: any) => {
        //后台异常、网络异常的回调处理
        //该异常处理函数，可传可不传
        console.log('Ajax Post Error');
        console.log(err);
      },
    );
  };

  // 按id删除诊室信息
  const deleteByPrimary = (row: any) => {
    Ajax.Post(
      'TriageUrl',
      '/deleteRoom',
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

  // 按科室id查询诊室信息
  const selectByPrimary_id = (params = {}) => {
    const query = { ...queryArea.current, ...params };
    console.log(query);

    Ajax.Post(
      'TriageUrl',
      '/queryRoom',
      {
        ...query,
      },
      (ret: any) => {
        console.log(ret);
        if (ret) {
          const temp = ret
          initLevel(temp);
        } else {
          message.error('获取科室信息失败');
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
        field: 'parentid',
        placeholder: '请选择查询科室...',
        showSearch: true,
        options: deptList,
        allowClear: true,
        message: '请选择科室',
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
      title: '诊室ID',
      dataIndex: 'id',
      key: 'id',
      width: 100,
    },
    {
      title: '诊室名称',
      dataIndex: 'name',
      key: 'name',
      width: 250,
    },
    {
      title: '所属科室',
      dataIndex: 'level',
      key: 'level',
      width: 250,
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
    <Surgery />
  </KeepAlive>
);
