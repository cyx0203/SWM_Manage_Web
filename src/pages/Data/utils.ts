export function fixedZero(val: number) {
  return val * 1 < 10 ? `0${val}` : val;
}

export function add(num1: any, num2: any) {
  const num1Digits = (num1.toString().split('.')[1] || '').length;
  const num2Digits = (num2.toString().split('.')[1] || '').length;
  const baseNum = Math.pow(10, Math.max(num1Digits, num2Digits));
  return ((num1 * baseNum + num2 * baseNum) / baseNum).toFixed(2) ;
}

export function statWays(type = 'tv') {
  if (type === 'kv')
    return { '1': '支付统计', '2': '交易统计' };
  return [{ txt: '支付统计', value: '1' }, { txt: '交易统计', value: '2' }];
}


