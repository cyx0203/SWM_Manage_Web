export default class {
    static router = {
      path: '/SWM',
      name: 'SWM平台',
      icon: 'ApartmentOutlined',
      routes: [
        {
          path: '/SWM/Media',
          name: '视频管理',
          icon: 'DatabaseOutlined',
          component: './SWM/Media/media',
        },
        {
          path: '/SWM/Seat',
          name: '座席管理',
          icon: 'DatabaseOutlined',
          component: './SWM/Seat/seat',
        },
        {
          path: '/SWM/Finance',
          name: '座席人员管理',
          icon: 'DatabaseOutlined',
          component: './SWM/Finance/finance',
        },
      ],
    }
  }