import { Fragment, useEffect, useRef, useState } from 'react';
import { DomRoot, Ajax, KeepAlive } from '@/components/PageRoot';
import { Card, Table, message, Popconfirm } from 'antd';
import EditSchedule from './editSchedule';
import { EditOutlined, DeleteOutlined, PlusOutlined, PushpinFilled } from '@ant-design/icons';
import Util from './util';
import SmartTop from '@/components/SmartTop';

const Template = () => {

  // 查询条件区域 
  const topRef = useRef(null);
  const queryDeptId = useRef(null);
  //周模板从表查询结果集
  const [schTempDtllList, setSchTempDtllList] = useState(null);
  const [deptForTable, setDeptForTable] = useState(null);
  // 编辑排班弹出框
  const [editSchedulVisible, setEditScheduleVisible] = useState(false);
  // 编辑模式
  const [editMode, setEditMode] = useState(false);
  // 预先查询的基础数据-科室、医生、号别 
  const [deptKV, setDeptKV] = useState(null);
  const [registerTypeList, setRegisterTypeList] = useState(null);
  const [doctorList, setDoctorList] = useState(null);
  // 未编辑排班，传入所点击区域的各项数据
  const [tempDtlRecord, setTempDtlRecord] = useState(null);
  const [deptInfo, setDeptInfo] = useState(null);
  const [week, setWeek] = useState(null);
  const [noon, setNoon] = useState(null);

  // 查询周排版模板
  const queryTempDtl = () => {
    setEditMode(false);
    Ajax.Post('AptUrl', '/manage/schTempDtl.selectByTempId',
      {
        tempId: 1,
        hospitalId: localStorage.getItem('hospitalId'),
      },
      (ret: any) => {
        setSchTempDtllList(ret.list)
      }
    );
  }

  // 查询所有科室
  const queryDepartment = () => {
    Ajax.Post('AptUrl', '/manage/schDept.selectKV',
      {
        hospitalId: localStorage.getItem('hospitalId'),
      },
      (ret: any) => {
        setDeptKV(ret.list);
        const temp = [];
        for (const item of ret.list) {
          temp.push({
            deptId: item.value,
            deptName: item.txt,
          })
        }
        setDeptForTable(temp);
      }
    );
  }

  // 查询所有号别
  const queryRegisterType = () => {
    Ajax.Post('AptUrl', '/manage/com.selectRegisterType',
      {
        hospitalId: localStorage.getItem('hospitalId'),
      },
      (ret: any) => {
        setRegisterTypeList(ret.list)
      }
    );
  }

  // 查询所有专家
  const queryDoctor = () => {
    Ajax.Post('AptUrl', '/manage/com.selectDoctor',
      {
        hospitalId: localStorage.getItem('hospitalId'),
      },
      (ret: any) => {
        setDoctorList(ret.list)
      }
    );
  }

  const topSubmit = (params = {}) => {
    setEditMode(false);
    queryDeptId.current = params.queryDeptId;
    const temp = [];
    if (queryDeptId.current) {
      // 选择了科室
      for (const item of deptKV) {
        if (item.value === queryDeptId.current) {
          temp.push({
            deptId: item.value,
            deptName: item.txt,
          })
          break;
        }
      }
      setDeptForTable(temp);
    }
    else {
      // 未选择了科室
      for (const item of deptKV) {
        temp.push({
          deptId: item.value,
          deptName: item.txt,
        })
      }
      setDeptForTable(temp);
    }
  }

  useEffect(() => {
    queryTempDtl();
    queryDepartment();
    queryRegisterType();
    queryDoctor();
  }, []);


  // 删除单元格内某一个排班
  const removeOneSchDtl = (id) => {
    Ajax.Post('AptUrl', '/manage/schTempDtl.deleteById',
      {
        id,
      },
      (ret: any) => {
        message.success('删除成功');
        queryTempDtl();
      }
    );
  }

  const showRegisterType = (item: any) => {
    if (item.registerTypeName.indexOf('专家号') > -1 || item.registerTypeName.indexOf('中医') > -1) {   // 专家
      if (item.registerTypeName.indexOf('副高') > -1) {
        // 副高
        return <span style={{ color: 'blue' }}>{item.registerTypeName} <PushpinFilled /> {item.doctorName}</span>
      }
      else {
        // 正高或知名专家
        return <span style={{ color: 'red' }}>{item.registerTypeName} <PushpinFilled /> {item.doctorName}</span>
      }
    }
    else {
      return <span>{item.registerTypeName}</span>
    }
  }

  // 周排版块区的处理
  const showSchduleBlank = (data, row, week, noon) => {
    return (
      <Fragment>
        {data.map(item =>
          <span key={item.id}>
            {/* 显示号别-医生 */}
            {showRegisterType(item)}
            {/* 修改图标 */}
            {editMode &&
              <EditOutlined style={{ color: 'blue', marginLeft: 5, cursor: 'pointer' }}
                onClick={() => {
                  setTempDtlRecord(item);
                  setDeptInfo(row);
                  setWeek(week);
                  setNoon(noon);
                  setEditScheduleVisible(true);
                }}
              />}
            {/* 删除图标 */}
            {editMode &&
              <Popconfirm title="确定要删除该条记录"
                onConfirm={() => removeOneSchDtl(item.id)}
              >
                <DeleteOutlined style={{ color: 'red', marginLeft: 5, cursor: 'pointer' }} />
              </Popconfirm>}
            <br /></span>)}
        {editMode &&
          <PlusOutlined style={{ color: 'green', cursor: 'pointer' }}
            onClick={() => {
              setTempDtlRecord(null);
              setDeptInfo(row);
              setWeek(week);
              setNoon(noon);
              setEditScheduleVisible(true);
            }} />}
      </Fragment>
    )
  }

  const tableColumns = () => {
    const weekList = ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日'];
    const columns = [];
    columns.push({
      title: '科室名称',
      dataIndex: 'deptName',
      width: 200,
      fixed: 'left',
    })
    for (let i = 0; i < 7; i++) {
      columns.push({
        title: weekList[i],
        children: [{
          title: '上午',
          width: 200,
          render: (value, row) => {
            const scheduleNoon1 = Util.findBlankSchdule(schTempDtllList, row.deptId, (i + 1).toString(), '1');
            return showSchduleBlank(scheduleNoon1, row, (i + 1).toString(), '1')
          }
        }, {
          title: '下午',
          width: 200,
          render: (value, row) => {
            const scheduleNoon2 = Util.findBlankSchdule(schTempDtllList, row.deptId, (i + 1).toString(), '2');
            return showSchduleBlank(scheduleNoon2, row, (i + 1).toString(), '2')
          }
        }]
      })
    }
    return columns;
  }

  const getFields = () => {
    return [{
      type: 'select',
      label: '科室',
      style: { width: 250 },
      field: 'queryDeptId',
      placeholder: '请选择查询科室...',
      showSearch: true,
      options: deptKV,
      allowClear: true,
    }, {
      type: 'button',
      buttonList: [
        {
          type: 'primary',
          htmlType: 'submit',
          buttonText: '查询',
          style: { marginLeft: 8 }
        }, {
          buttonText: '编辑',
          style: { marginLeft: 8 },
          onClick: () => {
            if (queryDeptId.current) {
              setEditMode(true);
            }
            else {
              message.error('请先选择科室再编辑');
            }
          }
        }
      ]
    }]
  }

  return (
    <DomRoot>
      {/* 查询条件区域 */}
      <Card>
        <SmartTop handleSubmit={topSubmit} getFields={getFields} onRef={topRef}><div /></SmartTop>
      </Card>
      {/* 表格 */}
      <Card style={{ marginTop: 8 }} loading={window.GGMIDENDPRO.GLoadingState}>
        {/* 主体周排班模板信息展示 */}
        {schTempDtllList &&
          <Table
            bordered
            size="small"
            columns={tableColumns()}
            dataSource={deptForTable || []}
            pagination={false}
            scroll={{ x: 1500, y: 650 }}
          />}
      </Card>
      {/* 编辑专家排班弹出框 */}
      <EditSchedule
        visible={editSchedulVisible}
        tempId={1}
        tempDtlRecord={tempDtlRecord}
        deptInfo={deptInfo}
        week={week}
        noon={noon}
        doctorList={doctorList}
        registerTypeList={registerTypeList}
        onClose={() => setEditScheduleVisible(false)}
        onOk={() => {
          setEditScheduleVisible(false);
          queryTempDtl();
        }}
      />
    </DomRoot>
  )
}

export default () => (
  <KeepAlive>
    <Template />
  </KeepAlive>
)
