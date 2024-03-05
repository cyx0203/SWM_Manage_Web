import { useEffect, useState } from 'react';
import { DomRoot, Ajax, KeepAlive } from '@/components/PageRoot';
import { Card, Table, Input } from 'antd';
import { forEach } from 'lodash';

const { Search } = Input;

const Stat = () => {

  const [surveyList, setSurveyList] = useState(null);
  const [resultData, setResultData] = useState(null);

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
    Ajax.Post('SurveyUrl', '/manage/getQuestionResult',
      {
        keywords
      },
      (ret: any) => {
        const length = ret.list.length;
        const arr = [];
        if (length > 0) {
          const preData = ret.list
          forEach(preData, (o) => {
            const option1 = o.option1;
            const option2 = o.option2;
            o.option1 = o.option1 ? Math.round(o.option1 / o.count * 100) : 0;
            o.option2 = o.option2 ? Math.round(o.option2 / o.count * 100) : 0;
            o.option3 = o.option3 ? Math.round(o.option3 / o.count * 100) : 0;
            o.rate = (option1 && option2) ? Math.round((option1 + option2) / o.count * 100) : (o.option1 ? o.option1 : (o.option2 ? o.option2 : 0));
            arr.push(o)
          })
        }
        setResultData(arr);
      }
    );
  }

  useEffect(() => {
    querySurvey(null);
    queryResult(null);
  }, []);

  const expandedRowRender = (record: any) => {
    const columns = [
      { title: '问题', dataIndex: 'question', key: 'question' },
      { title: '参评人次', dataIndex: 'count', key: 'count' },
      { title: '满意', dataIndex: 'option1', key: 'option1' },
      { title: '基本满意', dataIndex: 'option2', key: 'option2' },
      { title: '不满意', dataIndex: 'option3', key: 'option3' },
      { title: '满意率', dataIndex: 'rate', key: 'rate' },
    ];

    const expandData = [];
    let i = 1;

    forEach(resultData, (item) => {
      if (record.questionId === item.questionId) {
        item.question = (i === resultData.length) ? item.question : i + "、" + item.question;
        item.option1 = (item.option1 !== 0) ? item.option1 + "%" : "";
        item.option2 = (item.option2 !== 0) ? item.option2 + "%" : "";
        item.option3 = (item.option3 !== 0) ? item.option3 + "%" : "";
        item.rate = (item.rate !== 0) ? item.rate + "%" : "";
        expandData.push(item);
        i++;
      }
    });
    return <Table columns={columns} dataSource={expandData} pagination={false} />;
  };

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
            expandable={{ expandedRowRender, expandRowByClick: true }}
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