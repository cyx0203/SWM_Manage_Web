import { Fragment, useEffect, useState,useRef } from 'react';
import { DomRoot, Ajax, KeepAlive } from '@/components/PageRoot';
import { Card, Table, Button, Popconfirm, message, Input } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import Format from './format';
import SmartTop from '@/components/SmartTop';

import Create from './create';
import Edit2nd from './edit2nd';

const Department = () => {

  const [deptInfo, setDeptInfo] = useState(null);
  const [deptList, setDeptList] = useState(null);
  const [editMode, setEditMode] = useState(null);
  const [createVisible, setCreateVisible] = useState(null);  // 新增弹出框
  const [edit2Visible, setEdit2Visible] = useState(false);   // 二级科室编辑弹出框
  const [hospitalKV, setHospitalKV] = useState(null);

  //查询条件区域
  const hospitalId: any = useRef(null);

  const TopRef = useRef(null);

  const queryDept = (keywords: any) => {
    Ajax.Post('BasicUrl', '/manage/comDept.selectByHosId',
      {
        hospitalId: hospitalId.current,
        level: '2',
        ...keywords,
      },
      (ret: any) => {
        setDeptList(ret);
      }
    );
  }

  const queryHospitalTree = () => {
    Ajax.Post('BasicUrl', '/manage/kv/hospital.selectHosByLevel',
      {
        key: 'id',       // key名称
        value: 'name',   // value名称
        hospitalId: localStorage.getItem("hospitalId"),
        level: "2",
        retKey: 'hospitalKV',
      },
      (ret: any) => {
        setHospitalKV(ret.hospitalKV)
        hospitalId.current = ret.hospitalKV.tv[0].value;
        TopRef.current.getForm().setFieldsValue({ hospitalId: ret.hospitalKV.tv[0].value });
        queryDept(null);
      }
    );
  }

  useEffect(() => {
    queryHospitalTree();
  }, []);


  const deleteDept2nd = (item: any) => {
    Ajax.Post('BasicUrl', '/manage/comDept.deleteById',
      {
        hospitalId: hospitalId.current,
        id: item.deptCode2nd,
      },
      (ret: any) => {
        message.success('刪除成功');
        queryDept(null);
      }
    );
  }

  // 表格列的配置属性
  const getColumns = () => {
    return [
      {
        title: '科室名称',
        dataIndex: 'deptName2nd',
        render: (value, record) => (
          <span>
            {value}
          </span>
        )
      },
      {
        title: '科室编号',
        dataIndex: 'deptCode2nd',
      }, {
        title: '操作',
        render: (text, record) => (
          <Fragment>
            <a
              style={{ marginRight: 10 }}
              onClick={() => {
                setEdit2Visible(true);
                setDeptInfo(record);
                setEditMode(true);
              }
              }
            >编辑
            </a>
            <Popconfirm title="确认删除吗?" onConfirm={() => deleteDept2nd(record)}>
              <a>删除</a>
            </Popconfirm>
          </Fragment>
        ),
      },
    ];
  }


  const changeHandle = (val) => {
    hospitalId.current = val;
  }

  const getFields = () => {
    return [
      {
        type: 'select',
        label: '院区',
        style: { width: '300px' },
        field: 'hospitalId',
        options: hospitalKV ? hospitalKV.tv : [],
        placeholder: '请选择院区...',
        required: true,
        onSelect: changeHandle
      },
      {
        type: 'input',
        style: { width: '300px' },
        placeholder: '请输入科室编号 / 名称',
        field: 'keywords',
        label: '科室编号 / 名称'
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
            buttonText: '新增一级科室',
            style: { marginLeft: '8px' },
            onClick: () => { setCreateVisible(true); }
          },
        ]
      }
    ]
  }

  const { Search } = Input;
  const deptListFormat = deptList && deptList.list.length > 0 ? Format.formatDeptList(deptList.list) : [];
  return (
    <DomRoot>
      <Card>
        <SmartTop handleSubmit={ queryDept} getFields={getFields} onRef={TopRef}><div /></SmartTop>
      </Card>
      <Card>
        <Table
          size="small"
          // loading={loading}
          bordered
          columns={getColumns()}
          dataSource={deptListFormat}
          pagination={false}
        />
      </Card>
      {/* 二级科室信息编辑 */}
      <Edit2nd
        visible={edit2Visible}
        deptInfo={deptInfo}
        editMode={editMode}
        hospitalId={hospitalId.current}
        onClose={() => setEdit2Visible(false)}
        onOk={() => {
          setEdit2Visible(false)
          queryDept(null);
        }}
      />
      {/* 科室信息新增 */}
      <Create
        visible={createVisible}
        onClose={() => setCreateVisible(false)}
        hospitalId={hospitalId.current}
        onOk={() => {
          setCreateVisible(false);
          queryDept(null);
        }}
      />
    </DomRoot>
  )
}

export default () => (
  <KeepAlive>
    <Department />
  </KeepAlive>
)