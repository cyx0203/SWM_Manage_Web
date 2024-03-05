import { useEffect, useState } from 'react';
import { DomRoot, Ajax } from '@/components/PageRoot';
import { Card, Tag, Table, Input, Button, message, Popconfirm } from 'antd';
import Create from './create';

export default () => {

  const [hospCfgList, setHospCfgList] = useState(null);

  constructor(props) {
    super(props);
    this.state = {
      createVisible: false,
    };
  }

  componentDidMount() {
    this.queryHospCfg();
  }

  queryHospCfg = (keywords) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'content/fetch',
      payload: {
        url: 'hospCfg.selectAll',
        ...keywords,
        listKey: 'hospCfgList',
        closePagination: true,
      },
    });
  }

  deleteChannel = (record) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'content/fetch',
      payload: {
        url: 'hospCfg.selectAll',
        hospitalId: localStorage.getItem('hospitalId'),
        id: record.id
      },
      callback: () => {
        message.success('删除成功');
        this.queryHospCfg();
      }
    });
  }

  updateStatus = (record, serviceStatus) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'content/fetch',
      payload: {
        url: 'hospCfg.update',
        hospitalId: record.hospital_id,
        projId: record.proj_id,
        serviceStatus
      },
      callback: () => {
        message.success('操作成功');
        this.queryHospCfg();
      }
    });
  }

  getColumns = () => {
    return [{
      title: '医院编号',
      dataIndex: 'hospital_id',
    }, {
      title: '医院名称',
      dataIndex: 'hospitalName',
    }, {
      title: '绑定项目名称',
      dataIndex: 'projName',
    }, {
      title: '更新时间',
      dataIndex: 'updateTimeFormat',
    }, {
      title: '状态',
      dataIndex: 'service_status',
      render: (text) => (
        text === 'Y' ? <Tag color="green">启用</Tag> : <Tag color="red">停用</Tag>
      )
    }, {
      title: '操作',
      dataIndex: 'service_status',
      render: (text, record) => (
        <Fragment>
          {text === 'N' &&
            <Popconfirm title="确认启用吗?" onConfirm={() => this.updateStatus(record, 'Y')}>
              <a style={{ marginRight: 10 }}>启用</a>
            </Popconfirm>}
          {text === 'Y' &&
            <Popconfirm title="确认停用吗?" onConfirm={() => this.updateStatus(record, 'N')}>
              <a style={{ marginRight: 10 }}>停用</a>
            </Popconfirm>}
          <Popconfirm title="确认删除吗?" onConfirm={() => this.deleteChannel(record)}>
            <a>删除</a>
          </Popconfirm>
        </Fragment>
      )
    }]
  };

  render() {
    const { Search } = Input;
    const { loading, content: { hospCfgList } } = this.props;
    const { createVisible } = this.state;
    return (
      <Fragment>
        <Card bordered={false}>
          <Search
            placeholder="请输入医院或项目编号 / 名称..."
            enterButton="查询"
            style={{ width: 400 }}
            onSearch={value => this.queryHospCfg({ keywords: value })}
          />
          <Button
            icon='plus'
            style={{ marginLeft: 8 }}
            onClick={() => this.setState({ createVisible: true, })}
          >新增绑定关系
          </Button>
        </Card>
        <Card style={{ margin: 8 }}>
          {hospCfgList && hospCfgList.list &&
            <Table
              size="small"
              loading={loading}
              columns={this.getColumns()}
              dataSource={hospCfgList.list}
            />
          }
        </Card>
        {/* 绑定项目和医院 */}
        <Create
          visible={createVisible}
          onClose={() => this.setState({ createVisible: false })}
          onOk={() => {
            this.setState({ createVisible: false })
            this.queryHospCfg();
          }}
        />
      </Fragment>
    );
  }
}
