import { useEffect, useState } from 'react';
import { DomRoot, Ajax, KeepAlive } from '@/components/PageRoot';
import { Card, Tag, Table, Input } from 'antd';

const { Search } = Input;

const Project = () => {

  const [merProjList, setMerProjList] = useState(null);

  const queryProject = (keywords) => {
    Ajax.Post('BasicUrl', '/manage/project.selectAll',
      {
        branchList: '0000',
        ...keywords,
      },
      (ret: any) => {
        setMerProjList(ret.list)
      }
    );
  }

  useEffect(() => {
    queryProject(null);
  }, []);

  const getColumns = () => {
    return [{
      title: '城市',
      dataIndex: 'branchLv2Name',
    }, {
      title: '地区',
      dataIndex: 'branchLv3Name',
    }, {
      title: '项目编号',
      dataIndex: 'id',
    }, {
      title: '项目名称',
      dataIndex: 'name',
    }, {
      title: '项目类型',
      dataIndex: 'type',
      render: (text) => (
        text === '1' ? '线上项目' : '其他'
      )
    }, {
      title: '状态',
      dataIndex: 'is_open',
      render: (text) => (
        text === 'Y' ? <Tag color="green">启用</Tag> : <Tag color="red">停用</Tag>
      )
    }, {
      title: '最后更新时间',
      dataIndex: 'updateTimeFormat',
    }]
  };

  return (
    <DomRoot>
      <Card>
        <Search
          placeholder="请输入项目编号 / 名称..."
          enterButton="查询"
          style={{ width: 400 }}
          onSearch={value => queryProject({ keywords: value })}
        />
      </Card>
      <Card style={{ marginTop: 8 }}>
        {merProjList &&
          <Table
            bordered
            size="small"
            columns={getColumns()}
            dataSource={merProjList}
          />}
      </Card>
    </DomRoot>
  );
}

export default () => (
  <KeepAlive>
    <Project />
  </KeepAlive>
)
