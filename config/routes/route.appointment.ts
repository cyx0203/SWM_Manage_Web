export default class {
  static router = {
    path: '/Appointment',
    name: '预约挂号平台',
    icon: 'appstore',
    routes: [
      {
        path: '/Appointment/Source',
        name: '号源管理',
        icon: 'project',
        routes: [
          {
            path: '/Appointment/Source/Source',
            name: '科室号源管理',
            component: './Appointment/Source/Source/source',
          },
          {
            path: '/Appointment/Source/Stop',
            name: '停诊记录查询',
            component: './Appointment/Source/Stop/stop',
          },
          {
            path: '/Appointment/Source/Add',
            name: '加号记录查询',
            component: './Appointment/Source/Add/add',
          },
          {
            path: '/Appointment/Source/Sync',
            name: 'HIS号源同步记录',
            component: './Appointment/Source/Sync/sync',
          },
        ]
      },
      {
        path: '/Appointment/Record',
        name: '预约记录',
        icon: 'project',
        routes: [
          {
            path: '/Appointment/Record/Order',
            name: '预约订单查询',
            component: './Appointment/Record/Order/order',
          },
          {
            path: '/Appointment/Record/View',
            name: '预约号源查询',
            component: './Appointment/Record/View/view',
          },
          {
            path: '/Appointment/Record/Log',
            name: '渠道日志查询',
            component: './Appointment/Record/Log/log',
          },
        ]
      },
      {
        path: '/Appointment/Stat',
        name: '统计分析',
        icon: 'DatabaseOutlined',
        routes: [
          {
            path: '/Appointment/Stat/Table',
            name: '统计报表',
            component: './Appointment/Stat/Table/table',
          },
          {
            path: '/Appointment/Stat/Channel',
            name: '渠道预约分布统计',
            component: './Appointment/Stat/Channel/channel',
          },
          {
            path: '/Appointment/Stat/Dept',
            name: '科室预约人次统计',
            component: './Appointment/Stat/Dept/dept',
          },
          {
            path: '/Appointment/Stat/Doctor',
            name: '专家预约人次统计',
            component: './Appointment/Stat/Doctor/doctor',
          },
        ]
      },
      {
        path: '/Appointment/Schedule',
        name: '排班模板管理',
        icon: 'project',
        routes: [
          {
            path: '/Appointment/Schedule/Template',
            name: '周排班模板',
            component: './Appointment/Schedule/Template/template',
          },
        ]
      },
      {
        path: '/Appointment/Rule',
        name: '排班规则',
        icon: 'setting',
        routes: [
          {
            path: '/Appointment/Rule/Season',
            name: '时令规则',
            component: './Appointment/Rule/Season/season',
          },
          {
            path: '/Appointment/Rule/Source',
            name: '号源数量规则',
            component: './Appointment/Rule/Source/source',
          },
          {
            path: '/Appointment/Rule/Channel',
            name: '渠道挂号规则',
            component: './Appointment/Rule/Channel/channel',
          },
        ]
      },
    ],
  }
}