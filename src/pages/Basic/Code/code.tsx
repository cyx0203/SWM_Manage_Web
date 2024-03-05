import { useEffect, useState } from 'react';
import { DomRoot, Ajax, KeepAlive } from '@/components/PageRoot';
import { Card, Table,Input, Button, Popconfirm,Space } from 'antd';
import Edit from './edit';

const { Search } = Input;


const Code = () => {
  const [datasource, setDatasource] = useState([]); //一级目录数据
  const [childDatasource, setChildDatasource] = useState([]); //存储二级目录数据
  const [record, setRecord] = useState(null); //点击的当前记录
  const [editVisible, setEditVisible] = useState(false); //模态框显示状态
  const [code, setCode] = useState(null); //新增时的父id
  const [editFlag, setEditFlag] = useState(false); //标识是否是一级目录的编辑
  const [hasChild, setHasChild] = useState(false); //判断是否有子记录

  //查询一级目录
  const queryParentCode = (keywords) =>{
    Ajax.Post('BasicUrl', '/manage/code.selectParent',
    {
      ...keywords,
    },
    (ret: any) => {
      //加工数组，每条记录增加key
      const newList = ret.list.map((item)=>{
        return {...item,key:item.value}
      })
      setDatasource(newList);
    }
    );
  }

  //查询所有的二级目录
  const queryChildrenCode = (keywords) =>{
    Ajax.Post('BasicUrl', '/manage/code.selectChildren',
    {
      ...keywords,
    },
    (ret: any) => {  
      //加工数组，每条记录增加key
      const newList = ret.list.map((item)=>{
        return {...item,key:item.value}
      })
      setChildDatasource(newList);
    }
    );
  }

  useEffect(() => {
    queryParentCode(null);
    queryChildrenCode(null);
  }, []);

  //根据par_code从二级目录中获取对应的子数据
  const fileterChildrenCoade = (arr, parId) => {
    const result = arr.filter((item)=>{
      if(item.parId === parId){
        return item;
      }
    });
    return result;
  }

  //判断是否有子记录
  const judgeHasChild = (arr, parId) => {
    let result = false;
    arr.forEach((item)=>{
      if(item.parId === parId){
        result = true;
      }
    })
    return result;
  }
  
  //根据id和parId进行删除
  const removeRecord = (id, parId) => {
    Ajax.Post('BasicUrl', '/manage/code.deleteById',
    {
      id,
      parId
    },
    (ret: any) => {
      queryParentCode(null);
      queryChildrenCode(null);
    }
    );
  }

  //删除对应的一级目录与二级目录
  const removeAllRecord = (id,parId) => {
    Ajax.Post('BasicUrl', '/manage/code.deleteAllById',
    {
      id,
      parId
    },
    (ret: any) => {
      queryParentCode(null);
      queryChildrenCode(null);
    }
    );
  }
  
  //一级目录的列表配置
  const columns = [
    {
      title: '代码',
      dataIndex: 'value',
      key: 'value',
    },
    {
      title: '名称',
      dataIndex: 'txt',
      key: 'txt',
    },
    {
      title: '笔记',
      dataIndex: 'note',
      key: 'note',
    },
    {
      title: '备注',
      dataIndex: 'pad1',
      key: 'pad1',
    },
    {
      title: '操作',
      key: 'action',
      render: (_, row) => (
        <Space size="middle">
          <a onClick={()=>{setEditVisible(true); setRecord(null); setCode(row.value);setEditFlag(false);}}>新增</a>
          <a onClick={()=>{setEditVisible(true); setRecord(row); setEditFlag(true);setHasChild(judgeHasChild(childDatasource,row.value))}}>修改</a>
          <Popconfirm title="确认删除吗?" onConfirm={() => {removeAllRecord(row.value,'##')}}>
            <a>删除</a>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  //二级目录的列表配置
  const expandedRowRender = secondRecord => {
    const secondColumns = [
      {
        title: '代码',
        dataIndex: 'value',
        key: 'value',
      },
      {
        title: '名称',
        dataIndex: 'txt',
        key: 'txt',
      },
      {
        title: '笔记',
        dataIndex: 'note',
        key: 'note',
      },
      {
        title: '备注',
        dataIndex: 'pad1',
        key: 'pad1',
      },
      {
        title: '操作',
        key: 'action',
        render: (_, row) => (
          <Space size="middle">
            <a onClick={()=>{setEditVisible(true); setRecord(row);setEditFlag(false);setHasChild(false)}}>修改</a>
            <Popconfirm title="确认删除吗?" onConfirm={() => {removeRecord(row.value,row.parId)}}>
            <a>删除</a>
          </Popconfirm>
          </Space>
        ),
      },
    ];

    const data = fileterChildrenCoade(childDatasource,secondRecord.value);
    return <div style={{ backgroundColor: '#fff', padding: 15, borderRadius: 8 }}><Table columns={secondColumns} dataSource={data} pagination={false} /></div>;
  };

  //查询按钮的点击事件
  const queryFactory=(keywords)=>{
    Ajax.Post('BasicUrl', '/manage/code.selectByParId',
    {
      ...keywords,
      parId : '##'
    },
    (ret: any) => {  
      //加工数组，每条记录增加key
      const newList = ret.list.map((item)=>{
        return {...item,key:item.value}
      })
      setDatasource(newList);
    }
    );
  }
  
  return (
    <DomRoot>
      <Space direction="vertical" size="middle" style={{
          width: '100%',
        }}>
          <Space direction="horizontal" size="middle" style={{
          width: '100%',
        }}>
            <Search
              placeholder="请输入代码编号 / 代码名称"
              enterButton="查询"
              style={{ width: 400 }}
              onSearch={value => queryFactory({ keywords: value })}
            />
            <Button style={{ marginRight: '8px' }} type="primary" onClick={() => { setEditVisible(true); setRecord(null);setCode('##');setEditFlag(false); }} >
                  +  新建
            </Button>
        </Space>
        
        
        <Card>
          <Table
          size="small"
          columns={columns}
          expandable={{
            expandedRowRender
          }}
          dataSource={datasource}
          />
        </Card>
      </Space>

      <Edit
        visible={editVisible}
        record={record}
        code={code}
        editFlag={editFlag}
        hasChild={hasChild}
        onClose={() => setEditVisible(false)}
        onOk={() => {
          setEditVisible(false);
          queryParentCode(null);
          queryChildrenCode(null);
        }}
      />
      
    </DomRoot>
  )
}

export default () => (
  <KeepAlive>
    <Code />
  </KeepAlive>
)
