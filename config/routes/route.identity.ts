export default class {
    static router = {
      path: '/Identity',
      name: '身份认证平台',
      icon: 'Idcard',
      routes: [
        {
          path: '/Identity/PatientManage',
          name: '身份管理',
          icon: 'project',
          routes: [
            {
              path: '/Identity/PatientManage/PatientInfo',
              name: '患者信息',
              component: './Identity/PatientManage/PatientInfo/patientinfo',
            },
          ]
        },
      ],
    }
  }