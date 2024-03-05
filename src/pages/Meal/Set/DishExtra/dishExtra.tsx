import { Fragment, useEffect, useState, useRef } from 'react';
import { DomRoot, Ajax, KeepAlive } from '@/components/PageRoot';
import { Card, List, Avatar, Tag } from 'antd';
import SmartTop from '@/components/SmartTop';
import utils from "../../utils";
import Edit from './edit';

const DishExtra = () => {
  const [args, setArgs] = useState(null);
  const [dishes, setDishes] = useState(null);
  const [canteens, setCanteens] = useState(null);
  const [record, setRecord] = useState(null);
  const [editVisible, setEditVisible] = useState(false);
  const [dishTypes, setDishTypes] = useState(null);
  const [editMode, setEditMode] = useState(null);
  const [fileUrl, setFileUrl] = useState(null);
  const [dishleft, setDishleft] = useState(null);

  let TopRef = useRef(null);

  const queryDish = (params) => {
    const query = { ...args, ...params };
    Ajax.Post('MealUrl', '/manage/mealdishadd.query-adddish',
      {
        ...query,
      },
      (ret: any) => {
        setDishes(ret);
        setArgs(query);
      }
    );
  }

  const queryDishLeft = (params) => {
    const canteenId = TopRef.current.getForm().getFieldsValue().canteenId;
    Ajax.Post('MealUrl', '/manage/kv/mealdishadd.query-dish',
      {
        canteenId,
        key: 'dishId',       // key名称
        value: 'name',   // value名称
        retKey: 'dishleftKV',
        ...params,
      },
      (ret: any) => {
        setDishleft(ret.dishleftKV);
        setEditMode(false);
        setEditVisible(true);
        setRecord(undefined);
      }
    );
  }

  const queryCanteens = (params) => {
    Ajax.Post('MealUrl', '/manage/kv/mealcanteen.query-canteen',
      {
        key: 'id',       // key名称
        value: 'name',   // value名称
        retKey: 'canteenKV',
        ...params,
      },
      (ret: any) => {
        setCanteens(ret.canteenKV);
        TopRef.current.getForm().setFieldsValue({ canteenId: ret.canteenKV.tv[ret.canteenKV.tv.length - 1].value });
        queryDish({ canteenId: ret.canteenKV.tv[ret.canteenKV.tv.length - 1].value });
      }
    );
  }

  const queryCanteen = (params) => {
    Ajax.Post('MealUrl', '/manage/mealcanteenemployee.query-canteenemployee',
      {
        ...params,
      },
      (ret: any) => {
        if (ret?.list.length > 0) {
          queryCanteens({ id: ret.list[0].canteenId, hospitalId: localStorage.getItem("hospitalId") });
        } else {
          queryCanteens({ hospitalId: localStorage.getItem("hospitalId") });
        }
      }
    );
  }

  const queryDishType = (params) => {
    Ajax.Post('MealUrl', '/manage/kv/mealdishtype.query-dishtype',
      {
        key: 'id',       // key名称
        value: 'name',   // value名称
        retKey: 'dishtypeKV',
        ...params,
      },
      (ret: any) => {
        setDishTypes(ret.dishtypeKV);
      }
    );
  }

  const queryFileUrl = () => {
    Ajax.Post('MealUrl', '/getFileUrl',
      {
      },
      (ret: any) => {
        setFileUrl(ret.fileUrl);
      }
    );
  }

  useEffect(() => {
    queryFileUrl();
    queryCanteen({ hospitalId: localStorage.getItem("hospitalId"), account: localStorage.getItem("GGMIDENDPRO_LOGIN_NAME") });
    queryDishType(null);
  }, []);

  // const popoverContent = (item: any) => {
  //   return (
  //     <div style={{ width: 400 }}>
  //       <span>简介：{item.profile}</span> <br /><br />
  //       <span>详情：{item.detail}</span>
  //     </div>
  //   )
  // }

  // const deleteDish = (item: any) => {
  //   Ajax.Post('MealUrl', '/manage/mealdishadd.delete-adddish',
  //     {
  //       id: item.id,
  //     },
  //     (ret: any) => {
  //       message.success('刪除成功');
  //       queryDish(null);
  //     }
  //   );
  // }

  const description = (item: any) => {
    return (
      // <Popover content={popoverContent(item)} title={item.name} trigger="hover">
      <div style={{ height: 130 }}>
        单价：{(item.price * 0.01).toFixed(2)}元<br />
        简介：{item.profile}<br />
        详情：{item.detail}
      </div>
      // </Popover>
    )
  }

  const extra = (item: any) => {
    return (
      <Fragment>
        <a onClick={() => {
          setEditMode(true);
          setEditVisible(true);
          setRecord(item);
        }}>
          编辑
        </a>
        {/* <Popconfirm title="确认删除吗?" onConfirm={() => deleteDish(item)}>
          <a style={{ marginLeft: 10 }}>删除</a>
        </Popconfirm> */}
      </Fragment>
    )
  }

  const timeIntMap = {
    "1": "早",
    "2": "中",
    "3": "晚"
  };
  const statusMap = {
    "1": "启用",
    "0": "停用"
  };

  const timeInt = (timeInterval) => {
    const arr = timeInterval.split(",");
    return arr.map(e => {
      return timeIntMap[e];
    });
  }

  const getFields = () => {
    return [
      {
        type: 'select',
        label: '食堂',
        style: { width: '250px' },
        field: 'canteenId',
        options: canteens ? canteens.tv : [],
        placeholder: '请选择食堂...',
        required: true,
      },
      {
        type: 'select',
        label: '是否启用',
        style: { width: '250px' },
        field: 'status',
        options: utils.getStatus() ? utils.getStatus() : [],
        placeholder: '请选择是否启用...',
        allowClear: true,
      },
      {
        type: 'select',
        label: '菜品类别',
        style: { width: '250px' },
        field: 'dishTypeId',
        options: dishTypes ? dishTypes.tv : [],
        placeholder: '请选择菜品类别...',
        allowClear: true,
      },
      {
        type: 'button',
        buttonList: [
          {
            type: 'primary',
            htmlType: 'submit',
            buttonText: '查询',
            style: { marginLeft: '8px' }
          },
          {
            buttonText: '新建',
            style: { marginLeft: '8px' },
            onClick: () => { queryDishLeft(null); }
          },
        ]
      }
    ]
  }

  return (
    <DomRoot>
      <Card bordered={false}>
        <SmartTop handleSubmit={queryDish} getFields={getFields} onRef={TopRef}><div /></SmartTop>
        {dishes && dishes.list &&
          <List
            grid={{ gutter: 8, xl: 3, xxl: 4 }}
            dataSource={dishes.list}
            pagination={{ pageSize: 12, position: 'top' }}
            renderItem={(item: any) =>
              <List.Item>
                <Card
                  title={<><span>{`${item.name} - ${item.dishTypeName}   `}</span> {item.status == "1" ? <Tag color="success">{statusMap[item.status]}</Tag> : <Tag color="error">{statusMap[item.status]}</Tag>}</>}
                  size='small'
                  bodyStyle={{ height: 185 }}
                  extra={extra(item)}
                  hoverable
                >
                  <Card.Meta
                    avatar={<Avatar src={fileUrl + item.picFile || "https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"} size='large' style={{ width: 60, height: 60 }} />}
                    title={`${item.name} ( ${timeInt(item.timeInterval)} ) `}
                    description={description(item)}
                  />
                </Card>
              </List.Item>}
          />}
      </Card>
      <Edit
        visible={editVisible}
        dishleft={dishleft}
        record={record}
        editMode={editMode}
        onClose={() => setEditVisible(false)}
        onOk={() => {
          setEditVisible(false)
          queryDish(null);
        }}
      />
    </DomRoot>
  )
}

export default () => (
  <KeepAlive>
    <DishExtra />
  </KeepAlive>
)
