export default class {
  static router = {
    path: '/Meal',
    name: '点餐管理平台',
    icon: 'coffee',
    routes: [
      {
        path: '/Meal/Set',
        name: '基础配置',
        icon: 'project',
        routes: [
          {
            path: '/Meal/Set/DishType',
            name: '菜品类别管理',
            component: './Meal/Set/DishType/dishType',
          },
          {
            path: '/Meal/Set/Dish',
            name: '菜品管理',
            component: './Meal/Set/Dish/dish',
          },
          {
            path: '/Meal/Set/DishExtra',
            name: '加餐管理',
            component: './Meal/Set/DishExtra/dishExtra',
          },
          {
            path: '/Meal/Set/Canteen',
            name: '食堂管理',
            component: './Meal/Set/Canteen/canteen',
          },
          {
            path: '/Meal/Set/CanteenEmployee',
            name: '食堂人员管理',
            component: './Meal/Set/CanteenEmployee/canteenEmployee',
          },
          {
            path: '/Meal/Set/OPassword',
            name: '退款密码管理',
            component: './Meal/Set/OPassword/opassword',
          },
        ]
      },
      {
        path: '/Meal/Order',
        name: '订餐管理',
        icon: 'project',
        routes: [
          {
            path: '/Meal/Order/Trans',
            name: '订单管理',
            component: './Meal/Order/Trans/trans',
          },
          {
            path: '/Meal/Order/Cater',
            name: '配餐管理',
            component: './Meal/Order/Cater/cater',
          },
          {
            path: '/Meal/Order/Take',
            name: '领餐管理',
            component: './Meal/Order/Take/take',
          },
          {
            path: '/Meal/Order/Delivery',
            name: '送餐管理',
            component: './Meal/Order/Delivery/delivery',
          },
        ]
      },
      {
        path: '/Meal/Stat',
        name: '汇总统计',
        icon: 'project',
        routes: [
          {
            path: '/Meal/Stat/DishStat',
            name: '菜品统计',
            component: './Meal/Stat/DishStat/dishStat',
          },
        ]
      },
    ],
  }
}