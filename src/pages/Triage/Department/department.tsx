import { DomRoot, Ajax, KeepAlive } from '@/components/PageRoot';
import { useState, useEffect, useRef } from "react";
import SmartTable from "@/components/SmartTable";
import SmartTop from '@/components/SmartTop';
import EditTable from './editTable';
import { Space, message, Modal, Card, Popconfirm } from "antd";
import { CloudUploadOutlined } from '@ant-design/icons';

const Department = () => {

    const userName = localStorage.getItem('GGMIDENDPRO_LOGIN_NAME')
    const [tableDate, setTableData] = useState(null);
    const [record, setRecord] = useState(null);
    const [visible, setVisible] = useState(false);
    const topRef = useRef(null);
    // 查询条件区域 
    const queryArea: any = useRef(null);
    // 预先查询的基础数据-科室
    const [deptList, setDeptList] = useState(null);

         // 查询科室列表
  const queryDepartment = () => {
    Ajax.Post('TriageUrl', '/queryLevel', // api/kv/level.selectByPrimaryKey
      {
        key: "id",
        value: "name"
      },
      (ret: any) => {
        console.log(ret);
        if(ret&&ret.list){
            setDeptList(ret.list.tv);
        }
        else {
          message.error('查询科室列表失败')
        }
      }
    );
  }
    // 查询科室所有信息
    const selectByPrimary= (params = {})=>{
        Ajax.Post('TriageUrl', '/queryLevel', // /api/level.selectByPrimaryKey
          {
            ...params
          }
          , (ret: any) => {
            console.log(ret)
            if(ret){
                setTableData(ret)
                queryDepartment(); // 每次更新数据后选择框数据也更新
            }
            else {
              message.error('获取科室信息失败');
            }
          }
          , (err: any) => {
            //后台异常、网络异常的回调处理
            //该异常处理函数，可传可不传
            console.log('Ajax Post Error');
            console.log(err);
          }
        );
    }

   
    // 按id删除科室信息
    const deleteByPrimary= (row: any)=>{
        Ajax.Post('TriageUrl', '/deleteLevel',
          {
            ...row,
          }
          , (ret: any) => {
            console.log(ret);
            if(ret&&ret.hasOwnProperty('success')&&ret.success) {
                selectByPrimary();
                // queryDepartment();
              }
              else message.error('删除失败')
          }
          , (err: any) => {
            //后台异常、网络异常的回调处理
            //该异常处理函数，可传可不传
            console.log('Ajax Post Error');
            console.log(err);
          }
        );
    }

      // 按照id查询科室数据
  const selectByPrimary_id = (params = {}) => {
    const query = { ...queryArea.current, ...params };
    console.log(query);
    
    Ajax.Post('TriageUrl', '/queryLevel',  // api/level.selectByPrimaryKey
      {
        ...query,
      },
      (ret: any) => {
          console.log(ret);
          if(ret){
            setTableData(ret)
          }
          else {
            message.error('获取科室信息失败');
          }
      }
    );
  }

      const topSubmit = (params = {}) => {
        queryArea.current = params;
        selectByPrimary_id(null);
      }

      const Domain: any = window.GGMIDENDPRO_EXT_CFG.Domain;
      let fileName = '';
      let fileSize = '';
      let fileSeqNo = '';
      const getFile = (e: any) => {
        // console.log("进入到getFile方法")
        // console.log("我的event1=", e)
        // debugger;
        if (Array.isArray(e)) return e;
        // console.log("我的event2=", e)
        if (e.fileList.length > 0 && e.fileList[0].status === 'done') {
          fileName = e.fileList[0].name;
          fileSize = e.fileList[0].size;
          fileSeqNo = e.fileList[0].response.name;
        }
        console.log(e)
        console.log(fileName,fileSize,fileSeqNo);
        return e && e.fileList;
      };

      const getFields = () => {
        return [
            {
            type: 'button',
            buttonList: [
            {
                type: 'primary',
                buttonText: '+ 新建',
                onClick: () => {
                    setVisible(true); setRecord(null)
                }
              }
            ]
          },
          {
          type: 'select',
          style: { width: 250 },
          field: 'id',
          placeholder: '请选择查询科室...',
          showSearch: true,
          options: deptList,
          allowClear: true,
          message: '请选择科室'
        },
        {
            type: 'button',
            buttonList: [
              {
                type: 'primary',
                htmlType: 'submit',
                buttonText: '查询',
                style: { marginLeft: 8 }
              }, 
              {
                buttonText: '重置',
                style: { marginLeft: 8 },
                onClick: () => {
                  selectByPrimary()
                }
              }
            ]
          },
          {
              type:'upload',
              buttonText: '批量上传',
              icon:<CloudUploadOutlined />,
              // label: '医生头像',
              field: 'upload',
              name: 'file',
              maxCount: 1,
              valuePropName: 'fileList',
              getValueFromEvent: getFile,
              action: `${Domain.TriageUrl}/manage/uploadFile`
          }
        ]
      }

      const columns = [
        {
            title: '科室ID',
            dataIndex: 'id',
            key: 'id',
            width:100
          },
          {
            title: '科室名称',
            dataIndex: 'name',
            key: 'name',
            width:250
          }, {
            title: '操作',
            key: 'action',
            align:'center',
            render: (_,row,index) => (
              <Space size="middle">
                <a style={{ marginRight: '8px' }} onClick={() => { setVisible(true); setRecord(row) }}>修改</a>
                <Popconfirm
                  title="确定删除?"
                  onConfirm={()=>deleteByPrimary(row)}
                  okText="是"
                  cancelText="否"
                ><a onClick={()=>{}}>删除</a></Popconfirm>
                
              </Space>
            ),
          }];

  useEffect(() => {
    selectByPrimary();
  }, []);

  return (
    <DomRoot>
      <Card>
        <SmartTop handleSubmit={topSubmit} getFields={getFields} onRef={topRef}><div /></SmartTop>
      </Card>
      <Card>
        <SmartTable
            bordered
            dataSource={tableDate || []}
            columns={columns}
            handleChange={params => selectByPrimary(params)}
        />
      </Card>
      <Modal
        title='编辑科室'
        visible={visible}
        onCancel={() => setVisible(false)}
        width='40%'
        footer={null}
        destroyOnClose
      >
        <EditTable record={record} onSuccess={() => { setVisible(false); selectByPrimary(); }}/>
      </Modal>
    </DomRoot>
  );
};

export default () => (
  <KeepAlive>
    <Department />
  </KeepAlive>
)
