// 各类通讯类

import { request } from 'umi';
import { notification } from 'antd';

const DOMAIN: any = window.GGMIDENDPRO_EXT_CFG.Domain;

const HttpBase: any = async (
  type: string,
  product: string,
  api: string,
  params: any = {},
  config: any = null,
) => {
  // let state: any = 0;
  // let errMsg: any = null;
  let baseUrl: string = ''; //BASE_URL;
  //额外手动配置
  //额外URL优先级：baseUrl > product
  if (product && product !== '') {
    baseUrl = DOMAIN[product];
    //如果未获取到约定的KEY需要在前端报错提示
    if (!baseUrl) {
      baseUrl = '';
      const errMsg: string = `未找到该产品名约定的Key值[${product}]`;
      console.error(errMsg);
      notification.error({
        message: '交易地址获取失败',
        // description: `${err.data.returnMsg ? err.data.returnMsg : err}`,
        description: errMsg,
      });
    }
  }
  //额外手动配置
  if (config) {
    if (config.baseUrl) baseUrl = config.baseUrl;
  }
  const url: string = `${baseUrl}${api}`;
  const result: any = await request(url, {
    method: `${type}`,
    headers: {
      'Content-Type': 'application/json',
    },
    data: params,
  }).catch((err: any) => {
  });
  return result;
};

/**
 * HTTP交易发起
 * [::Use Example::] import { HttpReq } from '@/core/trade';
 * @param api ……接口
 * @param config ……交易配置（非必要配置）
 */
const HttpReqPost: any = async (
  product: string,
  api: string,
  params: any = {},
  config: any = null,
) => {
  return HttpBase('POST', product, api, params, config);
};

const HttpReqGet: any = async (
  product: string,
  api: string,
  params: any = {},
  config: any = null,
) => {
  return HttpBase('GET', product, api, params, config);
};

const AjaxBase: any = async (
  type: string,
  product: string,
  api: string,
  params: any = {},
  scallback: Function,
  fcallback: Function,
  config: any = null,
) => {
  window.GGMIDENDPRO.GLoadingState = true;
  window.GGMIDENDPRO.GLoading(true);

  let baseUrl: string = ''; //BASE_URL;

  //额外手动配置
  //额外URL优先级：baseUrl > product
  if (product && product !== '') {
    baseUrl = DOMAIN[product];
    //如果未获取到约定的KEY需要在前端报错提示
    if (!baseUrl) {
      baseUrl = '';
      const errMsg: string = `未找到该产品名约定的Key值[${product}]`;
      console.error(errMsg);
      notification.error({
        message: '交易地址获取失败',
        // description: `${err.data.returnMsg ? err.data.returnMsg : err}`,
        description: errMsg,
      });
    }
  }
  if (config) {
    if (config.baseUrl) baseUrl = config.baseUrl;
  }
  //交易地址整合拼接
  const url: string = `${baseUrl}${api}`;

  try {
    const res = await request(url, {
      method: `${type}`,
      headers: {
        'Content-Type': 'application/json',
      },
      data: params,
    });
    if (scallback) scallback(res);

    return res;
  } catch (error) {
    if (fcallback) fcallback(error);
  } finally {
    window.GGMIDENDPRO.GLoadingState = false;
    window.GGMIDENDPRO.GLoading(false);
  }
};

/**
 * 戻り地獄のAjax方法
 */
const Ajax: any = {
  Post: async function fetchPost<T = any>(...args) {
    return AjaxBase('post', ...args) as T;
  },
  Get: (...params) => {
    AjaxBase('get', ...params);
  },
};

export { HttpReqPost, HttpReqGet, Ajax };
