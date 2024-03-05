import { useBoolean } from '@/hooks';
import {
  ModalForm,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { Avatar, Button, message, Spin, Upload } from 'antd';
import { PlusCircleFilled, UploadOutlined } from '@ant-design/icons';
import {
  RcFile,
  UploadChangeParam,
  UploadFile,
  UploadProps,
} from 'antd/es/upload/interface';
import { useState } from 'react';
import styles from './index.module.less';
import { keys, noop } from 'lodash/fp';
import { avatarBaseUrl } from './columns';

interface DoctorEditorProps
  extends Partial<Triage.Doctor & { level: Record<string, string> }> {
  onSubmit?: (values: Partial<Triage.Doctor>) => Promise<boolean>;
}

export default function EditDoctor(props: DoctorEditorProps) {
  const [img, setImg] = useState(props.photo || '');

  const { onSubmit, level, ...others } = props;

  const isExsist = Boolean(props.id);

  const [loading, { setTrue: setLoading, setFalse: setIdle }] = useBoolean();

  const beforeUpload = (file: RcFile) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('限制为 png 或者 jpeg 格式的图片!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('图片大小不应超过 2MB');
    }
    return isJpgOrPng && isLt2M;
  };

  const handleChange: UploadProps['onChange'] = (info: UploadChangeParam<UploadFile>) => {
    if (info.file.status === 'uploading') {
      setLoading();
      return;
    } else {
      if (info.file.response) {
        setImg(info.file.response.name);
      }
    }
    if (info.file.status === 'done') {
      getBase64(info.file.originFileObj as RcFile, url => {
        setIdle();
        // setImg(url);
        setImg(info.file.name);
      });
    }
  };

  return (
    <ModalForm<Triage.Doctor>
      title={isExsist ? '编辑医生' : '新增医生'}
      trigger={
        isExsist ? (
          <a>编辑</a>
        ) : (
          <Button type='primary' key='create' icon={<PlusCircleFilled />}>
            新增
          </Button>
        )
      }
      modalProps={{ destroyOnClose: true }}
      className={styles.editForm}
      layout='horizontal'
      initialValues={{
        ...others,
        id_levels: others?.id_levels?.split(','),
      }}
      onFinish={async values => {
        const req = { ...values, photo: img };
        const res = await onSubmit(req);
        return res;
      }}
    >
      <section style={{ textAlign: 'center' }}>
        <Upload
          name='avatar'
          action='http://106.12.24.238:8029/api/uploadFile'
          showUploadList={false}
          maxCount={1}
          onChange={handleChange}
          beforeUpload={beforeUpload}
          listType='picture'
        >
          <Spin spinning={loading}>
            <article className={styles.avatarWrapper}>
              <div className={styles.uploadBtn}>
                <UploadOutlined />
              </div>
              <Avatar
                className={styles.uploadAvatar}
                size={128}
                src={avatarBaseUrl + img}
                shape='square'
              />
            </article>
          </Spin>
        </Upload>
      </section>
      <section
        className={styles.form}
        style={{ gridRow: 'span 2 / span 2', gridColumn: 'span 2 / span 2' }}
      >
        <ProFormText name='id' disabled={isExsist} label='医生编号' />
        <ProFormText name='name' label='医生姓名' />
        <ProFormText name='username' label='登录账号' />
        <ProFormSelect name='grade' label='医生职称' />
      </section>
      <section className='grid grid-cols-2 row-span-1 col-span-3' style={{ gap: 24 }}>
        <ProFormSelect
          name='id_levels'
          label='所属科室'
          options={keys(level).map(v => ({ label: level[v], value: v }))}
          mode='multiple'
        />
        <ProFormTextArea name='info' label='医生擅长、简介' />
      </section>
    </ModalForm>
  );
}

EditDoctor.defaultProps = {
  onSubmit: noop,
  levels: {},
};

const getBase64 = (img: RcFile, callback: (url: string) => void) => {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result as string));
  reader.readAsDataURL(img);
};
