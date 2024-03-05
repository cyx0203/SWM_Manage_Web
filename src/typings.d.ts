declare module 'slash2';
declare module '*.css';
declare module '*.less';
declare module '*.scss';
declare module '*.sass';
declare module '*.svg';
declare module '*.png';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.gif';
declare module '*.bmp';
declare module '*.tiff';
declare module 'omit.js';
declare module 'numeral';
declare module '@antv/data-set';
declare module 'mockjs';
declare module 'react-fittext';
declare module 'bizcharts-plugin-slider';

// preview.pro.ant.design only do not use in your production ;
// preview.pro.ant.design Dedicated environment variable, please do not use it in your project.
declare let ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION: 'site' | undefined;

declare const REACT_APP_ENV: 'test' | 'dev' | 'pre' | false;

interface Window {
  GGMIDENDPRO: {
    console?: Console;
    GlobalData?: any;
    GLoading?: any;
    GLoadingState?: any;
    GlobalData?: any;
  };
  GGMIDENDPRO_EXT_CFG: {
    Domain?: any;
  }
}

//appCfg.ts中定义的define变量
declare const MAIN_TITLE;
declare const VERSION;
declare const WATERMARK;
declare const LOG_OPTIMIZE;
declare const TRADE_TIMEOUT;
declare const LOG_FORBIDDEN;
declare const KEEPALIVE;
declare const ST_TIMEOUT;
declare const ENV;
declare const SIKP_LOGIN;
declare const LOGIN_SUCCESSOR_PAGE;

declare const GGMIDENDPRO;
declare const GGMIDENDPRO_EXT_CFG;
