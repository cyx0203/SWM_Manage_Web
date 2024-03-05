import { useEffect, useState,useRef } from 'react';
import { DomRoot, Ajax, KeepAlive } from '@/components/PageRoot';
import { Card, Popconfirm, Tree, Row, Col, Modal, message } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import SmartForm from '@/components/SmartForm';
import SmartTop from '@/components/SmartTop';
import Edit from './edit';

const Institution = () => {
  const [datasource, setDatasource] = useState([]); //目录数据
  const [allId, setAllId] = useState([]); //所有id，添加时需要判断id有没有被占用
  const [record, setRecord] = useState(null); //点击的当前记录数据
  const [flag, setFlag] = useState(false); //标志新增与修改
  const [editVisible, setEditVisible] = useState(false); //模态框显示状态
  const [hospitalKV, setHospitalKV] = useState(null);
  const [isCreate, setIsCreate] = useState(false);
  const TopRef = useRef(null);

  const hospitalId: any = useRef(null);

  //生成机构树
  function arrayToTree(arr) {
    const result = []; // 存放结果集
    const itemMap = {}; // 键是id 值是children对象的数据

    // 先转成map存储,键是id
    for (const item of arr) {
      itemMap[item.id] = {
        ...item,
        children: []
      }
    }

    for (const item of arr) {
      const id = item.id;
      const pid = item.parId;
      const treeItem = itemMap[id]; //每一个数据
      //如果是第一层数据,直接push 到结果数据
      if (pid === "####") {
        result.push(treeItem);
      }
      //如果不是第一层,那么放到对应id的children中
      else {
        //如果不存在该pid的数据,取children会报错,因此赋值一个children
        if (!itemMap[pid]) {
          itemMap[pid] = {
            children: [],
          }
        }
        //将子级数据放到对应的children里面
        itemMap[pid].children.push(treeItem)
      }
    }
    return result;
  }

  //查询hospBranch的数据
  const queryBranch = () => {
    Ajax.Post('BasicUrl', '/manage/hospBranch.select', 
      {
        hospitalId : hospitalId.current,
      },
      (ret: any) => {
        const ids = [];
        //添加key与title
        const list = ret.list.map(item => {
          ids.push(item.id)
          return {
            ...item,
            key: item.id + "",
            title: setTreeTitle(item)
          }
        })
        setAllId(ids);
        if (list.length === 0) {
          setIsCreate(true);
        } else {
          setIsCreate(false);
        }
        //组成Tree组件需要的格式
        const data = arrayToTree(list);
        setDatasource(data);
      });
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
        TopRef.current.getForm().setFieldsValue({hospitalId:ret.hospitalKV.tv[0].value});
        queryBranch();
      }
    );
  }

  useEffect(() => {
    queryHospitalTree();
    // queryBranch();
  }, []);

  //删除
  const removeById = (id) => {
    Ajax.Post('BasicUrl', '/manage/hospBranch/delete', 
      {
        id
      },
      (ret: any) => {
        if (ret.success) {
          message.success('删除成功');
        } else {
          message.error('删除失败');
        }
        queryBranch();
      }
    );
  }

  //设置按钮
  const setTreeTitle = (item) => {
    //第三层：科室
    if (item.level == 3) {
      return (
        <Row gutter={16}>
          <Col span={4}>{item.name}</Col>
          <Col><a onClick={() => { setEditVisible(true); setRecord(item); setFlag(true) }}>修改</a></Col>
          <Col>
            <Popconfirm title="确认删除吗?" onConfirm={() => { removeById(item.id) }}>
              <a>删除</a>
            </Popconfirm>
          </Col>
        </Row>
      )
    } else if (item.level == 1) {
      //第一层：主菜单
      return (
        <Row gutter={16}>
          <Col span={3}>{item.name}</Col>
          <Col offset={1}><a onClick={() => { setEditVisible(true); setRecord(item); setFlag(false) }}>新增二级机构</a></Col>
          <Col><a onClick={() => { setEditVisible(true); setRecord(item); setFlag(true) }}>修改</a></Col>
        </Row>
      )
    } else {
      //第二层：部门
      return (
        <Row gutter={16}>
          <Col span={3}>{item.name}</Col>
          <Col offset={1}><a onClick={() => { setEditVisible(true); setRecord(item); setFlag(false) }}>新增三级机构</a></Col>
          <Col><a onClick={() => { setEditVisible(true); setRecord(item); setFlag(true) }}>修改</a></Col>
          <Col>
            <Popconfirm title="确认删除吗?" onConfirm={() => { removeById(item.id) }}>
              <a>删除</a>
            </Popconfirm>
          </Col>
        </Row>
      )
    }
  }

  const changeHandle = (val) => {
    hospitalId.current = val;
    queryBranch();
  }


  const getFields = () => {
    return [
      {
        type: 'select',
        label: '院区',
        style: { width: '250px' },
        field: 'hospitalId',
        options: hospitalKV ? hospitalKV.tv : [],
        placeholder: '请选择院区...',
        required: true,
        onSelect: changeHandle
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
          isCreate && {
            buttonText: '新建一级机构',
            style: { marginLeft: '8px' },
            onClick: () => { setEditVisible(true); setRecord(null); setFlag(false); }
          },
        ]
      }
    ]
  }


  return (
    <DomRoot>
      <Card>
        <SmartTop handleSubmit={queryBranch} getFields={getFields} onRef={TopRef}><div /></SmartTop>
      </Card>
      <Card >
        {datasource.length > 0 &&
          <Tree
            showLine
            switcherIcon={<DownOutlined />}
            treeData={datasource}
            blockNode
            defaultExpandAll={true}
            style={{paddingLeft:'50px'}}
          />
        }
      </Card>

      <Modal
        visible={editVisible}
        title='编辑菜单'
        onCancel={() => {
          setEditVisible(false);
        }}
        width='40%'
        footer={null}
        destroyOnClose
      >
        <Edit
          record={record}
          allId={allId}
          flag={flag}
          isCreate={isCreate}
          hospitalId={hospitalId.current}
          onSuccess={() => {
            setEditVisible(false);
            queryBranch();
          }} 
        />
      </Modal>
    </DomRoot>
  )
}



export default () => (
  <KeepAlive>
    <Institution />
  </KeepAlive>
)