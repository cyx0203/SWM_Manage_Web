import { DomRoot, Ajax, KeepAlive } from '@/components/PageRoot';
import { useState, useEffect, useCallback } from 'react';
import SmartTable from '@/components/SmartTable';
import { Space, message, Modal, Button, Card, Popconfirm, Form } from 'antd';
import EditTable from './editTable';

const PayType = () => {
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [typename_dis, setTND] = useState(false);
  const [option, setOption] = useState([]);
  const [tableDate, setTableDate] = useState({
    pagination: {},
    list: [],
  });

  const setRecord = (data: any, type: any) => {
    console.log(data);
    if (type === 'edit') {
      form.setFieldValue('id', data.id);
      form.setFieldValue('name', data.name);
      form.setFieldValue('thirdId', data.thirdId);
      setTND(true);
    } else {
      form.setFieldValue('id', null);
      form.setFieldValue('name', null);
      form.setFieldValue('thirdId', null);
    }
  };

  const checkThird = (data: any) => {
    Ajax.Post(
      'PayUrl',
      '/manage/payThird.selectAll',
      {},
      (ret: any) => {
        if (ret && ret.hasOwnProperty('success') && ret.success === true) {
          console.log(ret);
          const temp_option = [];
          for (const i of ret.list) {
            temp_option.push({
              label: i.name,
              value: i.id,
            });
          }
          setOption(temp_option);

          const temp: any = {};
          temp.pagination = data.pagination;
          for (let i = 0; i < data.list.length; i++) {
            for (let j = 0; j < ret.list.length; j++) {
              if (data.list[i].thirdId === ret.list[j].id) {
                data.list[i].thirdId = ret.list[j].name;
                break;
              }
            }
          }
          temp.list = data.list;
          setTableDate({ ...temp });
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

  const handleSearch = useCallback((params = {}) => {
    Ajax.Post(
      'PayUrl',
      '/manage/payType.selectAll',
      {},
      (ret: any) => {
        if (ret && ret.hasOwnProperty('success') && ret.success === true) {
          console.log(ret);
          checkThird(ret);
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
  }, []);

  const delHandle = (row: any) => {
    Ajax.Post(
      'PayUrl',
      '/manage/payType.deleteById',
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
      title: '方式代码',
      dataIndex: 'id',
      key: 'id',
      width: 150,
    },
    {
      title: '方式名称',
      dataIndex: 'name',
      key: 'name',
      width: 200,
    },
    {
      title: '第三方',
      dataIndex: 'thirdId',
      key: 'thirdId',
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
      type === 'update' ? '/manage/payType.updateById' : '/manage/payType.add',
      {
        id: form.getFieldsValue().id,
        name: form.getFieldsValue().name,
        thirdId: form.getFieldsValue().thirdId,
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
  }, [handleSearch]);

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
        title="编辑订单类型"
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
          option={option}
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
    <PayType />
  </KeepAlive>
);
