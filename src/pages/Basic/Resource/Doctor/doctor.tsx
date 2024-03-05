import { PlusOutlined } from '@ant-design/icons';
import { Fragment, useEffect, useState,useRef } from 'react';
import { DomRoot, Ajax, KeepAlive } from '@/components/PageRoot';
import { Card, List, Button, Avatar, Input, Popconfirm, message, Popover } from 'antd';
import Edit from './edit';
import Photo from './photo';
import SmartTop from '@/components/SmartTop';

const Doctor = () => {

  const [docInfo, setDocInfo] = useState(null);
  const [doctorList, setDoctorList] = useState(null);
  const [editMode, setEditMode] = useState(null);
  const [editVisible, setEditVisible] = useState(false);
  const [photoVisible, setPhotoVisible] = useState(false);
  const [hospitalKV, setHospitalKV] = useState(null);
  //查询条件区域
  const hospitalId: any = useRef(null);

  const TopRef = useRef(null);

  const queryDoctor = (keywords: any) => {
    Ajax.Post('BasicUrl', '/manage/comDoctor.selectAll',
      {
        hospitalId: hospitalId.current,
        ...keywords,
      },
      (ret: any) => {
        setDoctorList(ret);
      }
    );
  }


  const queryHospitalTree = () => {
    Ajax.Post('BasicUrl', '/manage/kv/hospital.selectHosByLevel',
      {
        key: 'id',       // key名称
        value: 'name',   // value名称
        hospitalId: localStorage.getItem("hospitalId"),
        level: "2",
        retKey: 'hospitalKV',
      },
      (ret: any) => {
        setHospitalKV(ret.hospitalKV)
        hospitalId.current = ret.hospitalKV.tv[0].value;
        TopRef.current.getForm().setFieldsValue({ hospitalId: ret.hospitalKV.tv[0].value });
        queryDoctor(null);
      }
    );
  }


  useEffect(() => {
    queryHospitalTree();
  }, []);

  const popoverContent = (item: any) => {
    return (
      <div style={{ width: 400 }}>
        <span>擅长：{item.expert}</span> <br /><br />
        <span>简介：{item.desc}</span>
      </div>
    )
  }

  const deleteDoctor = (item: any) => {
    Ajax.Post('BasicUrl', '/manage/comDoctor.deleteById',
      {
        hospitalId: hospitalId.current,
        id: item.id,
      },
      (ret: any) => {
        message.success('刪除成功');
        queryDoctor(null);
      }
    );
  }

  const description = (item: any) => {
    return (
      <Popover content={popoverContent(item)} title={item.name} trigger="hover">
        <div style={{ height: 130 }}>
          擅长：{item.expert}<br />
          简介：{item.desc}
        </div>
      </Popover>
    )
  }

  const extra = (item: any) => {
    return (
      <Fragment>
        <a onClick={() => {
          setEditVisible(true);
          setDocInfo(item)
          setEditMode(true);
          console.log("item=", item)
        }}
        >编辑
        </a>
        <a
          style={{ marginLeft: 10 }}
          onClick={() => {
            setDocInfo(item);
            setPhotoVisible(true);
            console.log("item=", item)
            console.log("DocInfo=", docInfo)
          }}
        >更换照片
        </a>
        <Popconfirm title="确认删除吗?" onConfirm={() => deleteDoctor(item)}>
          <a style={{ marginLeft: 10 }}>删除</a>
        </Popconfirm>
      </Fragment>
    )
  }

  const photoPath = (item) => {
    if (item.imagePath) {
      return localStorage.getItem('filePath') + item.imagePath;
    }
    return null;
  }

  const changeHandle = (val) => {
    hospitalId.current = val;
  }


  const getFields = () => {
    return [
      {
        type: 'select',
        label: '院区',
        style: { width: '300px' },
        field: 'hospitalId',
        options: hospitalKV ? hospitalKV.tv : [],
        placeholder: '请选择院区...',
        required: true,
        onSelect: changeHandle
      },
      {
        type: 'input',
        style: { width: '300px' },
        placeholder: '请输入科室 / 医生编码 / 姓名 / 擅长 / 描述...',
        field: 'keywords',
        label: '查询条件'
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
            buttonText: '新增医生',
            style: { marginLeft: '8px' },
            onClick: () => { setEditVisible(true);setEditMode(false); }
          },
        ]
      }
    ]
  }

  const { Meta } = Card;
  const { Search } = Input;
  return (
    <DomRoot>
      <Card bordered={false}>
        <SmartTop handleSubmit={queryDoctor} getFields={getFields} onRef={TopRef}><div /></SmartTop>
      </Card>
      <Card>
        {doctorList && doctorList.list &&
          <List<Basic.Doctor>
            grid={{ gutter: 8, xl: 3, xxl: 4 }}
            dataSource={doctorList.list}
            pagination={{ pageSize: 12, position: 'top' }}
            renderItem={item =>
              <List.Item>
                <Card
                  // 兼容关联科室和不关联科室两种情况
                  title={item.deptName ? `${item.deptName} - ${item.level}` : `${item.level}`}
                  // title={`${item.deptName} - ${item.level}`}
                  size='small'
                  bodyStyle={{ height: 185 }}
                  extra={extra(item)}
                  hoverable
                >
                  <Meta
                    avatar={<Avatar src={photoPath(item) || "https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"} size='large' style={{ width: 60, height: 60 }} />}
                    title={item.name}
                    description={description(item)}
                  />
                </Card>
              </List.Item>}
          />}
      </Card>
      {/* 医生信息编辑 */}
      <Edit
        visible={editVisible}
        docInfo={docInfo}
        editMode={editMode}
        hospitalId={hospitalId.current}
        onClose={() => setEditVisible(false)}
        onOk={() => {
          setEditVisible(false)
          queryDoctor(null);
        }}
      />
      {/* 更换照片 */}
      <Photo
        visible={photoVisible}
        docInfo={docInfo}
        hospitalId={hospitalId.current}
        onClose={() => setPhotoVisible(false)}
        onOk={() => {
          setPhotoVisible(false)
          queryDoctor(null);
        }}
      />
    </DomRoot>
  )
}

export default () => (
  <KeepAlive>
    <Doctor />
  </KeepAlive>
)
