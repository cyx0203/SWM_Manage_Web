export default class {

    // 从全量号源排班数据，匹配到具体的科室，日期和午别，并返回号源排班
    static findBlankSchdule = (srcScheduleList, deptId, date, noon) => {
      const blankList = [];
      for (const item of srcScheduleList) {
        if (item.deptId === deptId && item.date === date && item.noon === noon) {
          blankList.push(item);
        }
      }
      return blankList;
    }
  }