import { Fragment, useEffect, useState,useRef } from 'react';
import { DomRoot, Ajax, KeepAlive } from '@/components/PageRoot';
import { Card, Table, Input, Button, Divider, Popconfirm, message, Modal, Tag } from 'antd';
import Edit from './edit';
import SmartTop from '@/components/SmartTop';

const { Search } = Input;

const Text = () => {

  const [textList, setTextList] = useState(null);
  const [textTypeList, setTextTypeList] = useState(null);
  const [editVisible, setEditVisible] = useState(false);
  const [record, setRecord] = useState(null);

  const [hospitalKV, setHospitalKV] = useState(null);
  //查询条件区域
  const hospitalId: any = useRef(null);

  const TopRef = useRef(null);


  const queryText = (keywords) => {
    Ajax.Post('BasicUrl', '/manage/comText.selectWithoutContent',
      {
        ...keywords,
        hospitalId: hospitalId.current,
      },
      (ret: any) => {
        setTextList(ret.list)
      }
    );
  }

  const queryTextType = (keywords) => {
    Ajax.Post('BasicUrl', '/manage/comTextType.selectAll',
      {
        ...keywords,
        hospitalId: hospitalId.current,
      },
      (ret: any) => {
        setTextTypeList(ret.list)
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
        queryText(null);
        queryTextType(null);
      }
    );
  }


  useEffect(() => {
    queryHospitalTree();
  }, []);

  const queryContent = (row) => {
    Ajax.Post('BasicUrl', '/manage/comText.selectContent',
      {
        id: row.id
      },
      (ret: any) => {
        row.content = ret.list[0].content;
        setRecord(row);
        setEditVisible(true);
      }
    );
  }

  const removeRecord = (row) => {
    Ajax.Post('BasicUrl', '/manage/comText.deleteById',
      {
        id: row.id
      },
      (ret: any) => {
        message.success('删除成功');
        queryText(null);
      }
    );
  }

  const updateActive = (row, active) => {
    Ajax.Post('BasicUrl', '/manage/comText.update',
      {
        id: row.id,
        updateUser: localStorage.getItem('account'),
        active,
      },
      (ret: any) => {
        message.success('操作成功');
        queryText(null);
      }
    );
  }

  const tableColumns: any = [{
    title: '标题',
    dataIndex: 'title',
  }, {
    title: '图文类型',
    dataIndex: 'typeName',
  }, {
    title: '创建人',
    dataIndex: 'createUserName',
  }, {
    title: '创建时间',
    dataIndex: 'createTimeFormat',
  }, {
    title: '最近修改人',
    dataIndex: 'updateUserName',
  }, {
    title: '最近修改时间',
    dataIndex: 'updateTimeFormat',
  }, {
    title: '状态',
    dataIndex: 'active',
    render: (value) => (
      value === '1' ? <Tag color="green">启用</Tag> : <Tag color="red">停用</Tag>
    )
  }, {
    title: '操作',
    key: 'action',
    align: 'center',
    width: 200,
    render: (value, row) => (
      <Fragment>
        {row.active === '0' &&
          <Popconfirm title="确认启用吗?" onConfirm={() => updateActive(row, '1')}>
            <a>启用</a>
          </Popconfirm>}
        {row.active === '1' &&
          <Popconfirm title="确认停用吗?" onConfirm={() => updateActive(row, '0')}>
            <a>停用</a>
          </Popconfirm>}
        <Divider type="vertical" />
        <a onClick={() => { queryContent(row) }}>编辑</a>
        <Divider type="vertical" />
        <Popconfirm title="确认删除吗?" onConfirm={() => removeRecord(row)}>
          <a>删除</a>
        </Popconfirm>
      </Fragment>
    ),
  }]

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
        placeholder: '请输入图文编码 / 标题...',
        field: 'keywords',
        label: '查询条件'
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
            buttonText: '新增',
            style: { marginLeft: '8px' },
            onClick: () => { setEditVisible(true); setRecord(null); }
          },
        ]
      }
    ]
  }

  return (
    <DomRoot>
      {/* 查询条件区域 */}
      <Card>
        <SmartTop handleSubmit={ queryText} getFields={getFields} onRef={TopRef}><div /></SmartTop>
      </Card>
      {/* 表格 */}
      <Card style={{ marginTop: 8 }}>
        {textList &&
          <Table
            bordered
            size="small"
            columns={tableColumns}
            dataSource={textList}
          />
        }
      </Card>
      {/* 编辑弹出框 */}
      <Modal
        visible={editVisible}
        title='图文编辑'
        onCancel={() => setEditVisible(false)}
        width={1000}
        footer={null}
        destroyOnClose
      >
        <Edit
          record={record}
          textTypeList={textTypeList}
          hospitalId={hospitalId.current}
          onOk={() => {
            setEditVisible(false);
            queryText(null);
          }}
        />
      </Modal>
    </DomRoot>
  )
}

export default () => (
  <KeepAlive>
    <Text />
  </KeepAlive>
)
