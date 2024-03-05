import { useEffect, useRef, useState } from 'react';
import { DomRoot, Ajax, KeepAlive } from '@/components/PageRoot';
import { Table, Space, Card } from 'antd';
import SmartTop from '@/components/SmartTop';
import moment from 'moment';

const CheckReport = () => {
    const topRef = useRef(null);
    const [datasource, setDatasource] = useState([]); //数据源
    const [hospitals, setHospitals] = useState([]); //所有院区
    const [hospitalData, setHospitalData] = useState({}); //院区对象

    // 查询条件区域 
    const queryArea: any = useRef({ date: [moment().subtract(1, 'days'), moment().subtract(1, 'days')] });

    const selectByPayType = (query) => {
        Ajax.Post('PayUrl', '/manage/chkTransDetail.selectInOut',
            {
                startDate: moment(query.date[0]).format('YYYYMMDD'),
                endDate: moment(query.date[1]).format('YYYYMMDD'),
                ...query,
            },
            (ret: any) => {
                dealWithArray(ret.list,'thirdName'); 
            }
        );
    }

    const selectByGood = (query) => {
        Ajax.Post('PayUrl', '/manage/chkTransDetail.selectInOutByGood',
            {
                startDate: moment(query.date[0]).format('YYYYMMDD'),
                endDate: moment(query.date[1]).format('YYYYMMDD'),
                ...query,
            },
            (ret: any) => {
                dealWithArray(ret.list,'goodName');
            }
        );
    }

    const selectByOperId = (query) => {
        Ajax.Post('PayUrl', '/manage/chkTransDetail.selectInOutByOperId',
            {
                startDate: moment(query.date[0]).format('YYYYMMDD'),
                endDate: moment(query.date[1]).format('YYYYMMDD'),
                ...query,
            },
            (ret: any) => {
                dealWithArray(ret.list,'operId');
            }
        );
    }

    const dealWithArray = (list,keyword)=>{
        let sumArray = []; //需要添加的合计的数组
        let rightInstName = '';
        list.forEach((obj) => {
            let row = 0;
            let hisInSum = 0;
            let thirdInSum = 0;
            let hisOutSum = 0;
            let thirdOutSum = 0;
            let hisActualSum = 0;
            let thirdActualSum = 0;
            if (rightInstName !== obj.instName) {
                list.forEach((obj2) => {
                    if (obj.instName === obj2.instName) {
                        row += 1;
                        hisInSum += obj2.hisIn;
                        thirdInSum += obj2.thirdIn;
                        hisOutSum += obj2.hisOut;
                        thirdOutSum += obj2.thirdOut;
                        hisActualSum += obj2.hisActual;
                        thirdActualSum += obj2.thirdActual;
                    }
                });
                var temp = {
                    instName: obj.instName,
                    // operId: '合计',
                    rowSpan: 0,
                    hisIn: hisInSum,
                    hisOut: hisOutSum,
                    hisActual: hisActualSum,
                    thirdIn: thirdInSum,
                    thirdOut: thirdOutSum,
                    thirdActual: thirdActualSum
                }
                temp[keyword]='合计';
                row += 1; //给合计预留的
                sumArray.push(temp);
                rightInstName = obj.instName;
            }
            obj.rowSpan = row;
        });
        //总的合计对象
        let hisInAll = 0;
        let thirdInAll = 0;
        let hisOutAll = 0;
        let thirdOutAll = 0;
        let hisActualAll = 0;
        let thirdActualAll = 0;
        sumArray.forEach((item => {
            hisInAll += item.hisIn;
            thirdInAll += item.thirdIn;
            hisOutAll += item.hisOut;
            thirdOutAll += item.thirdOut;
            hisActualAll += item.hisActual;
            thirdActualAll += item.thirdActual;
        }));
        var temp = {
            instName: '总合计',
            // operId: '合计',
            rowSpan: 1,
            hisIn: hisInAll,
            hisOut: hisOutAll,
            hisActual: hisActualAll,
            thirdIn: thirdInAll,
            thirdOut: thirdOutAll,
            thirdActual: thirdActualAll
        }
        temp[keyword]='合计';
        sumArray.push(temp);

        //合并并排序
        const newList = list.concat(sumArray);
        newList.sort((arr1, arr2) => {
            if (arr1.instName != arr2.instName) {
                return arr1.instName.localeCompare(arr2.instName);
            }
        })
        setDatasource(newList);
    }

    //查询所有数据
    const queryData = (params = {}) => {
        const query = { ...queryArea.current, ...params };
        if (queryArea.current.mode == '1') {
            selectByPayType(query)
        }else if(queryArea.current.mode == '2'){
            selectByGood(query);
        }else{
            selectByOperId(query);
        }
    }

    //查询按钮的点击事件
    const topSubmit = (params = {}) => {
        queryArea.current = params;
        queryData(null);
    };

    //获取所有院区
    const selectHospitals = () => {
        Ajax.Post('PayUrl', '/manage/merComHospital.selectForTree',
            {
            },
            (ret: any) => {
                const temp = [];
                const hostitalData = {}; //存放此用户对应的医院对象
                ret.list.forEach((item) => {
                    //去除虚拟的总院区
                    if (item.level == '2') {
                        temp.push({ value: item.id, txt: item.name });
                        hostitalData[item.id] = item.name;
                    }
                })
                setHospitals(temp);
                setHospitalData(hostitalData);
                //设置默认值
                // queryArea.current.hospitalId = temp[0].value;
                queryArea.current.mode = '1';
                topRef.current.getForm().setFieldsValue({ 
                    // hospitalId: temp[0].value, 
                    mode: '1' 
                });
                queryData();
            }
        );
    }

    useEffect(() => {
        selectHospitals();
    }, []);


    const getFields =(title,dataIndex)=>{
        return [
            {
                title: '机构名称',
                dataIndex: 'instName',
                key: 'instName',
                render: (value, row) => {
                    return {
                        children: queryArea.current.hospitalId ? hospitalData[queryArea.current.hospitalId] + '-' + value : '全部-'+value,
                        props: {
                            rowSpan: row.rowSpan
                        },
                    };
                },
            },
            {
                title: title,
                dataIndex: dataIndex,
                key: dataIndex,
                render: value => {
                    return value == '合计' ? <div style={{ fontWeight: 'bold' }}>{value}</div> : (value ? <div>{value}</div> : <div>未知</div>)
                }
            },
            {
                title: '三方收支情况',
                dataIndex: 'thirdInOut',
                key: 'thirdInOut',
                children: [
                    {
                        title: '三方统计入账',
                        dataIndex: 'thirdIn',
                        key: 'thirdIn',
                        render: value => `${(value / 100).toFixed(2)} 元`,
                    },
                    {
                        title: '三方统计出账',
                        dataIndex: 'thirdOut',
                        key: 'thirdOut',
                        render: value => `${(value / 100).toFixed(2)} 元`,
                    },
                    {
                        title: '三方实收',
                        dataIndex: 'thirdActual',
                        key: 'thirdActual',
                        render :(value,record)=>{
                            if(value != record.hisActual){
                                return <div style={{ color: 'red', fontWeight: 'bold' }}> {(value / 100).toFixed(2)} 元</div>
                            }else{
                                return <div style={{ color: '#006699', fontWeight: 'bold' }}> {(value / 100).toFixed(2)} 元</div>
                            }
                        }
                    },
                ]
            },
            {
                title: 'HIS收支情况',
                dataIndex: 'hisInOut',
                key: 'hisInOut',
                children: [
                    {
                        title: 'HIS统计正常收费',
                        dataIndex: 'hisIn',
                        key: 'hisIn',
                        render: value => `${(value / 100).toFixed(2)} 元`,
                    },
                    {
                        title: 'HIS统计正常退费',
                        dataIndex: 'hisOut',
                        key: 'hisOut',
                        render: value => `${(value / 100).toFixed(2)} 元`,
                    },
                    {
                        title: 'HIS记账金额',
                        dataIndex: 'hisActual',
                        key: 'hisActual',
                        render :(value,record)=>{
                            if(value != record.thirdActual){
                                return <div style={{ color: 'red', fontWeight: 'bold' }}> {(value / 100).toFixed(2)} 元</div>
                            }else{
                                return <div style={{ color: '#006699', fontWeight: 'bold' }}> {(value / 100).toFixed(2)} 元</div>
                            }
                        }
                    },
                ]
            },
            {
                title: '差额',
                dataIndex: 'difference',
                key: 'difference',
                render: (value, record) => {
                    let difference = record.thirdActual - record.hisActual;
                    if(difference != 0){
                        return <div style={{ color: 'red', fontWeight: 'bold' }}> {(difference / 100).toFixed(2)} 元</div>
                    }else{
                        return <div style={{ color: '#006699', fontWeight: 'bold' }}> {(difference / 100).toFixed(2)} 元</div>
                    }
                },
            },
        ]
    }

    //目录的列表配置
    const columns = queryArea.current.mode == '1' ? getFields('支付方式名称','thirdName') : queryArea.current.mode == '2' ?
                    getFields('业务渠道名称','goodName') : getFields('操作员编号','operId');

    // 查询条件区域配置
    const getQueryFields = () => {
        return [{
            type: 'range-picker',
            style: { width: 250 },
            field: 'date',
            label: '日期',
            initialValue: [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
        },
        {
            type: 'select',
            label: '院区',
            style: { width: 220 },
            field: 'hospitalId',
            options: hospitals,
            placeholder: '请选择院区...',
            // required: true,
            allowClear: true,
        },
        {
            type: 'select',
            label: '模式',
            style: { width: 220 },
            field: 'mode',
            options: [{ value: '1', txt: '按支付类型分类' }, { value: '2', txt: '按业务渠道分类' }, { value: '3', txt: '按操作员分类' }],
            placeholder: '请选择分类模式...',
            required: true,
            allowClear: true,
        },
        {
            type: 'button',
            buttonList: [{
                type: 'primary',
                htmlType: 'submit',
                buttonText: '查询',
                style: { marginLeft: 8 }
            },
            {
                buttonText: '打印网页',
                type: "danger",
                style: { marginLeft: '8px' },
                onClick: () => { window.print(); return; }
            }
            ]
        }]
    }

    return (
        <DomRoot>
            <Space direction="vertical" style={{
                width: '100%',
            }}>
                <Card>
                    <SmartTop handleSubmit={topSubmit} getFields={getQueryFields} onRef={topRef}><div /></SmartTop>
                </Card>
                <Card>
                    <Table
                        size="small"
                        columns={columns}
                        dataSource={datasource}
                        bordered
                        pagination={false}
                    />
                </Card>
            </Space>
        </DomRoot>
    )
}

export default () => (
    <KeepAlive>
        <CheckReport />
    </KeepAlive>
)
