import { KeepAlive } from '@/components';
import { Ajax } from '@/core/trade';
import { DeleteFilled, QuestionCircleFilled, SyncOutlined } from '@ant-design/icons';
import {
  ProForm,
  ProFormDependency,
  ProFormInstance,
  ProFormSelect,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { Button, Card, Col, message, Modal, Result, Space } from 'antd';
import { compose, keys, map } from 'lodash/fp';
import { useEffect, useRef, useState } from 'react';
import { useModel } from 'umi';
import CreateTemplate from './create';
import styles from './index.module.less';

const MODS = o =>
  compose(
    map(v => ({ label: v, value: o[v] })),
    keys,
  )(o);

function Templates() {
  const formRef = useRef<ProFormInstance>();
  const {
    initialState: { currentUser },
  } = useModel('@@initialState');

  const [mods, setMods] = useState<Record<string, string>>({});

  /**
   * 获取模板列表
   * @returns
   */
  const fetchTemplates = async () => {
    // /api/kv/template.selectByPrimaryKey
    const res = await Ajax.Post('Triage', '/queryTemplateKV', {});

    setMods(res || {});

    return res;
  };

  /**
   * 获取某模板的具体配置
   * @param params
   */
  const fetchTemplate = async (params = '') => {
    // /api/template.selectByPrimaryKey
    const res = await Ajax.Post('Triage', '/queryTemplate', {
      expire: 86400,
      account: currentUser?.name,
      template: params,
    });

    const [target] = res?.list || [];

    formRef.current.setFieldValue('json', target?.json);
  };

  /**
   * 更新当前模板的配置
   */
  const updateTemplate = async () => {
    const requestParams = {
      account: currentUser?.name,
      expire: 86400,
      ...formRef.current.getFieldsValue(),
    };

    const res = await Ajax.Post(
      'Triage',
      '/updateTemplate',
      // '/api/template.updateByPrimaryKeySelective',
      requestParams,
    );

    res.success && message.success('更新成功');
  };

  /**
   * 删除当前选中的模板配置
   * @param template
   * @returns
   */
  const deleteTemplate = async (template: string) => {
    const requestParams = {
      // account: currentUser?.name,
      // expire: 86400,
      template,
    };

    const res = await Ajax.Post(
      'Triage',
      '/deleteTemplate',
      // '/api/template.deleteByPrimaryKey',
      requestParams,
    );

    if (res.success) {
      fetchTemplates();
      formRef.current.resetFields(['template', 'json']);
    }

    return res.success;
  };

  /**
   * 打开二次确认，确认则删除该模板配置
   */
  const showDeleteModal = () => {
    const selected = formRef.current.getFieldValue('template');

    Modal.confirm({
      title: `您确定要删除${selected}模板吗`,
      okButtonProps: {
        danger: true,
      },
      okText: '是的，我要删除',
      cancelText: '点错了',
      onOk: async () => deleteTemplate(selected),
    });
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  return (
    <Card>
      <ProForm grid layout='horizontal' formRef={formRef} submitter={false}>
        <ProForm.Group title='预选择' rowProps={{ gutter: [24, 16] }}>
          <ProFormSelect
            name='template'
            options={MODS(mods)}
            colProps={{ span: 8 }}
            label='模板名称'
            className='flex-1'
            fieldProps={{ onChange: fetchTemplate }}
          />
          <Col span={8} />
          <Col span={8}>
            <ProFormDependency name={['template']}>
              {({ template }) => (
                <nav className={styles.submitter}>
                  <Space size={24}>
                    <CreateTemplate
                      mods={mods}
                      afterSubmit={async mod => {
                        await fetchTemplates();
                        formRef.current.setFieldValue('template', mod);
                        fetchTemplate(mod);
                      }}
                    />
                    <Button
                      onClick={updateTemplate}
                      type='primary'
                      icon={<SyncOutlined />}
                      disabled={!!!template}
                    >
                      更新
                    </Button>
                    <Button
                      danger
                      icon={<DeleteFilled />}
                      disabled={!!!template}
                      onClick={showDeleteModal}
                    >
                      删除
                    </Button>
                  </Space>
                </nav>
              )}
            </ProFormDependency>
          </Col>
        </ProForm.Group>
        <ProForm.Group
          title='配置项'
          tooltip={{
            placement: 'right',
            title: renderTooltip,
            icon: <QuestionCircleFilled />,
          }}
        >
          <ProFormDependency name={['template']}>
            {({ template }) => {
              if (!template) {
                return (
                  <Col span={24}>
                    <Result title='请先选择模板' />
                  </Col>
                );
              }
              return (
                <ProFormTextArea
                  name='json'
                  label='具体配置'
                  fieldProps={{ rows: 32 }}
                  allowClear
                  placeholder='建议从文档，或已存在的模板配置中复制，并进行修改'
                  rules={[
                    { required: true },
                    {
                      validator(_, value) {
                        if (value) {
                          try {
                            JSON.parse(value);
                          } catch (error) {
                            return Promise.reject('芜湖，有语法错误');
                          }
                        }

                        return Promise.resolve(true);
                      },
                    },
                  ]}
                />
              );
            }}
          </ProFormDependency>
        </ProForm.Group>
      </ProForm>
    </Card>
  );
}

const renderTooltip = (
  <span>
    您可以参照
    <a href='https://www.yuque.com/zexouis/qx5wwk/esd3vv' target='_blank'>
      《文档说明》
    </a>
    进行个性化配置
  </span>
);

export default () => (
  <KeepAlive>
    <Templates />
  </KeepAlive>
);
