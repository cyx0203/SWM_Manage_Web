import { useEffect, useRef, useState } from 'react';
import { DomRoot, Ajax, KeepAlive } from '@/components/PageRoot';
import { Space, Card, Tag, Badge, message } from 'antd';
import SmartTop from '@/components/SmartTop';
import moment from 'moment';
import SmartTable from '@/components/SmartTable';


const CheckDetail = () => {
    const topRef = useRef(null);
    const [datasource, setDatasource] = useState([]); //数据源
    const [merchants, setMerchants] = useState([]); //所有商户
    const [channels, setChannels] = useState([]); //所有渠道
    const [payTypes, setPayTypes] = useState([]); //所有支付方式
    const [hospitals, setHospitals] = useState([]); //所有院区

    // 查询条件区域 
    const queryArea: any = useRef({ date: [moment().subtract(1, 'days'), moment().subtract(1, 'days')] });

    //查询所有数据
    const queryData = (params = {}) => {
        const query = { ...queryArea.current, ...params };
        const days = moment(query.date[1]).diff(moment(query.date[0]), 'days');
        if (days > 31) {
            return message.error("请查询31天内数据");
        }

        Ajax.Post('PayUrl', '/manage/chkTransDetail.selectAll',
            {
                startDate: moment(query.date[0]).format('YYYYMMDD'),
                endDate: moment(query.date[1]).format('YYYYMMDD'),
                ...query,
            },
            (ret: any) => {
                setDatasource(ret);
            }
        );
    }

    //获取所有商户
    const selectMerchants = () => {
        Ajax.Post('PayUrl', '/manage/merMerchant.selectAll',
            {
            },
            (ret: any) => {
                const temp = [];
                ret.list.map((item) => {
                    temp.push({ value: item.id, txt: item.name })
                })
                setMerchants(temp);
            }
        );
    }

    //获取所有渠道
    const selectChannels = () => {
        Ajax.Post('PayUrl', '/manage/merPlatChannel.select',
            {
            },
            (ret: any) => {
                const temp = [];
                ret.list.map((item) => {
                    temp.push({ value: item.id, txt: item.name })
                })
                setChannels(temp);
            }
        );
    }

    // 查询支付方式
    const selectPayTypes = () => {
        Ajax.Post('PayUrl', '/manage/payType.selectAll',
            {
            },
            (ret: any) => {
                const temp = ret.list.map(item => {
                    return {
                        ...item,
                        title: item.name,
                        value: item.id
                    }
                })
                const data = abilitySort(temp, 'thirdId')
                setPayTypes(data);
            }
        );
    }

    //组装成TreeSelect需要的数据格式
    const abilitySort = (arr, property) => {
        let map = {};
        for (let i = 0; i < arr.length; i++) {
            const ai = arr[i];
            if (!map[ai[property]]) map[ai[property]] = [ai];
            else map[ai[property]].push(ai);
        }
        let res = [];
        Object.keys(map).forEach((key) => {
            res.push({ value: key, children: map[key], title: map[key][0].thirdName });
        });
        return res;
    }

    //获取所有院区
    const selectHospitals = () => {
        Ajax.Post('PayUrl', '/manage/merComHospital.selectForTree',
            {
            },
            (ret: any) => {
                const temp = [];
                ret.list.forEach((item) => {
                    //去除虚拟的总院区
                    if (item.level == '2') {
                        temp.push({ value: item.id, txt: item.name })
                    }
                })
                setHospitals(temp);
                //设置默认值
                // queryArea.current.hospitalId = temp[0].value;
                // topRef.current.getForm().setFieldsValue({ hospitalId: temp[0].value });
                queryData(null);
            }
        );
    }

    //查询按钮的点击事件
    const topSubmit = (params = {}) => {
        queryArea.current = params;
        queryData(null)
    };

    useEffect(() => {
        selectMerchants();
        selectChannels();
        selectPayTypes();
        selectHospitals();
    }, []);

    const exportExcel = (params = {}) => {
        const query = { ...queryArea.current, ...params };
        Ajax.Post('PayUrl', '/downloadCheckDetail',
            {
                startDate: moment(query.date[0]).format('YYYYMMDD'),
                endDate: moment(query.date[1]).format('YYYYMMDD'),
                account: localStorage.getItem('account'),
                hospitalId: queryArea.current.hospitalId,
                ...query,
            },
            (ret: any) => {
                window.open(ret.url);
            },
        );
    }

    //目录的列表配置
    const columns = [
        {
            title: '对账时间',
            dataIndex: 'accountDate',
            key: 'accountDate',
            width: 80
        },
        {
            title: '对账单号',
            dataIndex: 'checkId',
            key: 'checkId',
            width: 210
        },
        {
            title: '支付订单号',
            dataIndex: 'orderId',
            key: 'orderId',
            width: 210
        },
        {
            title: '退费订单号',
            dataIndex: 'refundId',
            key: 'refundId',
            width: 210,
            render: (value, row) => (value && value != '') ? value : '-'
        },
        {
            title: '商户',
            dataIndex: 'merchantName',
            key: 'merchantName',
            width: 150
        },
        {
            title: '渠道',
            dataIndex: 'channelName',
            key: 'channelName',
            width: 110
        },
        {
            title: '支付类型',
            dataIndex: 'payTypeName',
            key: 'payTypeName',
            width: 330
        },
        {
            title: '出/入账',
            dataIndex: 'transType',
            key: 'transType',
            width: 60,
            render: (text) => (
                text == '1' ? <Tag color="green">入账</Tag> : <Tag color="red">出账</Tag>
            )
        },
        {
            title: '三方金额(元)',
            dataIndex: 'thirdTransAmt',
            key: 'thirdTransAmt',
            width: 100,
            render: value => `${(value / 100).toFixed(2)}`,
        },
        {
            title: 'His金额(元)',
            dataIndex: 'bizTransAmt',
            key: 'bizTransAmt',
            width: 100,
            render: value => `${(value / 100).toFixed(2)}`,
        },
        {
            title: '三方记账',
            dataIndex: 'accountSource',
            key: 'thirdAccountSource',
            width: 100,
            render: (text) => (
                (text == '0' || text == '1') ? <Badge status="success" text="有" /> : <Badge status="error" text="无" />
            )
        },
        {
            title: 'HIS记账',
            dataIndex: 'accountSource',
            key: 'hisAccountSource',
            width: 100,
            render: (text) => (
                (text == '0' || text == '2') ? <Badge status="success" text="有" /> : <Badge status="error" text="无" />
            )
        },
        {
            title: '对账结果',
            dataIndex: 'errorType',
            key: 'errorType',
            width: 100,
            render: (text) => (
                text == '0' ? '账平' : text == '1' ? '多账' : '金额不一致'
            )
        },
    ];

    // 查询条件区域配置
    const getQueryFields = () => {
        return [{
            type: 'range-picker',
            style: { width: 250 },
            field: 'date',
            label: '日期',
            initialValue: [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
        }, {
            type: 'input',
            label: '订单号',
            style: { width: 250 },
            field: 'orderTrace',
            placeholder: '输入对账单号/支付单号/退费单号...',
        }, {
            type: 'select',
            label: '商户名称',
            style: { width: 180 },
            field: 'merchantId',
            options: merchants,
            placeholder: '请选择商户...',
            allowClear: true,
        }, {
            type: 'select',
            label: '接入渠道',
            style: { width: 180 },
            field: 'channelId',
            options: channels,
            placeholder: '请选择接入渠道...',
            allowClear: true,
        },{
            type: 'select',
            label: '记账记录',
            style: { width: 150 },
            field: 'accountSource',
            options: [{ value: '0', txt: '双方都有记账' },{ value: '1', txt: '仅有三方记账' },{ value: '2', txt: '仅有His记账' }],
            placeholder: '请选择记账记录...',
            allowClear: true,
        },{
            type: 'treeselect',
            label: '支付类型',
            style: { width: 380 },
            field: 'payType',
            treeData : payTypes,
            placeholder: '请选择支付类型...',
            allowClear: true,
          }, {
            type: 'select',
            label: '入账/出账',
            style: { width: 100 },
            field: 'transType',
            options: [{ value: '1', txt: '入账' },{ value: '-1', txt: '出账' }],
            placeholder: '请选择入账/出账...',
            allowClear: true,
        },
        {
            type: 'select',
            label: '对账结果',
            style: { width: 100 },
            field: 'errorType',
            options: [{ value: '0', txt: '账平' },
            { value: '1', txt: '多账' },
            { value: '2', txt: '金额不一致' }],
            placeholder: '请选择对账结果...',
            allowClear: true,
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
            type: 'button',
            buttonList: [{
                type: 'primary',
                htmlType: 'submit',
                buttonText: '查询',
                style: { marginLeft: 8 }
            }, {
                type: 'primary',
                buttonText: '导出',
                style: { marginLeft: 8 },
                onClick: () => {
                    exportExcel()
                }
            }]
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
                    <SmartTable
                        size="small"
                        columns={columns}
                        dataSource={datasource}
                        handleChange={(params: any) => {}}
                        bordered
                        scroll={(datasource && datasource.length != 0 && datasource['list'].length != 0) ? {
                            x: 1900
                        } : {}}
                    />
                </Card>
            </Space>
        </DomRoot>
    )
}

export default () => (
    <KeepAlive>
        <CheckDetail />
    </KeepAlive>
)
