import {  useEffect, useState } from 'react';
import { DomRoot, Ajax, KeepAlive } from '@/components/PageRoot';
import { Card, Table, Input } from 'antd';
import ChartsItem from './chartsItem';
import { forEach } from 'lodash';

const { Search } = Input;

const Stat = () => {

  const [surveyList, setSurveyList] = useState(null);
  const [itemsList, setItemsList] = useState(null);

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

  const queryResult = (keywords) => {
    Ajax.Post('SurveyUrl', '/manage/getQuestionResultForCharts',
      {
        keywords
      },
      (ret: any) => {
        const length = ret.list.length;
        if (length > 0) {
          setItemsList(ret.list)
        }
      }
    );
  }

  useEffect(() => {
    querySurvey(null);
    queryResult(null);
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-shadow
  const expandedRowRender = (record: any) => {
    const itemList = [];
    forEach(itemsList, (item) => {
      if (record.questionId === item.questionId) {
        itemList.push(item);
      }
    });
    return <ChartsItem itemList={itemList} />
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
    </DomRoot>
  )
}

export default () => (
  <KeepAlive>
    <Stat />
  </KeepAlive>
)