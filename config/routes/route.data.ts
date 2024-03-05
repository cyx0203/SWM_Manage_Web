export default class {
    static router = {
      path: '/Data',
      name: '数据监控运维',
      icon: 'AreaChartOutlined',
      routes: [
        {
          path: '/Data/Trade',
          name: '业务数据',
          icon: 'area-chart',
          routes: [
            {
              path: '/Data/Trade/Record',
              name: '交易明细',
              component: './Data/Trade/Record/record',
            },
            {
              path: '/Data/Trade/Stat',
              name: '交易统计',
              component: './Data/Trade/Stat/stat',
            },
          ]
        },
        {
          path: '/Data/Monitor',
          name: '设备状态监控',
          icon: 'dashboard',
          routes: [
            {
              path: '/Data/Monitor/Devlist',
              name: '设备状态监控',
              component: './Data/Monitor/Devlist/devlist',
            },
            {
              path: '/Data/Monitor/DevEvent',
              name: '设备事件跟踪',
              component: './Data/Monitor/DevEvent/devEvent',
            },
          ]
        },
      ],
    }
  }