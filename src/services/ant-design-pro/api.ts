// @ts-ignore
/* eslint-disable */
import { request } from 'umi';

/** 获取当前的用户 GET /manage/currentUser */
export async function currentUser(options?: { [key: string]: any }) {
  return request<{
    data: API.CurrentUser;
  }>('/manage/currentUser', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 退出登录接口 POST /manage/login/outLogin */
export async function outLogin(options?: { [key: string]: any }) {
  return request<Record<string, any>>('/manage/login/outLogin', {
    method: 'POST',
    ...(options || {}),
  });
}

/** 登录接口 POST /manage/login/account */
export async function login(body: API.LoginParams, options?: { [key: string]: any }) {
  return request<API.LoginResult>('/manage/login/account', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /manage/notices */
export async function getNotices(options?: { [key: string]: any }) {
  return request<API.NoticeIconList>('/manage/notices', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 获取规则列表 GET /manage/rule */
export async function rule(
  params: {
    // query
    /** 当前的页码 */
    current?: number;
    /** 页面的容量 */
    pageSize?: number;
  },
  options?: { [key: string]: any },
) {
  return request<API.RuleList>('/manage/rule', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 新建规则 PUT /manage/rule */
export async function updateRule(options?: { [key: string]: any }) {
  return request<API.RuleListItem>('/manage/rule', {
    method: 'PUT',
    ...(options || {}),
  });
}

/** 新建规则 POST /manage/rule */
export async function addRule(options?: { [key: string]: any }) {
  return request<API.RuleListItem>('/manage/rule', {
    method: 'POST',
    ...(options || {}),
  });
}

/** 删除规则 DELETE /manage/rule */
export async function removeRule(options?: { [key: string]: any }) {
  return request<Record<string, any>>('/manage/rule', {
    method: 'DELETE',
    ...(options || {}),
  });
}
