export default class utils {

  static getDate(n) {
    var uom = new Date(new Date() - 0 + n * 86400000);
    var umm = uom.getMonth() + 1;
    if (umm.toString().length < 2) {
      umm = "0" + umm;
    }
    // alert(umm);
    var udd = uom.getDate();
    if (udd.toString().length < 2) {
      udd = "0" + udd;
    }
    uom = uom.getFullYear() + umm.toString() + udd.toString();
    return uom;
  }

  /**
 * 获取相对今天的日期，时间
 * 格式 yyyy-MM-dd
 * @param n 相对今天的天数（ -1 代表昨天）（+1 代表明天）
 */
  static getNormalDateAny(n) {
    let uom = new Date(new Date() - 0 + n * 86400000);
    let umm = uom.getMonth() + 1;
    if (umm.toString().length < 2) {
      umm = "0" + umm;
    }
    let udd = uom.getDate();
    if (udd.toString().length < 2) {
      udd = "0" + udd;
    }
    return uom.getFullYear() + '-' + umm + '-' + udd;
  }
}
