import { Modal, Space, message } from "antd";
import { UpOutlined, DownOutlined } from "@ant-design/icons";
import SmartTable from "@/components/SmartTable";
import { Ajax } from "@/core/trade";

export default (props: any) => {
  const { visible, onClose, onOk, dishes, sort } = props;

  const arrow = (row: any, index: any, type: any) => {
    sort(row, index, type);
  }

  const columns: any = [
    {
      title: '菜名',
      dataIndex: 'name',
      key: 'name',
      width: 200,
    },
    {
      title: '单价',
      dataIndex: 'price',
      align: 'price',
      width: 150,
      render: val => <span>{(val * 0.01).toFixed(2)}</span>
    },
    {
      title: '操作',
      key: 'action',
      align: 'center',
      width: 200,
      render: (text: any, row: any, index: any) => (
        <Space size="middle">
          {index != 0 && <a style={{ marginRight: '8px' }} onClick={() => { arrow(row, index, "+"); }}><UpOutlined /></a>}
          {index < (dishes.list.length-1) && <a style={{ marginRight: '8px' }} onClick={() => { arrow(row, index, "-"); }}><DownOutlined /></a>}
        </Space>
      ),
    },
  ];

  const handleSubmit = () => {
    dishes.list.map((item, index) => {
      item.sort = index;
    });
    Ajax.Post('MealUrl', '/manage/mealdish.update-sort',
      {
        list: dishes.list
      },
      (ret: any) => {
        message.success('操作成功');
        onOk();
      }
    );
  }

  return (
    <Modal
      open={visible}
      title='菜品排序'
      onOk={() => handleSubmit()}
      onCancel={onClose}
      okText="提交"
      cancelText="取消"
      destroyOnClose
    >
      <SmartTable
        paginationBool={false}
        showHeader={false}
        bordered
        dataSource={dishes || {list:[]}}
        columns={columns}
      />
    </Modal>
  );
}