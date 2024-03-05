import { KeepAlive } from '@/components';
import { CloudDownloadOutlined, CloudUploadOutlined } from '@ant-design/icons';
import { ProTable } from '@ant-design/pro-components';
import type { ActionType } from '@ant-design/pro-components';
import { Button, message, Popconfirm, Space } from 'antd';
import { useEffect, useRef, useState } from 'react';
import _columns from './columns';
import styles from './index.module.less';
import { Ajax } from '@/core/trade';
import { useModel } from 'umi';
import { keys, omit } from 'lodash/fp';
import { DomRoot } from '@/components/PageRoot';
import EditDoctor from './editDoctor';

// const mapper = o => c => o[c];

// const r = o => compose(join('，'), map(mapper(o)), split(','));

const constructing = () => message.warning('正在开发中');

const confirmDeleteDoctor = (doctor: Triage.Doctor) => (
  <p>
    确认删除<b>{doctor.name}</b>医生吗
  </p>
);

function Doctor() {
  const actionRef = useRef<ActionType>();
  const { initialState } = useModel('@@initialState');

  const { currentUser } = initialState;

  const [levels, setLevels] = useState<Record<string, string>>({});

  const handleSubmit =
    (type: 'update' | 'insert') => async (values: Partial<Triage.Doctor>) => {
      const params = {
        ...values,
        account: 'admin',
        expire: 86400,
      };
      switch (type) {
        case 'update': {
          // const res = await Ajax.Post('Triage', '/api/employee.update', params);
          const res = await Ajax.Post('Triage', '/updateEmployee', params);
          if (res?.success) {
            message.success('更新成功');
          }
          actionRef.current.reload();
          return res?.success;
        }
        case 'insert': {
          // const res = await Ajax.Post('Triage', '/api/employee.insertBatch', params);
          const res = await Ajax.Post('Triage', '/addEmployee', params);
          if (res?.success) {
            message.success('新增成功');
          }
          actionRef.current.reload();
          return res?.success;
        }
        default:
          break;
      }
      return true;
    };

  const renderToolbar = () => [
    <EditDoctor level={levels} onSubmit={handleSubmit('insert')} />,
    <Button key='output' icon={<CloudDownloadOutlined />} onClick={constructing}>
      导出
    </Button>,
    <Button key='upload' icon={<CloudUploadOutlined />} onClick={constructing}>
      批量上传
    </Button>,
  ];

  const columns = _columns.concat([
    {
      title: '操作',
      key: 'option',
      valueType: 'option',
      align: 'center',
      render(dom, entity, index, action, schema) {
        return (
          <Space>
            <EditDoctor {...entity} level={levels} onSubmit={handleSubmit('update')} />
            <Popconfirm
              trigger='click'
              title={confirmDeleteDoctor(entity)}
              placement='left'
              onConfirm={() => handleDelete(entity)}
            >
              <a className={styles.delete}>删除</a>
            </Popconfirm>
          </Space>
        );
      },
    },
  ]);

  /** 每次刷新的时候都会把科室列表放进筛选中 */
  columns.find(v => v.dataIndex === 'level').valueEnum = levels;

  /**
   * 查询医生列表
   */
  const fetchDoctors = async params => {
    const requestParams = {
      ...params,
      account: currentUser.name,
      expire: 86400,
    };
    // const res = await Ajax.Post('Triage', '/api/employee.selectForManage', requestParams);
    const res = await Ajax.Post('Triage', '/queryEmployee', requestParams);
    return res;
  };

  /**
   * 查询科室列表，科室ID - 科室名
   * @param params
   */
  const fetchLevels = async (params = {}) => {
    const requestParams = {
      ...params,
      key: 'id',
      value: 'name',
      // expire: 86400,
      // key: 'id',
      // retKey: 'data',
      // type: 2,
      // value: 'name',
    };
    const res = await Ajax.Post(
      'Triage',
      // '/api/kv/level.selectByPrimaryKey',
      '/queryLevel',
      // '/queryLevelKV',
      requestParams,
    );
    if (res) {
      // setLevels(res.data.kv);
      // setLevels(res);
      setLevels(res.list.kv);
    }
  };

  const handleDelete = async (doctor: Partial<Triage.Doctor> = {}) => {
    const requestParams = {
      ...omit(['level'])(doctor),
      expire: 86400,
      account: currentUser.name,
    };
    const res = await Ajax.Post(
      'Triage',
      // '/api/employee.deleteByPrimaryKey',
      '/deleteEmployee',
      requestParams,
    );
    if (res?.success) {
      actionRef.current.reload();
      message.success(`医生 ${doctor.name} 已从记录中移除`);
    }
  };

  useEffect(() => {
    fetchLevels();
  }, []);

  return (
    <DomRoot>
      <ProTable<Triage.Doctor>
        actionRef={actionRef}
        className={styles.wrapper}
        columns={columns}
        toolBarRender={renderToolbar}
        params={{ lvs: levels }}
        request={async ({ lvs, pageSize, current: currentPage, level: lv = '' }) => {
          let composed = [];
          let total = 1;
          const initialed = Boolean(keys(lvs).length);
          if (initialed) {
            const res = await fetchDoctors({
              pageSize,
              currentPage,
              // idLevel: lv.join(','),
              idLevel: lv,
            });
            // composed = res.list.map(v => ({ ...v, level: r(lvs)(v.idLevels) }));
            composed = res.list.map(v => ({ ...v, level: lvs }));
            total = res.pagination.total;
          }
          return {
            data: composed,
            success: initialed,
            total,
          };
        }}
        pagination={{
          pageSize: 10,
        }}
      />
    </DomRoot>
  );
}

export default () => (
  <KeepAlive>
    <Doctor />
  </KeepAlive>
);
