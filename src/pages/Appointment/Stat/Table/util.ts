export default class {

  static formatTableData = (data) => {
    if (!data) return [];
    const formatData = [];
    let rightDeptId = -1;
    data.forEach(obj => {
      let row = 0;
      let sum = 0;
      if (rightDeptId !== obj.deptId) {
        // 如果是新的deptId，计算rowSpan值
        data.forEach((obj2) => {
          if (obj.deptId === obj2.deptId) {
            row += 1;
            sum += obj2.count ? obj2.count : 0
          }
        });
        rightDeptId = obj.deptId;
      }
      obj.rowSpan = row;
      obj.sum = sum;
      formatData.push(obj);
    });
    return formatData;
  }

  //计算统计范围内的挂号总数
  static countRegisterNum = (data) => {
    let sum = 0;
    data.forEach(obj => {
      sum += obj.count ? obj.count : 0
    });
    return sum;
  }
}