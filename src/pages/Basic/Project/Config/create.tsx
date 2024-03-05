import React, { Component } from 'react';
import { connect } from 'dva';
import { SmartForm } from "antdlib";
import { message, Modal } from "antd";

@connect(({ content, loading }) => ({
  content,
  loading: loading.models.content,
}))
export default class extends Component {

  projectKV = [];

  hospitalKV = [];

  merchantKV = [];

  componentWillMount() {
    this.queryProject();
    this.queryHospital();
  }

  queryProject = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'content/fetch',
      payload: {
        url: 'project.selectAll',
        branchList: '0000',
        listKey: 'merProjList',
        closePagination: true,
      },
      callback: () => {
        const { content: { merProjList } } = this.props;
        if (merProjList && merProjList.list) {
          this.projectKV = [];
          merProjList.list.forEach(item => {
            this.projectKV.push({
              value: item.id,
              text: item.name,
            })
          });
        }
      }
    });
  }

  queryHospital = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'content/fetch',
      payload: {
        url: 'hospital.selectAll',
        branchList: '0000',
        listKey: 'merHospList',
        closePagination: true,
      },
      callback: () => {
        const { content: { merHospList } } = this.props;
        if (merHospList && merHospList.list) {
          this.hospitalKV = [];
          merHospList.list.forEach(item => {
            this.hospitalKV.push({
              value: item.id,
              text: item.name,
            })
          });
        }
      }
    });
  }

  getFields = () => {
    return [{
      type: 'select',
      label: '绑定项目',
      field: 'projId',
      required: true,
      message: '请选择绑定项目',
      placeholder: '请选择绑定项目...',
      options: this.projectKV,
    }, {
      type: 'select',
      label: '绑定医院',
      field: 'hospitalId',
      required: true,
      message: '请选择绑定医院',
      placeholder: '请选择绑定医院...',
      options: this.hospitalKV,
    }]
  }

  // 生成N位随机数
  generateMixed = (n) => {
    const chars = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
    let res = "";
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < n; i++) {
      const id = Math.ceil(Math.random() * 62);
      res += chars[id];
    }
    return res;
  }

  refForm = ref => {
    this.formComp = ref.getForm();
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.formComp.validateFieldsAndScroll((err, data) => {
      if (err) return;
      const { dispatch, onOk } = this.props;
      dispatch({
        type: 'content/fetch',
        payload: {
          url: 'hospCfg.insert',
          ...data,
          md5Key: this.generateMixed(32).substring(0, 32),
        },
        callback: () => {
          message.success('操作成功');
          this.formComp.resetFields();
          onOk();
        }
      });
    });
  };

  render() {
    const { visible, onClose, loading } = this.props;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 18 },
      }
    };
    return (
      <Modal
        visible={visible}
        title='绑定项目和医院'
        onOk={this.handleSubmit}
        onCancel={onClose}
        okText="提交"
        cancelText="取消"
        confirmLoading={loading}
        destroyOnClose
      >
        <SmartForm
          formItemLayout={formItemLayout}
          onRef={this.refForm}
          cols='1'
          formLayout='inline'
          fields={this.getFields()}
        >
          <div />
        </SmartForm>
      </Modal>
    )
  }
}
