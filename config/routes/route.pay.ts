export default class {
    static router = {
      path: '/Pay',
      name: '统一支付平台',
      icon: 'ContactsOutlined',
      routes: [
        {
          path: '/Pay/Total',
          name: '概况',
          icon: 'DatabaseOutlined',
          routes: [
            {
              path: '/Pay/Total/total',
              name: '实时统计',
              component: './Pay/Total/total',
            },
          ]
        },
        {
          path: '/Pay/Order',
          name: '订单中心',
          icon: 'setting',
          routes: [
            {
              path: '/Pay/Order/Pay',
              name: '支付订单管理',
              component: './Pay/Order/Pay/pay',
            },
          ]
        },
        {
          path: '/Pay/Check',
          name: '账单管理',
          icon: 'setting',
          routes: [
            { 
              path: '/Pay/Check/Result',
              name: '对账结果',
              component: './Pay/Check/Result/result',
            },
            {
              path: '/Pay/Check/his',
              name: '业务账单',
              component: './Pay/Check/His/his',
            },
            {
              path: '/Pay/Check/third',
              name: '三方账单',
              component: './Pay/Check/Third/third',
            },
          ]
        },
        {
          path: '/Pay/BasicData',
          name: '基础数据',
          icon: 'DatabaseOutlined',
          routes: [
            {
              path: '/Pay/BasicData/OrderType',
              name: '商品类型字典',
              component: './Pay/BasicData/OrderType/orderType',
            },
            {
              path: '/Pay/BasicData/ThirdPayInfo',
              name: '第三方信息字典',
              component: './Pay/BasicData/ThirdPayInfo/thirdpayInfo',
            },
            {
              path: '/Pay/BasicData/PayType',
              name: '支付类型字典',
              component: './Pay/BasicData/PayType/payType',
            }
          ]
        },
        {
          path: '/Pay/Merchant',
          name: '收单管理',
          icon: 'DatabaseOutlined',
          routes: [
            {
              path: '/Pay/Merchant/MerInstitution',
              name: '收单机构管理',
              component: './Pay/Merchant/MerInstitution/merInstitution',
            },
            {
              path: '/Pay/Merchant/Channel',
              name: '渠道管理',
              component: './Pay/Merchant/Channel/channel',
            },
            {
              path: '/Pay/Merchant/Paymode',
              name: '商户',
              component: './Pay/Merchant/Paymode/paymode',
            },
          ]
        },
        {
          path: '/Pay/System',
          name: '系统管理',
          icon: 'DatabaseOutlined',
          routes: [
            {
              path: '/Pay/System/Record',
              name: '操作日志',
              component: './Pay/System/Record/record',
            },
            {
              path: '/Pay/System/PassWord',
              name: '超级密码',
              component: './Pay/System/PassWord/password',
            },
            {
              path: '/Pay/System/HospitalManage',
              name: '医院管理',
              component: './Pay/System/HospitalManage/hospitalManage',
            }
          ]
        },
      ],
    }
  }