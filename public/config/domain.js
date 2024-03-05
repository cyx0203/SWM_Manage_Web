// 本地测试（非nginx打包）
const BaseUrl = 'http://127.0.0.1';
const Domain = {
  //基础模块
  BasicUrl: `${BaseUrl}:16000`,

  //支付对账平台
  PayUrl: `${BaseUrl}:16010`,

  //数据运维平台
  DataUrl: `${BaseUrl}:16030`,

  //预约挂号平台
  AptUrl: `${BaseUrl}:16050`,

  //身份认证平台
  IdentityUrl: `${BaseUrl}:16060`,

  //满意度调查
  SurveyUrl: `${BaseUrl}:16070`,
  //分诊管理平台
  TriageUrl: `${BaseUrl}:16031`,
  //SWM超级窗
  SWMUrl: `${BaseUrl}:16032`,
};

// nginx打包
const NginxBaseUrl = 'http://192.168.103.107';
const NginxDomain = {
  //基础模块
  BasicUrl: `${NginxBaseUrl}/BasicUrl`,

  //支付对账平台
  PayUrl: `${NginxBaseUrl}/PayUrl`,

  //数据运维平台
  DataUrl: `${NginxBaseUrl}/DataUrl`,

  //预约挂号平台
  AptUrl: `${NginxBaseUrl}/AptUrl`,

  //身份认证平台
  IdentityUrl: `${NginxBaseUrl}/IdentityUrl`,

  //满意度调查
  SurveyUrl: `${NginxBaseUrl}/SurveyUrl`,
};

window.GGMIDENDPRO_EXT_CFG = {
  Domain: Domain
}