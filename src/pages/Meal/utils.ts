export default class {
  static getStatus: any = (type = 'tv') => {
    if (type === 'kv')
      return { '0': '停用', '1': '启用' };
    return [{ txt: '停用', value: '0' }, { txt: '启用', value: '1' }];
  }

  static getTimeiInterval: any = (type = 'tv') => {
    if (type === 'kv')
      return { '1': '早', '2': '中', '3': '晚' };
    return [{ txt: '早', value: '1' }, { txt: '中', value: '2' }, { txt: '晚', value: '3' }];
  }

  static getOrderStatus: any = (type = 'tv') => {
    if (type === 'kv')
      return { '1': '已支付', '0': '待支付', '2': '已取消', '3': '待退费', '4': '已退费', '5': '已配送' };
    return [{ txt: '已支付', value: '1' }, { txt: '待支付', value: '0' }, { txt: '已取消', value: '2' }, { txt: '待退费', value: '3' }, { txt: '已退费', value: '4' }, { txt: '已配送', value: '5' }];
  }
}


