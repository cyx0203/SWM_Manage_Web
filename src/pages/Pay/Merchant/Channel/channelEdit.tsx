import { message, Switch, Table, } from "antd";
import { Ajax } from "@/core/trade";
import { useEffect, useState } from "react";
import moment from "moment";

export default (props) => {
  const {
    record,
    onSuccess,
    hospitalArray, //所有医院的数组
  } = props;

  const [existHos, setExistHos] = useState([]); //存在的医院Id
  const [dataSource, setDataSource] = useState([]); //存在的医院Id

  //是否开通按钮点击事件
  const onChange = (channelId, hospitalId, checked) => {

    if (existHos.includes(hospitalId)) {
      Ajax.Post('PayUrl', '/manage/merPlatChannelHospital.update',
        {
          active: checked ? '1' : '0',
          channelId,
          hospitalId
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
      Ajax.Post('PayUrl', '/manage/merPlatChannelHospital.insert',
        {
          channelId,
          hospitalId,
          active: checked ? '1' : '0',
          createTime: moment().format("YYYY-MM-DD HH:mm:ss"),
        },
        (ret: any) => {
          if (ret.success) {
            message.success('新增成功');
            onSuccess();
          } else {
            message.error('新增失败');
          }
        }
      )
    }
  };

  useEffect(() => {
    const hosTemp = [];
    record.hospitalList.forEach(item => {
      hosTemp.push(item.id);
    })
    setExistHos(hosTemp);

    const dataSource1 = hospitalArray.map(item => {
      const temp = record.hospitalList.find(item2 => item2.id == item.id)
      if (temp) {
        return {
          ...item,
          active: temp.active
        }
      } else {
        return {
          ...item,
          active: '0'
        }
      }
    })
    setDataSource(dataSource1);

  }, []);

  //目录的列表配置
  const columns = [
    {
      title: '医院名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '开通状态',
      key: 'active',
      render: (_, row) => (
        <Switch defaultChecked={row.active == 1 ? true : false}
          onChange={(checked) => {
            onChange(record.channelId, row.id, checked);
          }}
        />
      ),
    },
  ];

  return (
    <Table
      size="small"
      columns={columns}
      dataSource={dataSource}
      bordered
    />
  )

}