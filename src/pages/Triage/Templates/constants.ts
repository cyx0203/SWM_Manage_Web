import { staticPath } from '@/utils';

/**
 * 设备类型
 */
export const category = ['软呼叫', '诊间屏', '综合大屏'] as const;

export const DEVICES = category.map((v, i) => ({ label: v, value: i }));

export const MOD_PREVIEW = ['', staticPath('诊间屏.png'), staticPath('综合屏.png')];
