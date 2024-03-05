import { useEffect } from "react";
import { Modal, Table, Tag } from "antd";
import _ from "@umijs/deps/compiled/lodash";

export default (props) => {

  const { visible, detial, onClose } = props;

  const Columns: any = [{
    title: '门诊/身份证号',
    align: "center",
    dataIndex: 'patid',
    width: "150px"
  },
  {
    title: '姓名',
    align: "center",
    dataIndex: 'name',
  },
  {
    title: '性别',
    align: "center",
    dataIndex: 'sex',
    render(val) {
      let color = "green";
      if (val === "女")
        color = "red";
      return <Tag color={color}>{val}</Tag>
    }
  },
  {
    title: '联系电话',
    align: "center",
    dataIndex: 'phone',
  },
  {
    title: '预约科室',
    align: "center",
    dataIndex: 'dept',
    render(val) {
      return <Tag color="green">{val}</Tag>
    }
  },
  {
    title: '预约医生',
    align: "center",
    dataIndex: 'doc',
    render(val) {
      return <Tag color="green">{val}</Tag>
    }
  },
  {
    title: '预约时间',
    align: "center",
    dataIndex: 'time'
  },
  {
    title: '预约号序',
    align: "center",
    dataIndex: 'no',
  },
  {
    title: '预约渠道',
    align: "center",
    dataIndex: 'source',
    width: "150px"
  },
  ];

  useEffect(() => {
  }, []);

  return (
    <Modal
      open={visible}
      title='预约详情'
      onCancel={onClose}
      footer={null}
      destroyOnClose
      width={1000}
    >
      <Table
        bordered
        size="small"
        columns={Columns}
        dataSource={detial || []}
        pagination={false}
      />
    </Modal >
  );
}