import { useEffect, useRef, useState } from "react";
import { Button, Col, message, Row, } from "antd";
import { Ajax } from "@/core/trade";
import SmartForm from "@/components/SmartForm";
import moment from "moment";

export default (props) => {

    const [types, setTypes] = useState([]); //对账类型（3个固定值）
    const [ids, setIds] = useState([]); //拉取id：和对账类型联动
    const [merchants, setMerchants] = useState([]); //所有商户
    const [institutions, setInstitutions] = useState([]); //所有机构

    const {
        onSuccess
    } = props;

    const formItemLayout = {
        labelCol: {
            xs: { span: 24 },
            sm: { span: 5 },
        },
        wrapperCol: {
            xs: { span: 24 },
            sm: { span: 14 },
        }
    }

    const formRef = useRef(null);

    //获取所有商户
    const selectMerchants = () => {
        Ajax.Post('PayUrl', '/manage/merMerchant.selectAll',
            {
            },
            (ret: any) => {
                console.log(ret.list);
                const temp = [];
                ret.list.map((item) => {
                    temp.push({ value: item.id, txt: item.name })
                })
                setMerchants(temp);
            }
        );
    }

    //获取所有机构
    const selectInstitutions = () => {
        Ajax.Post('PayUrl', '/manage/merInstitution.selectAll',
            {
            },
            (ret: any) => {
                console.log(ret.list);
                const temp = [];
                ret.list.map((item) => {
                    temp.push({ value: item.id, txt: item.name })
                })
                setInstitutions(temp);
            }
        );
    }

    useEffect(() => {
        selectMerchants();
        selectInstitutions();
    }, []);

    const getFields = () => {
        return [
            {
                type: 'date-picker',
                field: 'accountDate',
                label: '对账日期',
                required: true,
                message: '请输入对账日期'
            },
            {
                type: 'radio',
                field: 'retrieveBiz',
                label: '业务账单',
                required: true,
                message: '请选择业务账单',
                options: [
                    { value: '0', text: '不上传' },
                    { value: '1', text: '上传' },
                ],
                onChange: (value) => {
                    //每次改变进行清空
                    formRef.current.getForm().setFieldValue('retrieveType', []);
                    formRef.current.getForm().setFieldValue('retrieveId', []);
                    setIds([]);

                    if (value.target.value == '1') {
                        setTypes([{ value: 'all', txt: '重新对账(所有机构)' },
                        { value: 'institutionId', txt: '按机构id重新对账' }])
                    } else {
                        setTypes([{ value: 'all', txt: '重新对账(所有机构)' },
                        { value: 'institutionId', txt: '按机构id重新对账' },
                        { value: 'merchantId', txt: '按商户id重新对账' }])
                    }
                }
            },
            {
                type: 'radio',
                field: 'retrieveThird',
                label: '三方账单',
                required: true,
                message: '请选择三方账单',
                options: [
                    { value: '0', text: '不上传' },
                    { value: '1', text: '上传' },
                ]
            },
            {
                type: 'select',
                field: 'retrieveType',
                required: true,
                message: '请选择对账类型',
                label: '对账类型',
                options: types,
                onChange: (value) => {
                    switch (value) {
                        case 'all': setIds([{ value: 'all', txt: '所有账单' }]); break;
                        case 'institutionId': setIds(institutions); break;
                        case 'merchantId': setIds(merchants); break;
                        default: break;
                    }
                }
            },
            {
                type: 'select',
                field: 'retrieveId',
                label: '拉取id',
                required: true,
                message: '请选择拉取id',
                options: ids
            }
        ]
    }

    const refForm = (e) => {
        formRef.current = e;
    }

    const handleSubmit = () => {
        formRef.current.getForm().validateFields()
            .then(values => {
                //重新对账
                Ajax.Post('PayUrl', '/manage/check.recheck',
                    {
                        ...values,
                        accountDate: moment(values.accountDate).format('YYYYMMDD')
                    },
                    (ret: any) => {
                        message.success('提交成功!请5分钟后重新查看此页面');
                        onSuccess();
                    });

            }).catch(error => {
            });
    }

    return (
        <SmartForm
            formItemLayout={formItemLayout}
            ref={(e) => refForm(e)}
            onSubmit={handleSubmit}
            cols={1}
            formLayout="horizontal"
            fields={getFields()}
        >
            <Row gutter={16}>
                <Col span={2} offset={5}>
                    <Button type="primary" htmlType="submit">提交</Button>
                </Col>
            </Row>
        </SmartForm>
    )

}