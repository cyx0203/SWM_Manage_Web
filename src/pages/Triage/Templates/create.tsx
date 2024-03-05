import { Ajax } from '@/core/trade';
import { EyeFilled, FolderAddFilled, PlusCircleOutlined } from '@ant-design/icons';
import {
  ModalForm,
  ProForm,
  ProFormDependency,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { Button } from 'antd';
import { noop } from 'lodash/fp';
import { useModel } from 'umi';
import { DEVICES, MOD_PREVIEW } from './constants';
import styles from './index.module.less';

interface CreateTemplateProps {
  mods: Record<string, string>;
  afterSubmit: (template: string) => void;
}

export default function CreateTemplate(props: CreateTemplateProps) {
  const {
    initialState: { currentUser },
  } = useModel('@@initialState');

  /**
   * 新增模板配置
   * @param values
   * @returns
   */
  const handleSubmit = async values => {
    const requestParams = {
      account: currentUser?.name,
      expire: 86400,
      ...values,
    };

    // /api/template.insertSelective

    const res = await Ajax.Post('Triage', '/addTemplate', requestParams);
    res.success && props.afterSubmit(values.template);
    return res.success;
  };

  return (
    <ModalForm
      title='新建模板配置'
      trigger={<Button icon={<PlusCircleOutlined />}>新建</Button>}
      grid
      submitter={{
        searchConfig: { submitText: '创建' },
        submitButtonProps: { icon: <FolderAddFilled /> },
      }}
      onFinish={handleSubmit}
      modalProps={{ destroyOnClose: true }}
    >
      <ProForm.Group title='预填项' rowProps={{ gutter: [24, 16] }}>
        <ProFormDependency name={['catagory']}>
          {({ catagory }) => {
            const src = MOD_PREVIEW[catagory - 1];

            return (
              <ProFormSelect
                colProps={{ span: 12 }}
                label='模板类别'
                required
                name='catagory'
                options={DEVICES.map(v => ({ ...v, value: v.value + 1 }))}
                rules={[
                  {
                    required: true,
                    validator(rule, value) {
                      if (!value) {
                        return Promise.reject(new Error('是不是忘记选了？'));
                      }

                      return Promise.resolve();
                    },
                  },
                ]}
                tooltip={
                  src && {
                    icon: <EyeFilled />,
                    color: 'white',
                    className: styles.preview,
                    placement: 'right',
                    overlayInnerStyle: { width: 'fit-content' },
                    title: (
                      <article>
                        <img src={src} style={{ height: '26vh' }} draggable={false} />
                      </article>
                    ),
                  }
                }
              />
            );
          }}
        </ProFormDependency>
        <ProFormText
          name='template'
          colProps={{ span: 12 }}
          label='模板名称'
          required
          rules={[
            { required: true },
            {
              validator(_, value) {
                const isExsist = Boolean(props.mods[value]);

                if (isExsist) {
                  return Promise.reject(new Error('该模板已存在，请另取别名'));
                }

                return Promise.resolve(true);
              },
            },
          ]}
        />
        <ProFormTextArea
          fieldProps={{ rows: 24 }}
          label='具体配置'
          required
          tooltip={{ placement: 'right', title: '将严格遵循 JSON 语法格式，请认真校验' }}
          placeholder='建议从文档，或已存在的模板配置中复制，并进行修改'
          name='json'
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
      </ProForm.Group>
    </ModalForm>
  );
}

CreateTemplate.defaultProps = {
  afterSubmit: noop,
};
