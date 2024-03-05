const localBaseUrl: string = 'http://127.0.0.1';  // 本地测试
const fzUrl:string = 'http://192.168.1.103';//分诊
const Domain: any = {
  //基础模块
  BasicUrl: `${localBaseUrl}:16000`,

  //支付对账平台
  PayUrl: `${localBaseUrl}:16010`,

  //数据运维平台
  DataUrl: `${localBaseUrl}:16030`,

  //预约挂号平台
  AptUrl: `${localBaseUrl}:16050`,

  //身份认证平台
  IdentityUrl: `${localBaseUrl}:16060`, 

  //满意度调查
  // SurveyUrl: `${localBaseUrl}:16070`,

  //分诊管理平台
  TriageUrl: `${localBaseUrl}:16031`,
  //SWM超级窗
  SWMUrl: `${localBaseUrl}:16032`,
};

// const nginxBaseUrl: string = 'http://192.168.103.107';  // nginx服务器打包
// const Domain: any = {
//   //基础模块
//   BasicUrl: `${nginxBaseUrl}/BasicUrl`,

//   //支付对账平台
//   PayUrl: `${nginxBaseUrl}/PayUrl`,

//   //数据运维平台
//   DataUrl: `${nginxBaseUrl}/DataUrl`,

//   //预约挂号平台
//   AptUrl: `${nginxBaseUrl}/AptUrl`,

//   //身份认证平台
//   IdentityUrl: `${nginxBaseUrl}/IdentityUrl`, 

//   //满意度调查
//   SurveyUrl: `${nginxBaseUrl}/SurveyUrl`,
// };

export default Domain;
