export default class {

  // 从全量周排班明细数据，匹配到具体的科室，星期和午别，并返回排班明细对象
  static findBlankSchdule = (schTempDtllList, deptId, week, noon) => {
    const blankList = [];
    for (const item of schTempDtllList) {
      if (item.deptId === deptId && item.week === week && item.noon === noon) {
        blankList.push(item);
      }
    }
    return blankList;
  }
}