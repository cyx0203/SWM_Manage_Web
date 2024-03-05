import { Descriptions, List } from 'antd';
import _ from 'lodash';
import { Pie, WordCloud } from '@ant-design/plots';

/**
 * 饼图形式展现统计结果
 */
export default (props) => {

  const { itemList } = props;

  const DemoPie = (reqData: any) => {
    const data = reqData;
    const config = {
      appendPadding: 10,
      width: 600,
      height: 300,
      data,
      angleField: 'value',
      colorField: 'type',
      radius: 0.75,
      label: {
        type: 'spider',
        labelHeight: 28,
        content: '{name}\n{percentage}',
      },
      interactions: [
        {
          type: 'element-selected',
        },
        {
          type: 'element-active',
        },
      ],
    };
    return <Pie {...config} />;
  };

  const DemoWordCloud = (reqData: any) => {
    const data = reqData;
    const config = {
      data,
      wordField: 'name',
      weightField: 'value',
      colorField: 'name',
      wordStyle: {
        fontFamily: 'Verdana',
        fontSize: [12, 40],
        rotation: 0,
      },
      // 返回值设置成一个 [0, 1) 区间内的值，
      // 可以让每次渲染的位置相同（前提是每次的宽高一致）。
      random: () => 0.5,
    };
  
    return <WordCloud {...config} />;
  };

  const description = (item, outIndex) => {
    let elementNode: any;

    console.log("item=", item)

    switch (item.type) {
      case "单项选择":
        elementNode = DemoPie(item.data)
        break;
      case "多项选择":
        elementNode = DemoPie(item.data)
        break;
      case "星级评分":
        elementNode = DemoPie(item.data)
        break;
      case "填空":
        elementNode = DemoWordCloud(item.data)
        break;
    }
    return (
      (item.count > 0) && <Descriptions size='small'>
        <Descriptions.Item span={3}>
          <span style={{ fontSize: 16 }}>{outIndex + 1 + "、"}</span>
          <span style={{ fontSize: 16, marginLeft: 7 }}>{item.item + "【" + item.type + "】"}</span>
          {/* <a style={{ marginLeft: 10, marginRight: 10 }} onClick={() => editItem(item)}><Tooltip title="结果统计"><AreaChartOutlined style={{ marginLeft: 10 }} type="edit" ></AreaChartOutlined></Tooltip></a> */}
        </Descriptions.Item>
        <Descriptions.Item span={3}>
          {elementNode}
        </Descriptions.Item>
        <Descriptions.Item span={3}>
        <span style={{ fontSize: 16 }}>{"参评人次：" + item.count}</span>
        </Descriptions.Item>
      </Descriptions>
    )
  }

  return (
    <div style={{ backgroundColor: '#fff', paddingLeft: 50, paddingTop: 20, paddingBottom: 20, borderRadius: 8 }}>
      <List
        size='small'
        pagination={false}
        dataSource={itemList}
        renderItem={(item, index) => (
           <List.Item>
            {description(item, index)}
          </List.Item>
        )}
      />
    </div>
  );
}
