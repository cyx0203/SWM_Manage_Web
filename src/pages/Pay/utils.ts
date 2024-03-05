
export function fixedZero(val: number) {
  return val * 1 < 10 ? `0${val}` : val;
}

export function add(num1: any, num2: any) {
  const num1Digits = (num1.toString().split('.')[1] || '').length;
  const num2Digits = (num2.toString().split('.')[1] || '').length;
  const baseNum = Math.pow(10, Math.max(num1Digits, num2Digits));
  return ((num1 * baseNum + num2 * baseNum) / baseNum).toFixed(2) ;
}

export function orderStatus(type = 'tv') {
  if (type === 'kv')
    return { '0': '待确认', '1': '已确认', '2': '订单关闭' };
  return [{ txt: '待确认', value: '0' }, { txt: '已确认', value: '1' }, { txt: '订单关闭', value: '2' }];
}

export function transType(type = 'tv') {
  if (type === 'kv')
    return { '1': '入账', '-1': '出账' };
  return [{ txt: '入账', value: '1' }, { txt: '出账', value: '-1' }];
}

export function payStatus(value): any {
  let state = "default";
  switch (value) {
    case "0":
      state = "processing";
      break;
    case "1":
      state = "success";
      break;
    default:
      state = "default";
  }
  return state;
}


