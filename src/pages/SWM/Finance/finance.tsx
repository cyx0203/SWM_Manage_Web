import { DomRoot, Ajax, KeepAlive } from '@/components/PageRoot';
import { useState, useEffect, useRef } from "react";
import SmartTable from "@/components/SmartTable";
import SmartTop from '@/components/SmartTop';
import EditTable from './editTable';
import { Space, message, Modal, Card, Popconfirm } from "antd";
import { CloudUploadOutlined } from '@ant-design/icons';

const Finance = () => {

    const userName = localStorage.getItem('GGMIDENDPRO_LOGIN_NAME')
    const [tableData, setTableData] = useState(null);
    const [record, setRecord] = useState(null);
    const [dataIndex,setIndex] = useState(-1);
    const [record_single,setRecordSingle] = useState(null);
    const [visible, setVisible] = useState(false);
    const topRef = useRef(null);
    // 查询条件区域 
    const queryArea: any = useRef(null);
    // 预先查询的基础数据-座席
    const [treeData,setTreeData] = useState([]);
    const [hosList,setHosList] = useState([]);

  // 查询院区号
  const queryHos = () => {
    Ajax.Post('BasicUrl', '/manage/kv/hospital.selectForTree',
      {
        "key": "id",            // key名称
        "value": "name",        // value名称
        "retKey": "list"
      },
      (ret: any) => {
        console.log(ret);
        if(ret&&ret.list){
          const t = ret.list.tv
          for(const i of t) {
            i.txt = `${i.value}(${i.txt})`
          }
          setHosList(ret.list.tv)
        }
        else {
          message.error('查询院区列表失败')
        }
      }
    );
  }

  // 查询院区名
  const queryHos2=(ret)=>{
    Ajax.Post('BasicUrl', '/manage/kv/hospital.selectForTree',
      {
        "key": "id",            // key名称
        "value": "name",        // value名称
        "retKey": "list"
      },
      (ret2: any) => {
        // console.log(ret2);
        // console.log(ret)
        if(ret2&&ret2.list){
          const temp = ret
          for(const i of temp.list) {
            for(const j of ret2.list.lv) {
              if(j.value === i.hospitalId) i.hospitalName = j.label
            }
          }
          setTableData(ret)
        }
        else {
          message.error('查询院区列表失败')
        }
      }
    );
  }

         // 查询座席id列表
  const querySeat = () => {
    Ajax.Post('BasicUrl', '/manage/code.selectByParId_SWM',
      {
        "parId":"JY"
      },
      (ret: any) => {
        console.log(ret);
        if(ret&&ret.list){
              const t = [];
              const children = [];
              for(const key in ret.list){
                // console.log(ret.list.kv[key]);
                children.push({
                  title: ret.list[key].label,
                  value: ret.list[key].value,
                  key: ret.list[key].value,
                })
              }
              t.push({
                title: '全选',
                value: '全选',
                key: '全选',
                children: children,
        })
        setTreeData(t)
        }
        else {
          message.error('查询员工技能失败')
        }
      }
    );
  }
    // 查询座席人员所有信息
    const selectAll= (params = {})=>{
        Ajax.Post('SWMUrl', '/manage/comfinance.queryFinance',
          {
            ...params
          }
          , (ret: any) => {
            console.log(ret)
            if(ret){
                queryHos2(ret)
                // setTableData(ret)
                querySeat(); // 每次更新数据后选择框数据也更新
                queryHos();
            }
            else {
              message.error('获取座席人员信息失败');
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

   
    // 按id删除座席人员信息
    const deleteByPrimary= (row: any)=>{
        Ajax.Post('SWMUrl', '/deleteFinance',
          {
            ...row,
          }
          , (ret: any) => {
            console.log(ret);
            if(ret&&ret.hasOwnProperty('success')&&ret.success) {
                message.success('删除成功')
                selectAll();
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

      // 按照id查询座席人员数据
  const selectByPrimary_id = (params = {}) => {
    const query = { ...queryArea.current, ...params };
    console.log(query);
    
    Ajax.Post('SWMUrl', '/manage/comfinance.queryByPrimaryKey',
      {
        ...query,
      },
      (ret: any) => {
          console.log(ret);
          if(ret){
            setTableData(ret)
          }
          else {
            message.error('获取座席人员信息失败');
          }
      }
    );
  }

      const topSubmit = (params = {}) => {
        queryArea.current = params;
        console.log(queryArea.current)
        if(queryArea.current.key) selectByPrimary_id(null);
        else selectAll();
      }

      const getFields = () => {
        return [
            {
            type: 'button',
            buttonList: [
            {
                type: 'primary',
                buttonText: '+ 新建',
                onClick: () => {
                    setVisible(true); setRecord(null); setRecordSingle(null)
                }
              }
            ]
          },
        {
          style: { width: 250 },
          field: 'key',
          placeholder: '请输入工号/姓名...',
          allowClear: true,
          message: '请输入工号/姓名'
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
                  selectAll()
                }
              }
            ]
          }
        ]
      }

      const columns = [
        {
            title: '人员编号',
            dataIndex: 'id',
            key: 'id',
            width:150
          },
          {
            title: '工号',
            dataIndex: 'jobId',
            key: 'jobId',
            width:150
          },
          {
            title: '所属院区号',
            dataIndex: 'hospitalId',
            key: 'hospitalId',
            width:150
          },
          {
            title: '所属院区名',
            dataIndex: 'hospitalName',
            key: 'hospitalName',
            width:250
          },
          {
            title: '姓名',
            dataIndex: 'name',
            key: 'name',
            width:150
          }, 
          {
            title: '业务名称',
            dataIndex: 'levelName',
            key: 'levelName',
            width:250
          },{
            title: '操作',
            key: 'action',
            align:'center',
            render: (_,row,index) => (
              <Space size="middle">
                <a style={{ marginRight: '8px' }} onClick={() => { setVisible(true); setRecord(row); setRecordSingle(tableData.list[index]) }}>修改</a>
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
    selectAll();
  }, []);

  return (
    <DomRoot>
      <Card>
        <SmartTop handleSubmit={topSubmit} getFields={getFields} onRef={topRef}><div /></SmartTop>
      </Card>
      <Card>
        <SmartTable
            bordered
            dataSource={tableData || []}
            columns={columns}
            handleChange={params => selectAll(params)}
        />
      </Card>
      <Modal
        title='编辑座席人员'
        visible={visible}
        onCancel={() => setVisible(false)}
        width='45%'
        footer={null}
        destroyOnClose
      >
        <EditTable record={record} hosList={hosList} treeData={treeData} dataList={record_single} onSuccess={() => { setVisible(false); selectAll(); }}/>
      </Modal>
    </DomRoot>
  );
};

export default () => (
  <KeepAlive>
    <Finance />
  </KeepAlive>
)
