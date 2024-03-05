export default class {
    static router = {
      path: '/Survey',
      name: '满意度评价',
      icon: 'ContactsOutlined',
      routes: [
        {
          path: '/Survey/Questionnaire',
          name: '问卷管理',
          icon: 'DatabaseOutlined',
          routes: [
            {
              path: '/Survey/Questionnaire/Editor',
              name: '问卷编辑',
              component: './Survey/Questionnaire/Editor/editor',
            },
            {
              path: '/Survey/Questionnaire/Stat',
              name: '问卷统计',
              component: './Survey/Questionnaire/Stat/stat',
            },
            {
              path: '/Survey/Questionnaire/SatisfiedStat',
              name: '满意度统计',
              component: './Survey/Questionnaire/SatisfiedStat/satisfiedStat',
            },
            {
              path: '/Survey/Questionnaire/DeptStat',
              name: '科室满意度统计',
              component: './Survey/Questionnaire/DeptStat/deptStat',
            },
            {
              path: '/Survey/Questionnaire/Suggestion',
              name: '意见建议汇总',
              component: './Survey/Questionnaire/Suggestion/suggestion',
            }
          ]
        }
      ]
    }
  }