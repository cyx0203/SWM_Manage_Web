export default class {
  static getCaseStatus: any = (type = 'tv') => {
    if (type === 'kv')
      return { 0: '待审核', 1: '审核通过' , 2: '审核不通过' };
    return [{ txt: '待审核', value: 0 }, { txt: '审核通过', value: 1 }, { txt: '审核不通过', value: 2 }];
  }

  static getCareStatus: any = (type = 'tv') => {
    if (type === 'kv')
      return { 0: '待审核' , 1: '审核通过', 2: '审核不通过', 3: '有效时间内' , 9: '停用' };
    return [{ txt: '待审核', value: 0 }, { txt: '审核通过', value: 1 }, { txt: '审核不通过', value: 2 } , { txt: '有效时间内', value: 3 } , { txt: '停用', value: 9 }];
  }

  static getAccessStatus: any = (type = 'tv') => {
    if (type === 'kv')
      return { 0: '过往记录', 1: '当前记录' };
    return [{ txt: '过往记录', value: 0 }, { txt: '当前记录', value: 1 }];
  }
}


