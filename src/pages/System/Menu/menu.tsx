import { useEffect, useState } from 'react';
import { DomRoot, Ajax, KeepAlive } from '@/components/PageRoot';
import { Card, Popconfirm, Tree, Row, Col, Modal, message } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import Edit from './edit';

const Menu = () => {
  const [datasource, setDatasource] = useState([]); //目录数据
  const [allId, setAllId] = useState([]); //所有id，添加时需要判断id有没有被占用
  const [record, setRecord] = useState(null); //点击的当前记录数据
  const [flag, setFlag] = useState(false); //标志新增与修改
  const [editVisible, setEditVisible] = useState(false); //模态框显示状态

  //组装Tree格式数据
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
      const pid = item.parentId;
      const treeItem = itemMap[id]; //每一个数据
      //如果是第一层数据,直接push 到结果数据
      if (pid === 0) {
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

  const setTreeTitle = (item) => {
    //说明是第三层级
    if (item.path.split('/').length == 4) {
      return (
        <Row gutter={16}>
          <Col span={3}>{item.name}</Col>
          <Col><a onClick={() => { setEditVisible(true); setRecord(item); setFlag(true) }}>修改</a></Col>
          <Col>
            <Popconfirm title="确认删除吗?" onConfirm={() => { removeById(item.id) }}>
              <a>删除</a>
            </Popconfirm>
          </Col>
        </Row>
      )
    } else if (item.path == '/') {
      //说明是主菜单
      return (
        <Row gutter={16}>
          <Col span={2}>{item.name}</Col>
          <Col offset={1}><a onClick={() => { setEditVisible(true); setRecord(item); setFlag(false) }}>新增产品</a></Col>
        </Row>
      )
    } else {
      return (
        <Row gutter={16}>
          <Col span={2}>{item.name}</Col>
          <Col offset={1}><a onClick={() => { setEditVisible(true); setRecord(item); setFlag(false) }}>新增业务</a></Col>
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

  //查询menu表的所有数据
  const queryMenu = () => {
    Ajax.Post('BasicUrl', '/manage/menu.selectAll',
      {
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
        //组成Tree组件需要的格式
        const data = arrayToTree(list);
        setDatasource(data);
      });
  }

  //删除
  const removeById = (id) => {
    Ajax.Post('BasicUrl', '/manage/menu/delete',
      {
        id
      },
      (ret: any) => {
        if (ret.success) {
          message.success('删除成功');
        } else {
          message.error('删除失败');
        }
        queryMenu();
      });
  }

  useEffect(() => {
    queryMenu();
  }, []);

  return (
    <DomRoot>
      <Card>
      {datasource.length > 0 &&
      <Tree
          showLine
          switcherIcon={<DownOutlined />}
          treeData={datasource}
          blockNode
          defaultExpandedKeys={['1']}
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
          onSuccess={() => {
            setEditVisible(false);
            queryMenu();
          }} />
      </Modal>
    </DomRoot>
  )
}

export default () => (
  <KeepAlive>
    <Menu />
  </KeepAlive>
)
