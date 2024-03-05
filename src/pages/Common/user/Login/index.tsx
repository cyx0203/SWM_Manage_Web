import Footer from '@/components/Footer';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { LoginForm, ProFormCheckbox, ProFormText } from '@ant-design/pro-components';
import { message, Tabs } from 'antd';
import React, { useState, useEffect } from 'react';
import { history, useModel } from 'umi';
import styles from './index.less';
import { HttpReqPost } from '@/core/trade';
import defaultSettings from '../../../../../config/defaultSettings';
import MD5 from 'blueimp-md5';
import { Ajax } from '@/components/PageRoot';
import _ from 'lodash';

const LOGO: string = './assets/logo/logo.svg';

const Login: React.FC = () => {
  //登录方式（目前此处仅用用户名&密码来登录）
  const [type, setType] = useState<string>('account');
  const { initialState, setInitialState } = useModel('@@initialState');

  useEffect(() => {
    return () => {
    }
  }, [])

  //跳过
  const skipLogin = () => {

  }

  /**
   * 登录提交操作
   * @param values [object]……输入内容
   */
  const submitHandle = async (values) => {
    //发起登录交易
    let ret: any = null;

    //实际登录交易执行的流程
    if (!SIKP_LOGIN) {
      ret = await HttpReqPost('BasicUrl', '/manage/login.account', {
        account: values.username,
        //前端MD5加密
        password: MD5(values.password)
        // password: values.password
      });
    }
    //模拟登录（跳过登录验证）执行的流程
    else {
      ret = MENU;
    }

    if (ret && ret.success) {
      //获取该用户的账户名
      const account: string = ret.account;

      message.destroy();
      message.success(`${account} 登录成功`);
      const userinfor: any = ret;

      //将用户信息存储在localStorage中
      if (values.autoLogin) {
        //存储登录时用户名
        localStorage.setItem(`GGMIDENDPRO_LOGIN_NAME`, values.username);
        //存储登录时密码(明文)
        localStorage.setItem(`GGMIDENDPRO_LOGIN_PWD`, values.password);
        //存储登录后当前用户信息全量(JSON字符串形式)
        // localStorage.setItem(`${MAIN_TITLE}_CURRENT_USER`, JSON.stringify(userInfor));
        //存储登录时用户下次是否自动填登录信息
        localStorage.setItem(`GGMIDENDPRO_LOGIN_AUTO`, 'Y');
      }

      GGMIDENDPRO.GlobalData.set(userinfor, Date.now() + ST_TIMEOUT * 1000);

      //将用户名存入本地存储
      localStorage.setItem(`account`, userinfor.account);
      //将医院id存入本地存储
      localStorage.setItem(`hospitalId`, userinfor.hospital_id);
      //将医院层级存入本地存储
      localStorage.setItem(`hospitalLevel`, userinfor.hospital_level);

      // 将plat_code信息存入本地存储
      Ajax.Post('BasicUrl', '/manage/code.selectByParId', {},
        (rsp: any) => {
          localStorage.setItem('codeKV', JSON.stringify(_.groupBy(rsp.list, 'parId')));
        }
      );

      // 将plat_channel信息存入本地存储
      Ajax.Post('BasicUrl', '/manage/platChannel.selectAll', 
      {
          hospitalId: userinfor.hospital_id,
      },
        (rsp: any) => {
          localStorage.setItem('channelList', JSON.stringify(rsp.list));
        }
      );

      // 将文件服务器路径存入本地存储
      Ajax.Post('BasicUrl', '/manage/com.getFilePath', null,
        (rsp: any) => {
          localStorage.setItem('filePath', rsp);
        }
      );

      await setInitialState({
        currentUser: userinfor,
        settings: defaultSettings
      });

      //跳转到内页的默认页 welcome
      history.push({
        pathname: LOGIN_SUCCESSOR_PAGE//'/welcome'
      });

    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <LoginForm
          logo={<img alt="logo" src={LOGO} />}
          title={`${MAIN_TITLE}`}
          subTitle={`${VERSION}`}
          initialValues={{
            autoLogin:
              (localStorage.getItem(`GGMIDENDPRO_LOGIN_AUTO`)) === 'N'
                ? false
                : true,
            username: (localStorage.getItem(`GGMIDENDPRO_LOGIN_NAME`))
              ? localStorage.getItem(`GGMIDENDPRO_LOGIN_NAME`)
              : '',
            password: (localStorage.getItem(`GGMIDENDPRO_LOGIN_PWD`))
              ? localStorage.getItem(`GGMIDENDPRO_LOGIN_PWD`)
              : '',
          }}
          onFinish={(values) => {
            return submitHandle(values);
          }}
        >
          <Tabs activeKey={type} onChange={setType}>
            <Tabs.TabPane key="account" tab={'用户登录'} />
          </Tabs>

          {type === 'account' && (
            <>
              <ProFormText
                name="username"
                fieldProps={{
                  size: 'large',
                  prefix: <UserOutlined className={styles.prefixIcon} />,
                }}
                placeholder={'用户名'}
                rules={[
                  {
                    required: true,
                    message: '请输入用户名!',
                  },
                ]}
              />
              <ProFormText.Password
                name="password"
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined className={styles.prefixIcon} />,
                }}
                placeholder={'密码'}
                rules={[
                  {
                    required: true,
                    message: '请输入密码!',
                  },
                ]}
              />
            </>
          )}
          <div style={{ marginBottom: 24 }}>
            <ProFormCheckbox noStyle name="autoLogin">
              {`自动登录`}
            </ProFormCheckbox>
          </div>
        </LoginForm>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
