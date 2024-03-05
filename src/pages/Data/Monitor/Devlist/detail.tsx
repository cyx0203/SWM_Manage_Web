import { Modal,Row,Col,Tag,List } from "antd";


export default (props) => {
  const { visible, devId, onClose,devStateDetailList } = props;
  

  return (
    <Modal
      visible={visible}
      title={`${devId}状态详情`}
      onCancel={onClose}
      destroyOnClose
      footer={null}
    >
      <div>
        <List
          dataSource={devStateDetailList}
          renderItem={
            (item: any) => (<List.Item key={item.catId} extra = {<Tag color={item.stateColor}>{item.stateValue}</Tag>}>{ item.stateName }</List.Item>)
          }
        />
       
      </div>
    </Modal>
  );
};