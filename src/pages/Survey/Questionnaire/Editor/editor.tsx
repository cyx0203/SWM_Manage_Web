import { Fragment, useEffect, useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { DomRoot, Ajax, KeepAlive } from '@/components/PageRoot';
import { Card, Table, Input, Button, Divider, Popconfirm, message } from 'antd';
import Create from './create';
import Item from './item';
import CreateItem from './createItem';

import { forEach, isEmpty } from 'lodash';

const { Search } = Input;

const Editor = () => {

  const [surveyList, setSurveyList] = useState(null);
  const [itemsList, setItemsList] = useState(null);
  const [createVisible, setCreateVisible] = useState(false);
  const [createItemVisible, setCreateItemVisible] = useState(false);
  const [record, setRecord] = useState(null);

  const [order, setOrder] = useState(1);

  const querySurvey = (keywords) => {
    Ajax.Post('SurveyUrl', '/manage/questionSurveyMain.selectAll',
      {
        ...keywords,
        hospitalId: localStorage.getItem('hospitalId'),
      },
      (ret: any) => {
        if (ret.list.length > 0) {
          // 添加“key”，解决分条展开问题
          for (let i = 0; i < ret.list.length; i++) {
            ret.list[i].key = i.toString();
          }
          setSurveyList(ret.list)
        }
      }
    );
  }

  const queryItems = (keywords) => {
    // Ajax.Post('SurveyUrl', '/manage/questionSurveyItem.selectAll',
    Ajax.Post('SurveyUrl', '/manage/getQuestionItems',
      {
        keywords
      },
      (ret: any) => {
        const length = ret.list.length;
        if (length > 0) {
          setItemsList(ret.list)
          setOrder(ret.list[length - 1].order + 1)
        }
      }
    );
  }

  useEffect(() => {
    querySurvey(null);
    queryItems(null);
  }, []);

  const deleteSurvey = (row) => {
    let url = '/manage/questionSurveyMain.deleteById';
    if (!(isEmpty(itemsList))) {
      itemsList.forEach(e => {
        if (row.questionId === e.questionId) {
          url = '/manage/questionSurveyMain.deleteAllById'
          return;
        }
      });
    }
    Ajax.Post('SurveyUrl', url,
      {
        questionId: row.questionId
      },
      (ret: any) => {
        message.success('删除成功');
        querySurvey(null);
      }
    );
  }

  const changeOrder = (i) => {
    setOrder(i)
  }

  // eslint-disable-next-line @typescript-eslint/no-shadow
  const expandedRowRender = (record: any) => {
    const itemList = [];
    forEach(itemsList, (item) => {
      if (record.questionId === item.questionId) {
        itemList.push(item);
      }
    });
    return <Item itemList={itemList} onOk={() => { queryItems(null) }} />
  }

  const tableColumns: any = [{
    title: '问卷标题',
    dataIndex: 'title',
  }, {
    title: '问卷编号',
    dataIndex: 'questionId',
  }, {
    title: '创建人',
    dataIndex: 'createUserName',
  }, {
    title: '创建时间',
    dataIndex: 'createTimeFormat',
  },
  {
    title: '操作',
    dataIndex: '',
    align: 'center',
    width: 200,
    render: (row) => (
      <Fragment>
        <a onClick={() => { setCreateItemVisible(true); setRecord(row) }}>新增</a>
        <Divider type="vertical" />
        <Popconfirm title="确认删除此问卷吗?" onConfirm={() => deleteSurvey(row)} >
          <a>删除</a>
        </Popconfirm>
      </Fragment>
    ),
  }]

  return (
    <DomRoot>
      {/* 查询条件区域 */}
      <Card>
        <Search
          placeholder="请输入问卷标题..."
          enterButton="查询"
          style={{ width: 400 }}
          onSearch={value => querySurvey({ keywords: value })}
        />
        <Button type='primary' style={{ marginLeft: 20 }} onClick={() => { setCreateVisible(true) }} icon={<PlusOutlined />} >新增</Button>
      </Card>
      {/* 表格 */}
      <Card style={{ marginTop: 8 }}>
        {surveyList &&
          <Table
            bordered
            size="small"
            columns={tableColumns}
            dataSource={surveyList}
            pagination={false}
            // expandable={{ expandedRowRender, defaultExpandedRowKeys: ['0'] }}
            expandable={{ expandedRowRender }}
          />
        }
      </Card>
      {/* 新增弹出框 */}
      <Create
        visible={createVisible}
        onClose={() => setCreateVisible(false)}
        onOk={() => {
          setCreateVisible(false);
          querySurvey(null);
          queryItems(null)
        }}
      />
      {/* 问卷新增选项弹出框 */}
      <CreateItem
        visible={createItemVisible}
        onClose={() => {
          setCreateItemVisible(false)
        }}
        onOk={() => {
          setCreateItemVisible(false);
          querySurvey(null);
          queryItems(null)
        }}
        record={record}
        order={order}
        changeOrder={changeOrder}
      />
    </DomRoot>
  )
}

export default () => (
  <KeepAlive>
    <Editor />
  </KeepAlive>
)