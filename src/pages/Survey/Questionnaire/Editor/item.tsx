import { Fragment, useState } from 'react';
import { Ajax } from '@/components/PageRoot';
import { Descriptions, List, Input, Popconfirm, message, Tooltip, Checkbox, Radio, Rate } from 'antd';
import { EditOutlined, DeleteOutlined, ArrowUpOutlined } from '@ant-design/icons';
import _ from 'lodash';
import EditItem from './edititem';

export default (props) => {

  const { itemList, onOk } = props;
  const [editMode, setEditMode] = useState(false);
  const [record, setRecord] = useState(null);

  const deleteItem = (item) => {
    console.log("我的item=", item)
    let url = '/manage/questionSurveyItem.deleteAllById';
    if (!("option" in item) || item.option.length == 0){
      url = '/manage/questionSurveyItem.deleteById';
    }   
    Ajax.Post('SurveyUrl', url,
      {
        itemId: item.itemId
      },
      (ret: any) => {
        message.success('删除成功');
        onOk();
      }
    );
  }

  const editItem = (item) => {
    console.log("我的editItem=", item)
    setRecord(item)
    setEditMode(true);
  }

  const arrowUpItem = (item, outIndex) => {
    console.log("我的itemList=" + itemList)
    console.log("我的item=" + item)
    const arr = [
      {
        itemId: item.itemId,
        order: itemList[outIndex - 1].order
      },
      {
        itemId: itemList[outIndex - 1].itemId,
        order: item.order
      }
    ]
    arr.forEach(e => {
      Ajax.Post('SurveyUrl', '/manage/questionSurveyItem.update',
        {
          itemId: e.itemId,
          order: e.order
        },
        (ret: any) => {
          onOk();
        }
      );
    });
  }

  const description = (item, outIndex) => {
    let elementNode: any;
    let option = [];
    if (!(_.isEmpty(item.option))) option = item.option;

    switch (item.type) {
      case "1":
        elementNode = (
          <Radio.Group>
            {
              option.map((i, index) => {
                // eslint-disable-next-line react/no-array-index-key
                return <Radio key={index} value={index}>{i}</Radio>
              })
            }
          </Radio.Group >
        )
        break;
      case "2":
        elementNode = (
          <Fragment>
            {
              option.map((i, index) => {
                // eslint-disable-next-line react/no-array-index-key
                return <Checkbox key={index}>{i}</Checkbox>
              })
            }
          </Fragment>
        )
        break;
      case "3":
        elementNode = <Rate defaultValue={5} />
        break;
      case "4":
        elementNode = <Input.TextArea size="small" style={{ width: 200 }} rows={4} />
        break;
    }
    return (
      <Descriptions size='small'>
        <Descriptions.Item span={3}>
          <span style={{ fontSize: 16 }}>{outIndex + 1 + "、"}</span>
          <span style={{ fontSize: 16, marginLeft: 7 }}>{item.item}</span>
          <a style={{ marginLeft: 10, marginRight: 10 }} onClick={() => editItem(item)}><Tooltip title="题目编辑"><EditOutlined style={{ marginLeft: 10 }} type="edit" ></EditOutlined></Tooltip></a>
          <Popconfirm title="确认删除吗?" onConfirm={() => deleteItem(item)}>
            <a><DeleteOutlined style={{ marginLeft: 10 }} /></a>
          </Popconfirm>
          {/* 题目升序功能，恩施满意度调查，暂时将该功能屏蔽 */}
          {outIndex != 0 && <a onClick={() => arrowUpItem(item, outIndex)}><ArrowUpOutlined style={{ marginLeft: 13 }} /></a>}
        </Descriptions.Item>
        <Descriptions.Item span={3}>
          {elementNode}
        </Descriptions.Item>
      </Descriptions>
    )
  }

  return (
    <div style={{ backgroundColor: '#fff', paddingLeft: 50, paddingTop: 20, paddingBottom: 20, borderRadius: 8 }}>
      <List
        size='small'
        pagination={{ pageSize: 20 }}
        dataSource={itemList}
        renderItem={(item, index) => (
          <List.Item>
            {description(item, index)}
          </List.Item>
        )}
      />
      {/* 问卷选项编辑弹出框 */}
      <EditItem
        visible={editMode}
        record={record}
        onClose={() => setEditMode(false)}
        onOk={() => {
          setEditMode(false);
          onOk()
        }}
      />
    </div>
  );
}
