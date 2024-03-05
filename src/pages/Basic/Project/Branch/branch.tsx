import { useEffect, useState } from 'react';
import { DomRoot, Ajax, KeepAlive } from '@/components/PageRoot';
import { Card, Popconfirm, Tree, Row, Col, Modal, message } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import Edit from "./edit";

const Branch = () => {
  const [datasource, setDatasource] = useState([]); //目录数据
  const [allId, setAllId] = useState([]); //所有id，添加时需要判断id有没有被占用
  const [record, setRecord] = useState(null); //点击的当前记录数据
  const [editVisible, setEditVisible] = useState(false); //模态框显示状态
  const [flag, setFlag] = useState(false); //标志新增与修改

  
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
  
  const dealData = (params) => {
    return params?.map((item) => ({
      ...item,
      title: setTreeTitle(item),
      children: item.children ? dealData(item.children) : []
    }));

  }

  //查询hospBranch的数据
  const queryBranch = () => {
    Ajax.Post('BasicUrl', '/manage/tree/comBranch.selectList', 
      {
        childName: 'children',
        retKey: 'branchTree',
        root: "0000",
        id: "id",
        parentid: "par_id" 
      },
      (ret: any) => {
        //组成Tree组件需要的格式
        const data = dealData(ret.branchTree);
        console.log(data);
        setDatasource(data);
      });
  }

  useEffect(() => {
    queryBranch();
  }, []);

  //删除
  const removeById = (id) => {
    Ajax.Post('BasicUrl', '/manage/comBranch.delete', 
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

  return (
    <DomRoot>
      <Card>
        {datasource.length > 0 &&
          <Tree
            showLine
            switcherIcon={<DownOutlined />}
            treeData={datasource}
            blockNode
            defaultExpandAll
          />
        }
      </Card>

      <Edit
        visible={editVisible}
        record={record}
        flag={flag}
        onClose={() => setEditVisible(false)}
        onOk={() => {
          setEditVisible(false);
          queryBranch();
        }}
      />
    </DomRoot>
  )
}



export default () => (
  <KeepAlive>
    <Branch />
  </KeepAlive>
)