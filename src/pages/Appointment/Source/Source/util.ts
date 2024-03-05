export default class {

  // 从全量号源排班数据，匹配日期、午别，并返回号源排班
  static findSchduleByDateAndNoon = (srcScheduleList, date, noon) => {
    const returnData = [];
    for (const item of srcScheduleList) {
      if (item.date === date && item.noon === noon) {
        returnData.push(item);
      }
    }
    return returnData;
  }

  // 根据科室编号查询科室名称 
  static getDeptNameById = (deptList, deptId) => {
    for(const item of deptList) {
      if(item.value === deptId) {
        return item.txt;
      }
    }
    return '';
  }
}