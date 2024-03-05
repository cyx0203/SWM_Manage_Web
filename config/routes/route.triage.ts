export default class {
    static router = {
      path: '/Triage',
      name: '分诊管理平台',
      icon: 'ApartmentOutlined',
      routes: [
        {
          path: '/Triage/Department',
          name: '科室管理',
          icon: 'DatabaseOutlined',
          component: './Triage/Department/department',
        },
        {
          path: '/Triage/Surgery',
          name: '诊室管理',
          icon: 'DatabaseOutlined',
          component: './Triage/Surgery/surgery',
        },
        {
          path: '/Triage/Equipment',
          name: '设备管理',
          icon: 'DatabaseOutlined',
          component: './Triage/Equipment/equipment',
        },
        {
          path: '/Triage/Doctors',
          name: '医生管理',
          icon: 'DatabaseOutlined',
          component: './Triage/Doctor',
        },
        {
          path: '/Triage/Templates',
          name: '模板管理',
          icon: 'DatabaseOutlined',
          component: './Triage/Templates',
        },
      ],
    }
  }