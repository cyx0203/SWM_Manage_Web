//引入外部交易地址列表的配置数据
//引入外部交易地址列表的配置数据
import Domain from './domain';
import routes from './routes';

const Settings: any = {
  //全局主标题
  MAIN_TITLE: '国光业务中台',
  //版本号
  VERSION: 'Frame Ver:1.1.0',
  //交易超时时间(秒)
  TRADE_TIMEOUT: 30,
  //水印内容[无需水印则配置为null,设置为空将显示登录账号内容]
  WATERMARK: null,
  //日志输出优化
  LOG_OPTIMIZE: false,
  //日志屏蔽
  LOG_FORBIDDEN: false,
  //❌ 是否要开启KV功能[暂时废弃]
  KEEPALIVE: true,
  //本地存储超时时间（单位：秒）
  ST_TIMEOUT: 60 * 60 * 24 * 7,
  //环境标识
  ENV: '开发环境',
  //是否可绕过登录
  SIKP_LOGIN: false,
  //登录后跳转的默认页面
  LOGIN_SUCCESSOR_PAGE: '/welcome',
  //交易地址列表
  DOMAIN: Domain,
  /** 菜单 */
  MENU: routes
};

export default Settings;