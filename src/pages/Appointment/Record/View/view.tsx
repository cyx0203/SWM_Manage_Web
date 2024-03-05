import { useEffect, useState } from 'react';
import { DomRoot, Ajax, KeepAlive } from '@/components/PageRoot';
import { Button, Card, Empty } from 'antd';
import moment from 'moment';
import SmartTop from '@/components/SmartTop';

import Detial from './detail';

const View = () => {

  const [deptList, setDeptList] = useState(null);
  const [registerTypeList, setRegisterTypeList] = useState(null);
  const [doctorList, setDoctorList] = useState(null);
  const [registerList, setRegisterList] = useState(null);
  const [visible, setVisible] = useState(false);
  const [detial, setDetial] = useState(null);

  const [args, setArgs] = useState({ date: moment().format('YYYY-MM-DD'), sdate: moment().format('YYYYMMDD'), deptId: null, registerTypeId: null, doctorId: null });


  //获取科室名称
  const showDeptName = (value) => {
    if (deptList) {
      for (let i = 0; i < deptList.length; i++) {
        if (deptList[i].value == value) {
          return deptList[i].txt;
        }
      }
    }
    return '';
  }

  //获取号别名称
  const showTypeName = (value) => {
    if (registerTypeList) {
      for (let i = 0; i < registerTypeList.length; i++) {
        if (registerTypeList[i].value == value) {
          return registerTypeList[i].txt;
        }
      }
    }
    return '';
  }

  //获取医生姓名
  const showDoctorName = (value) => {
    if (doctorList) {
      for (let i = 0; i < doctorList.length; i++) {
        if (doctorList[i].value == value) {
          return doctorList[i].txt;
        }
      }
    }
    return '';
  }

  //格式化查询标题
  const formatTitle = () => {
    let title = '';
    if (args && args.doctorId) {
      title = title + showDoctorName(args.doctorId) + ' / ';
    }
    if (args && args.registerTypeId) {
      title = title + showTypeName(args.registerTypeId) + ' / ';
    }
    if (args && args.deptId) {
      title = title + showDeptName(args.deptId) + ' / ';
    }
    if (args && args.date) {
      title = title + moment(args.date).format('YYYY-MM-DD');
    }
    if (!registerList) {
      return <h4 style={{ color: 'red' }}>请选择查询条件</h4>;
    }
    return <h4 style={{ color: 'red' }}>{title}</h4>;
  }

  //格式化单元格
  const formatRecordList = (value) => {
    if (value == null || value.length === 0) {
      return '未查询出排班号源信息!';
    }
    const dec = value.map((item, index) => {
      console.log('intem=', item);
      let color = "#fff";
      let enable = false;
      let time = "";
      if (item.stime) {
        time = item.stime.substring(0, 2) + ':' + item.stime.substring(2) + '-' + item.etime.substring(0, 2) + ':' + item.etime.substring(2);
      } else {
        time = item.hstime.substring(0, 2) + ':' + item.hstime.substring(2) + '-' + item.hetime.substring(0, 2) + ':' + item.hetime.substring(2);
      }
      let name = item.doctorName ? item.doctorName : item.registerTypeName;

      if (item.userId) {
        color = "#b7eb8f";
        enable = true;
        name = item.userName;
      }
      let detail = {};
      if (enable) {
        detail = [{
          id: item.id,
          patid: item.userId,
          name: item.userName,
          sex: item.userSex,
          phone: item.userPhone,
          source: item.custName,
          dept: item.deptName,
          doc: item.doctorName ? item.doctorName : item.registerTypeName,
          no: item.order || item.horder,
          time: time,
        }];
      }
      return (<Button style={{ margin: 6, height: 80, backgroundColor: color }} onClick={() => { setDetial(detail); setVisible(enable); }}>
        <b>
          {item.order || item.horder}<br />
          {name}<br />
          {time}
        </b>
      </Button>)
    });
    return <div>{dec}</div>
  }

  //科室变化触发
  const onChangeDept = (value) => {
    const regtype = [];
    deptList.map((item, index) => {
      if (value === item.value) {
        item.children.map((citem, cindex) => {
          regtype.push({
            txt: citem.registerTypeName,
            value: citem.registerType,
            children: citem.children,
          })
        });
        setRegisterTypeList(regtype);
      }
    })
  }

  //号类变化触发
  const onChangeRegisterType = (value) => {
    const doc = [];
    registerTypeList.map((item, index) => {
      if (value === item.value) {
        item.children.map((citem, cindex) => {
          doc.push({
            txt: citem.doctorName,
            value: citem.doctorId,
          })
        });
        setDoctorList(doc);
      }
    })
  }

  //查询周排班排班
  const querySchedule = () => {
    Ajax.Post('AptUrl', '/manage/schTempDtl.selectSchedule',
      {
        hospitalId: localStorage.getItem('hospitalId'),
      },
      (ret: any) => {
        const dept = [];
        ret.list.map((item, index) => {
          dept.push({
            txt: item.deptName,
            value: item.deptId,
            children: item.children,
          })
        });
        setDeptList(dept);
      }
    );
  }

  //查询所有预约记录
  const queryRegisterRecord = (keywords) => {
    const query = { ...args, ...keywords };
    Ajax.Post('AptUrl', '/manage/srcSource.selectByKeywords',
      {
        ...query,
        sdate: moment(query.date).format('YYYYMMDD'),
        hospitalId: localStorage.getItem('hospitalId'),
      },
      (ret: any) => {
        setArgs(query);
        setRegisterList(ret.list)
      }
    );
  }

  useEffect(() => {
    querySchedule();
  }, []);

  const getFields = () => {
    return [
      {
        type: 'date-picker',
        style: { width: '180px' },
        field: 'date',
        label: '日期',
        required: true,
        initialValue: moment(),
      },
      {
        type: 'select',
        label: '科室',
        style: { width: '180px' },
        field: 'deptId',
        placeholder: '请选择科室...',
        required: true,
        showSearch: true,
        options: deptList,
        onChange: onChangeDept,
      },
      {
        type: 'select',
        label: '号类',
        style: { width: '200px' },
        field: 'registerTypeId',
        placeholder: '请选择号类...',
        required: true,
        showSearch: true,
        options: registerTypeList,
        onChange: onChangeRegisterType,
      },
      {
        type: 'select',
        label: '医生',
        style: { width: '150px' },
        field: 'doctorId',
        placeholder: '请选择医生...',
        showSearch: true,
        allowClear: true,
        options: doctorList,
      },
      {
        type: 'button',
        buttonList: [
          {
            type: 'primary',
            htmlType: 'submit',
            buttonText: '查询',
            style: { marginLeft: 8 }
          }
        ]
      }
    ]
  }

  return (
    <DomRoot>
      {/* 查询条件区域 */}
      <Card>
        <SmartTop handleSubmit={queryRegisterRecord} getFields={getFields}><div /></SmartTop>
      </Card>
      <Card title={formatTitle()} bordered={false}>
        {registerList ?
          formatRecordList(registerList)
          : <Empty />
        }
      </Card>
      {/* 编辑弹出框 */}
      <Detial
        visible={visible}
        detial={detial}
        onClose={() => setVisible(false)}
      />
    </DomRoot>
  )
}

export default () => (
  <KeepAlive>
    <View />
  </KeepAlive>
)
