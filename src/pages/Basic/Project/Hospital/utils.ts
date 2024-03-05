export function hospType(type = 'tv'): any {
  if (type === 'kv')
    return { '1': '公立医院', '2': '私立医院', '3': '民营诊所', '4':'其他' };
  return [{ txt: '公立医院', value: '1' }, { txt: '私立医院', value: '2' }, { txt: '民营诊所', value: '3' },{ txt: '其他', value: '4' }];
}

export function classType(type = 'tv'): any {
  if (type === 'kv')
    return { '1': '一级', '2': '二级', '3': '三级' };
  return [{ txt: '一级', value: '1' }, { txt: '二级', value: '2' }, { txt: '三级', value: '3' }];
}

export function gradeType(type = 'tv'): any {
  if (type === 'kv')
    return { '甲': '甲', '乙': '乙', '丙': '丙' };
  return [{ txt: '甲', value: '甲' }, { txt: '乙', value: '乙' }, { txt: '丙', value: '丙' }];
}

export function activeType(type = 'tv'): any {
  if (type === 'kv')
    return { '1': '启用', '2': '停用'};
  return [{ txt: '启用', value: '1' }, { txt: '停用', value: '2' }];
}