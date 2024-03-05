import { useEffect, useState } from "react";
import { message, Switch, Table, } from "antd";
import { Ajax } from "@/core/trade";

export default (props) => {
  const {
    record,
    onSuccess,
  } = props;
  const [dataSource, setDataSource] = useState([]);
  const [allPayTypeArray, setAllPayTypeArray] = useState([]);
  const [paginationInfo, setPaginationInfo] = useState({
    current: 1,
    pageSize: 10
  });

  //获取所有的支付方式
  const queryPayType = () => {
    Ajax.Post('PayUrl', '/manage/payType.selectAll',
      {
      },
      (ret: any) => {
        const payTypeArray = [];
        const payTypeArray2 = [];
        //已经激活的放到payTypeArray，所有的放到payTypeArray2
        record.payTypeList.forEach(element => {
          if (element.active == '1') {
            payTypeArray.push(element.payTypeId);
          }
          payTypeArray2.push(element.payTypeId);
        });
        setAllPayTypeArray(payTypeArray2);
        
        //计算出rowSpan
        //先计算出相同的出现次数，并组装成对象形式
        let thirdCount = {};
        for (const num of ret.list) {
          thirdCount[num.thirdName] = thirdCount[num.thirdName] ? thirdCount[num.thirdName] + 1 : 1;
        }

        //初始化为空，如果设置过rowSpan就加入数组
        let thirdTemp = [];

        const newList = ret.list.map((item) => {
          let rowSpan = 0; //第三方名称的rowSpan
          if (!thirdTemp.includes(item.thirdName)) {
            rowSpan = thirdCount[item.thirdName];
            thirdTemp.push(item.thirdName);
          }

          return {
            ...item,
            payTypeName: item.name,
            active: payTypeArray.includes(item.id),
            payTypeId: item.id,
            merchantId: record.merchantId,
            rowSpan: rowSpan
          }
        })
        setDataSource(newList);
      }
    );
  }

  useEffect(() => {
    queryPayType();
  }, []);

  //是否开通按钮点击事件
  const onChange = (merchantId, payTypeId, checked) => {
    if (allPayTypeArray.includes(payTypeId)) {
      //发送请求更改数据库
      Ajax.Post('PayUrl', '/manage/merPayType.updateById',
        {
          active: checked ? '1' : '0',
          merchantId,
          payTypeId
        },
        (ret: any) => {
          if (ret.success) {
            message.success('操作成功');
            onSuccess();
          } else {
            message.error('操作失败');
          }
        }
      )
    } else {
      //发送请求更改数据库
      Ajax.Post('PayUrl', '/manage/merPayType.insert',
        {
          active: checked ? '1' : '0',
          merchantId,
          payTypeId
        },
        (ret: any) => {
          if (ret.success) {
            message.success('新增成功');
            allPayTypeArray.push(payTypeId);
            onSuccess();
          } else {
            message.error('新增失败');
          }
        }
      )
    }
  };

  //目录的列表配置
  const columns = [
    {
      title: '第三方名称',
      dataIndex: 'thirdName',
      key: 'thirdName',
      render: (value, row, index) => {
        const trueIndex =
          index + paginationInfo.pageSize * (paginationInfo.current - 1);
        const obj = {
          children: value,
          props: { rowSpan: 0 }
        };
        if (index >= 1 && value === dataSource[trueIndex - 1].thirdName) {
          obj.props.rowSpan = 0;
        } else {
          for (
            let i = 0;
            trueIndex + i !== dataSource.length &&
            value === dataSource[trueIndex + i].thirdName;
            i += 1
          ) {
            obj.props.rowSpan = i + 1;
          }
        }
        return obj;
      }
    },
    {
      title: '支付渠道名称',
      dataIndex: 'payTypeName',
      key: 'payTypeName',
    },
    {
      title: '开通状态',
      key: 'active',
      render: (_, row) => (
        <Switch defaultChecked={row.active == 1 ? true : false}
          onChange={(checked) => {
            onChange(row.merchantId, row.payTypeId, checked);
          }}
        />
      ),
    },
  ];

  const handleChange = pagination => {
    setPaginationInfo(pagination);
  };

  return (
    <Table
      size="small"
      rowKey={keyword => keyword.id}
      columns={columns}
      dataSource={dataSource}
      onChange={handleChange}
      bordered
    />
  )

}