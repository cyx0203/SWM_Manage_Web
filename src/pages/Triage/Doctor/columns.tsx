import type { ProColumns } from '@ant-design/pro-components';
import { Avatar, Tag } from 'antd';

export const avatarBaseUrl = 'http://test16781.ggzzrj.cn/queue/';

const columns: ProColumns<Triage.Doctor & { level: string }>[] = [
  {
    title: '序号',
    dataIndex: 'index',
    hideInSearch: true,
    valueType: 'indexBorder',
    tooltip: '排名不分先后',
  },
  {
    title: '医生编号',
    dataIndex: 'id',
    hideInSearch: true,
  },
  {
    title: '医生姓名',
    dataIndex: 'name',
    fieldProps: {
      // placeholder: '支持拼音搜索',
    },
  },
  {
    title: '登录账号',
    dataIndex: 'username',
    hideInSearch: true,
  },
  {
    title: '照片',
    dataIndex: 'photo',
    hideInSearch: true,
    valueType: 'avatar',
    render(dom, entity, index, action, schema) {
      return <Avatar src={avatarBaseUrl + entity.photo} shape='square' />;
    },
  },
  {
    title: '所属科室',
    dataIndex: 'level',
    valueType: 'select',
    fieldProps: {
      // placeholder: '支持拼音搜索',
      // mode: 'multiple',
    },
    // render: (_, entity) => entity.level.split('，').map(v => <Tag key={v}>{v}</Tag>),
    render: (_, entity) =>
      entity.id_levels.split(',').map(v => <Tag key={v}>{entity.level[v]}</Tag>),
  },
  {
    title: '职称',
    dataIndex: 'grade',
    hideInSearch: true,
    render: (_, entity) => (entity.grade ? <Tag color='blue'>{entity.grade}</Tag> : _),
  },
  {
    title: '擅长/简介',
    dataIndex: 'info',
    hideInSearch: true,
  },
];

export default columns;
