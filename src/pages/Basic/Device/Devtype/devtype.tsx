import { Fragment, useEffect, useState } from 'react';
import { DomRoot, Ajax, KeepAlive } from '@/components/PageRoot';
import { Card, Table, Button, Divider, Popconfirm, message } from 'antd';
import SmartTable from '@/components/SmartTable';
import Edit from './edit';
import Editmodel from './editmodel';
import Editpas from './editpas';

const DevType = () => {

  const [devTypeList, setDevTypeList] = useState(null);//设备类型集合
  const [devModelList, setDevModelList] = useState([]);//设备型号集合
  const [devModelByTypeIdList, setDevModelByTypeIdList] = useState([]);//固定设备类型的设备型号集合
  const [editVisible, setEditVisible] = useState(false);//设备类型显示状态
  const [editPasVisible, setEditPasVisible] = useState(false);//设备部件显示状态
  const [editmodelVisible, setEditModelVisible] = useState(false);//设备型号显示状态
  const [record, setRecord] = useState({});//当前记录
  const [modelInfo, setEModelInfo] = useState(null);//当前设备型号
  const [devTypeId, setdevTypeId] = useState('');//设备类型ID
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);//展开rowkey

  /**
   * 查找设备类型
   * @param keywords 
   */
  const queryDevType = (keywords) => {
    Ajax.Post('BasicUrl', '/manage/devType.selectAll',
      {
        ...keywords,
      },
      (ret: any) => {
        ret.list.forEach((row, index) => {
          row.rowKey = index;
        })
        setDevTypeList(ret)
      }
    );
  }

  const queryDevModel = (keywords) => {
    Ajax.Post('BasicUrl', '/manage/devModel.selectAll',
      {
        ...keywords,
      },
      (ret: any) => {
        console.log(JSON.stringify(ret))
        setDevModelList(ret.list)
      }
    );
  }

  useEffect(() => {
    queryDevType(null);
    queryDevModel(null);
  }, [devModelByTypeIdList]);

  const handleExpand = (expanded, row) => {
    setDevModelByTypeIdList(null);
    const list = [];
    devModelList.forEach((dev) => {
      if (dev.type_id === row.id) {
        list.push(dev);
      }
    });
    setDevModelByTypeIdList(list);
    if (expanded) {
      setExpandedRowKeys([row.rowKey])
    } else {
      setExpandedRowKeys([])
    }
  }

  //型号删除
  const deleteModel = (row) => {
    Ajax.Post('BasicUrl', '/manage/devModel.deleteById',
      {
        typeId: row.type_id,
        model: row.model
      },
      (ret: any) => {
        message.success('删除成功');
        queryDevModel({ typeId: row.type_id });
        handleExpand(false, {});
      }
    );
  }

  const expandedRowRender = () => {
    const columns: any = [
      {
        title: '设备型号',
        dataIndex: 'model',
      }, {
        title: '设备品牌',
        dataIndex: 'mark',
      }, {
        title: '设备厂家名称',
        dataIndex: 'ftyName',
      }, {
        title: '操作', align: 'center', dataIndex: '',
        render: (text, row) => (
          <Fragment>
            <a onClick={() => { setEditModelVisible(true); setdevTypeId(row.type_id); setEModelInfo(row); }}>修改</a>
            <Divider type="vertical" />
            <Popconfirm title="确认删除吗?" onConfirm={() => deleteModel(row)}>
              <a style={{ marginLeft: 10 }}>删除</a>
            </Popconfirm>
          </Fragment>
        ),
      }
    ];
    return <div style={{ backgroundColor: '#fff', padding: 15, borderRadius: 8 }}><Table pagination={false} columns={columns} dataSource={devModelByTypeIdList} /></div>;
  }

  const removeRecord = (row) => {
    Ajax.Post('BasicUrl', '/manage/devType.deleteById',
      {
        id: row.id
      },
      (ret: any) => {
        message.success('删除成功');
        queryDevType(null);
        handleExpand(false, {});
      }
    );
  }

  const tableColumns: any = [{
    title: '设备类型编号',
    dataIndex: 'id',
  }, {
    title: '设备类型名称',
    dataIndex: 'name',
  },
  {
    title: '操作',
    key: 'action',
    align: 'center',
    width: 300,
    render: (value, row, index) => (
      <Fragment>
        <a style={{ marginRight: 10 }} onClick={() => {
          setdevTypeId(row.id); setEModelInfo(null); setRecord(row);
          setEditModelVisible(true);
        }}>新增型号</a>
        <a style={{ marginRight: 10 }} onClick={() => {
          setRecord(row);
          setEditPasVisible(true);
          setdevTypeId(row.id)
        }}>编辑部件</a>
        <a onClick={() => { setRecord(row); setEditVisible(true) }}>
          编辑类型</a>
        <Divider type="vertical" />
        <Popconfirm title="确认删除吗?" onConfirm={() => removeRecord(row)}>
          <a>删除</a>
        </Popconfirm>
      </Fragment>
    ),
  },
  ]

  return (
    <DomRoot>
      {/* 新增设备类型 */}
      <Button type='primary' style={{ marginLeft: 20 }} onClick={() => { setEditVisible(true); setRecord(null) }}>新增</Button>
      {/* 表格 */}
      <Card style={{ marginTop: 8 }}>
        {devTypeList &&
          <SmartTable
            bordered
            size="small"
            columns={tableColumns}
            dataSource={devTypeList}
            openPagination={true}
            handleChange={(params) => queryDevType(params)}
            expandedRowKeys={expandedRowKeys}
            rowKey={row => row.rowKey}
            onExpand={handleExpand}
            expandedRowRender={() => expandedRowRender()} //额外展开的行
          />
        }
      </Card>
      {/* 设备类型编辑弹出框 */}
      <Edit
        visible={editVisible}
        record={record}
        onClose={() => setEditVisible(false)}
        onOk={() => {
          setEditVisible(false);
          queryDevType(null);
        }}
      />
      {/* 设备部件编辑弹出框 */}
      <Editpas
        visible={editPasVisible}
        record={record}
        onClose={() => setEditPasVisible(false)}
        onOk={() => {
          setEditPasVisible(false);
          queryDevType(null);
        }}
      />
      {/* 设备型号编辑弹出框 */}
      <Editmodel
        visible={editmodelVisible}
        devTypeId={devTypeId}
        modelInfo={modelInfo}
        onClose={() => setEditModelVisible(false)}
        onOk={() => {
          setEditModelVisible(false);
          queryDevModel({});
          // handleExpand(true,{});
        }}
      />
    </DomRoot>
  )
}

export default () => (
  <KeepAlive>
    <DevType />
  </KeepAlive>)
