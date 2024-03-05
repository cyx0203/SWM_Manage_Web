import { Settings as LayoutSettings } from '@ant-design/pro-components';
import appCfg from './appCfg';
const Settings: LayoutSettings & {
  pwa?: boolean;
  logo?: string;
} = {
  navTheme: 'dark',
  // 拂晓蓝
  primaryColor: '#1890ff',
  //'side' | 'top' | 'mix'
  //side 为正常模式，top菜单显示在顶部，mix 两种兼有
  layout: 'mix',
  splitMenus: true, // 切割菜单
  contentWidth: 'Fluid',
  fixedHeader: false,
  fixSiderbar: true,
  colorWeak: false,
  title: `${appCfg.MAIN_TITLE}`,
  pwa: false,
  logo: './assets/logo/logo.svg',
  iconfontUrl: '',
  menu: {
    //关闭国际化
    locale: false,
  },
};

export default Settings;
