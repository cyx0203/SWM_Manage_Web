export default class {
  static router = {
    path: '/Basic',
    name: '基础数据维护',
    icon: 'appstore',
    routes: [
      {
        path: '/Basic/Project',
        name: '项目医院管理',
        icon: 'project',
        routes: [
          {
            path: '/Basic/Project/Project',
            name: '项目管理',
            component: './Basic/Project/Project/project',
          },
          {
            path: '/Basic/Project/Hospital',
            name: '医院管理',
            component: './Basic/Project/Hospital/hospital',
          },
          {
            path: '/Basic/Project/Institution',
            name: '院内机构管理',
            component: './Basic/Project/Institution/institution',
          },
          {
            path: '/Basic/Project/Branch',
            name: '区域机构管理',
            component: './Basic/Project/Branch/branch',
          }
          // {
          //   path: '/Basic/Project/Config',
          //   name: '项目医院参数',
          //   component: './Basic/Project/Config/config',
          // },
        ]
      },
      {
        path: '/Basic/Resource',
        name: '医院资源数据',
        icon: 'appstore',
        routes: [
          {
            path: '/Basic/Resource/Hospital',
            name: '医院简介',
            component: './Basic/Resource/Hospital/hospital',
          },
          {
            path: '/Basic/Resource/Department',
            name: '科室管理',
            component: './Basic/Resource/Department/department',
          },
          {
            path: '/Basic/Resource/DepartmentLevelOne',
            name: '科室管理（一级）',
            component: './Basic/Resource/DepartmentLevelOne/department',
          },
          {
            path: '/Basic/Resource/Doctor',
            name: '医生管理',
            component: './Basic/Resource/Doctor/doctor',
          },
          {
            path: '/Basic/Resource/Text',
            name: '图文管理',
            component: './Basic/Resource/Text/text',
          },
        ]
      },
      {
        path: '/Basic/Device',
        name: '设备信息维护',
        icon: 'project',
        routes: [
          // {
          //   path: '/Basic/Device/Device',
          //   name: '设备维护',
          //   component: './Basic/Device/Device/device',
          // },
          {
            path: '/Basic/Device/Devfty',
            name: '厂商管理',
            component: './Basic/Device/Devfty/devfty',
          },
          {
            path: '/Basic/Device/Devtype',
            name: '设备类型',
            component: './Basic/Device/Devtype/devtype',
          },
          {
            path: '/Basic/Device/Devices',
            name: '设备维护',
            component: './Basic/Device/Devices/devices',
          },
        ]
      },
      {
        path: '/Basic/Code',
        name: '综合代码管理',
        icon: 'code',
        component: './Basic/Code/code',
      },
    ],
  }
}