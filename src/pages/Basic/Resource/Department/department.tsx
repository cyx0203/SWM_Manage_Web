import { Fragment, useEffect, useState, useRef } from 'react';
import { DomRoot, Ajax, KeepAlive } from '@/components/PageRoot';
import { Card, Table, Button, Popconfirm, message, Input, Badge, Modal, Tooltip } from 'antd';
import { EditOutlined, DeleteOutlined, EyeOutlined, ReadOutlined, PlusOutlined } from '@ant-design/icons';
import Format from './format';

import Create from './create';
import Edit2nd from './edit2nd';
import Edit1st from './edit1st';
import EditPrompt from './editPrompt';

import SmartTop from '@/components/SmartTop';

const Department = () => {

  const [deptInfo, setDeptInfo] = useState(null);
  const [deptList, setDeptList] = useState(null);
  const [editMode, setEditMode] = useState(null);
  const [createVisible, setCreateVisible] = useState(null);  // 新增弹出框
  const [edit1Visible, setEdit1Visible] = useState(false);   // 一级科室编辑弹出框
  const [edit2Visible, setEdit2Visible] = useState(false);   // 二级科室编辑弹出框
  const [promptVisible, setPromptVisible] = useState(false); // 科室协议提示
  const [hospitalKV, setHospitalKV] = useState(null);
  //查询条件区域
  const queryArea: any = useRef(null);
  const hospitalId: any = useRef(null);

  const TopRef = useRef(null);

  const queryDept = (keywords: any) => {
    const query = { ...queryArea.current, ...keywords };
    Ajax.Post('BasicUrl', '/manage/comDept.selectByHosId',
      {
        hospitalId: hospitalId.current,
        level: '2',
        ...query,
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

  const topSubmit = (params = {}) => {
    queryArea.current = params;
    queryDept(null);
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

  const deleteDept1st = (item: any) => {
    Ajax.Post('BasicUrl', '/manage/comDept.delete1stById',
      {
        hospitalId: hospitalId.current,
        id: item.deptCode1st,
      },
      (ret: any) => {
        message.success('刪除成功');
        queryDept(null);
      }
    );
  }

  const setActive1st = (record: any) => {
    Ajax.Post('BasicUrl', '/manage/comDept.update',
      {
        hospitalId: hospitalId.current,
        oid: record.deptCode1st,
        active: record.deptActive1st === '1' ? '0' : '1'
      },
      (ret: any) => {
        message.success('设置成功');
        queryDept(null);
      }
    );
  }

  const dept1stLabel = (record: any) => {
    const readIconColor = record.deptPrompt1st ? 'gold' : null;
    const eyeIconColor = record.deptActive1st === '1' ? 'gold' : null;
    return (
      <span>
        <Badge showZero count={record.deptOrder1st} style={{ backgroundColor: '#52c41a', boxShadow: '0 0 0 1px #d9d9d9 inset' }} />
        {record.deptActive1st === '1' ?
          <span>{record.deptCode1st} {record.deptName1st}</span> :
          <span style={{ color: '#D3D3D3' }}>{record.deptCode1st} {record.deptName1st}</span>}
        <a>
          <Tooltip title="显示标记">
            <Popconfirm
              title={record.deptActive1st === '1' ? '点击后，用户在手机挂号时将无法看到该科室，是否继续？' : '点击后，用户在手机挂号时将看到该科室，是否继续？'}
              onConfirm={() => setActive1st(record)}
            >
              <EyeOutlined style={{ marginLeft: 10, color: eyeIconColor }} />
            </Popconfirm>
          </Tooltip>
          <Tooltip title="科室协议提示">
            <ReadOutlined
              style={{ marginLeft: 10, color: readIconColor }}
              onClick={() => {
                setPromptVisible(true);
                setDeptInfo(record);
              }}
            />
          </Tooltip>
          <Tooltip title="一级科室编辑">
            <EditOutlined
              style={{ marginLeft: 10 }}
              type="edit"
              onClick={() => {
                setEdit1Visible(true);
                setDeptInfo(record);
              }}
            />
          </Tooltip>
          <Popconfirm title="删除一级科室会将从属的二级科室全部删除，确认删除吗?" onConfirm={() => deleteDept1st(record)}>
            <DeleteOutlined style={{ marginLeft: 10 }} />
          </Popconfirm>
        </a>
      </span>
    )
  }

  // 表格列的配置属性
  const getColumns = () => {
    return [{
      title: '一级科室',                        // 列名
      dataIndex: 'deptName1st',                // 列数据在数据项中对应的路径
      render: (value, record) => {             // value:当前行的值 ; record:当前行数据
        return {
          children: dept1stLabel(record),
          props: {
            rowSpan: record.rowSpan
          },
        };
      },
    }, {
      title: '二级科室编号',
      dataIndex: 'deptCode2nd',
    }, {
      title: '二级科室名称',
      dataIndex: 'deptName2nd',
      render: (value, record) => (
        // record.deptDesc2nd && record.deptDesc2nd !== '' ?
        //   <Popover content={record.deptDesc2nd} title={<span>科室描述 - {value}</span>} trigger="hover">
        //     <a><Icon type="file-text" /></a> {value}
        //   </Popover> : value
        <span>
          <Badge count={record.deptOrder2nd} style={{ backgroundColor: '#52c41a', boxShadow: '0 0 0 1px #d9d9d9 inset' }} /> {value}
        </span>
      )
    }, {
      title: '科室位置',
      dataIndex: 'deptPosition2nd',
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
          {record.rowSpan > 0 &&
            <a
              style={{ marginLeft: 10 }}
              onClick={() => {
                setEdit2Visible(true);
                setDeptInfo(record);
                setEditMode(false);
              }}
            >新增二级科室
            </a>
          }
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
        <SmartTop handleSubmit={ topSubmit} getFields={getFields} onRef={TopRef}><div /></SmartTop>
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
      {/* 一级科室信息新增 */}
      <Create
        visible={createVisible}
        hospitalId={hospitalId.current}
        onClose={() => setCreateVisible(false)}
        onOk={() => {
          setCreateVisible(false);
          queryDept(null);
        }}
      />
      {/* 一级科室信息编辑 */}
      <Edit1st
        visible={edit1Visible}
        deptInfo={deptInfo}
        hospitalId={hospitalId.current}
        onClose={() => setEdit1Visible(false)}
        onOk={() => {
          setEdit1Visible(false)
          queryDept(null);
        }}
      />
      {/* 科室协议编辑 */}
      <Modal
        style={{ paddingLeft: 25 }}
        width={1000}
        visible={promptVisible}
        onCancel={() => setPromptVisible(false)}
        destroyOnClose
        footer={null}
        closable={false}
      >
        <EditPrompt hospitalId={hospitalId.current} deptInfo={deptInfo} queryDept={() => queryDept(null)} />
      </Modal>
    </DomRoot>
  )
}

export default () => (
  <KeepAlive>
    <Department />
  </KeepAlive>
)