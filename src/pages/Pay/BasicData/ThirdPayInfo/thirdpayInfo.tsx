import { DomRoot, Ajax, KeepAlive } from '@/components/PageRoot';
import { useState, useEffect } from 'react';
import SmartTable from '@/components/SmartTable';
import { Space, message, Modal, Button, Card, Popconfirm, Form } from 'antd';
import EditTable from './editTable';

const ThirdPayInfo = () => {
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [typename_dis, setTND] = useState(false);
  const [tableDate, setTableDate] = useState({
    pagination: {},
    list: [],
  });

  const setRecord = (data: any, type: any) => {
    console.log(data);
    if (type === 'edit') {
      form.setFieldValue('id', data.id);
      form.setFieldValue('name', data.name);
      setTND(true);
    } else {
      form.setFieldValue('id', null);
      form.setFieldValue('name', null);
    }
  };
  const handleSearch = (params = {}) => {
    Ajax.Post(
      'PayUrl',
      '/manage/payThird.selectAll',
      {},
      (ret: any) => {
        if (ret && ret.hasOwnProperty('success') && ret.success === true) {
          console.log(ret);
          setTableDate({ ...ret });
        } else {
          message.error('查询失败');
        }
      },
      (err: any) => {
        //后台异常、网络异常的回调处理
        //该异常处理函数，可传可不传
        console.error('Ajax Post Error');
        console.error(err);
      },
    );
  };

  const delHandle = (row: any) => {
    Ajax.Post(
      'PayUrl',
      '/manage/payThird.deleteById',
      {
        id: row.id,
      },
      (ret: any) => {
        if (ret && ret.hasOwnProperty('success') && ret.success === true) {
          message.success('删除完成');
          handleSearch();
        } else {
          message.error('删除失败');
        }
      },
    );
    console.log(row);
  };

  const columns = [
    {
      title: '第三方代码',
      dataIndex: 'id',
      key: 'id',
      width: 150,
    },
    {
      title: '第三方名称',
      dataIndex: 'name',
      key: 'name',
      width: 200,
    },
    {
      title: '操作',
      key: 'action',
      align: 'center',
      width: 200,
      render: (text, row) => (
        <Space size="middle">
          <a
            style={{ marginRight: '8px' }}
            onClick={() => {
              setVisible(true);
              setRecord(row, 'edit');
            }}
          >
            修改
          </a>
          <Popconfirm title="确认删除吗?" onConfirm={() => delHandle(row)}>
            <a style={{ marginRight: '8px' }}>删除</a>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const handleInsert = (type: any) => {
    Ajax.Post(
      'PayUrl',
      type === 'update' ? '/manage/payThird.updateById' : '/manage/payThird.add',
      {
        id: form.getFieldsValue().id,
        name: form.getFieldsValue().name,
      },
      (ret: any) => {
        console.log(ret);

        if (ret && ret.hasOwnProperty('success') && ret.success === true) {
          console.log(ret);
          handleSearch();
        } else {
          message.error('查询失败');
        }
      },
      (err: any) => {
        //后台异常、网络异常的回调处理
        //该异常处理函数，可传可不传
        console.error('Ajax Post Error');
        console.error(err);
      },
    );
  };
  const onFinish = () => {
    console.log(form.getFieldsValue());
    let repeat = false;
    for (const i of tableDate.list) {
      if (i.id === form.getFieldsValue().id) {
        repeat = true;
        handleInsert('update');
        break;
      }
    }
    if (!repeat) {
      handleInsert('add');
    }
    setVisible(false);
    setTND(false);
  };

  useEffect(() => {
    handleSearch();
  }, []);

  return (
    <DomRoot>
      <Card>
        <Button
          type="primary"
          style={{ marginBottom: 8 }}
          onClick={() => {
            setVisible(true);
            setTND(false);
            setRecord(null, 'add');
          }}
        >
          创建
        </Button>
        <SmartTable
          bordered
          dataSource={tableDate || []}
          columns={columns}
          handleChange={params => handleSearch(params)}
        />
      </Card>
      <Modal
        title="编辑第三方信息"
        visible={visible}
        onCancel={() => {
          setVisible(false);
          setTND(false);
        }}
        width="40%"
        footer={null}
        destroyOnClose
      >
        <EditTable
          form={form}
          disabled={typename_dis}
          onFinish={() => {
            onFinish();
          }}
        />
      </Modal>
    </DomRoot>
  );
};

export default () => (
  <KeepAlive>
    <ThirdPayInfo />
  </KeepAlive>
);
