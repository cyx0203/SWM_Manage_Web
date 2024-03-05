import Pay from './routes/route.pay';
import Appointment from './routes/route.appointment';
import Basic from './routes/route.basic';
import Data from './routes/route.data';
import Survey from './routes/route.survey';
import Identity from './routes/route.identity';
import Meal from './routes/route.meal';
import Triage from './routes/route.triage'
import SWM from './routes/route.swm'

export default [
  {
    path: '/user',
    layout: false,
    routes: [
      {
        path: '/user/login',
        name: '登录',
        component: './Common/user/Login',
      },
      {
        component: './Common/exception/404',
      },
    ],
  },
  {
    path: '/welcome',
    name: '欢迎',
    icon: 'smile',
    component: './Common/welcome/welcome',
    // access: 'canLogin',
  },

  // 统一对账平台
  // Pay.router,
  // 预约平台
  // Appointment.router,
  // 基础数据
  Basic.router,
  // 数据运维平台
 Data.router,
  // 满意度评价
//  Survey.router,
  // 身份认证
  // Identity.router,
  //云点餐系统
  // Meal.router,
  //分针管理系统
  // Triage.router,
  // SWM超级窗
  SWM.router,
  {
    path: '/system',
    name: '系统管理',
    icon: 'smile',
    routes: [
      {
        path: '/system/role',
        name: '角色管理',
        icon: 'team',
        component: '../pages/System/Role',
      },
      {
        path: '/system/user',
        name: '用户管理',
        icon: 'user',
        component: '../pages/System/Users',
      },
      {
        path: '/system/menu',
        name: '菜单管理',
        icon: 'user',
        component: '../pages/System/Menu/menu',
      },
    ],
  },
  {
    path: '/setting',
    name: '个人设置',
    icon: 'smile',
    component: './Common/user/Setting',
    hideInMenu: true,
  },
  {
    path: '/',
    redirect: '/welcome',
  },
  {
    path: '/exception',
    component: './Common/exception/Exception',
  },
];
