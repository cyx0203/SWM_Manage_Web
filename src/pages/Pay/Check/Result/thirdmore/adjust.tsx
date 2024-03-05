import { Button, Col, message, Row } from "antd";
import { Ajax } from "@/core/trade";
import {useEffect, useRef } from "react";
import moment from "moment";
import SmartForm from "@/components/SmartForm";

export default (props) => {
    const {
        record,
        onSuccess,
    } = props;

    const formItemLayout = {
        labelCol: {
            xs: { span: 24 },
            sm: { span: 7 },
        },
        wrapperCol: {
            xs: { span: 24 },
            sm: { span: 14 },
        }
    }
    const formRef = useRef(null);

    const refForm = (e) => {
        formRef.current = e;
    }

    useEffect(() => {
        formRef.current.getForm().setFieldsValue({ ...record });
      }, []);
      
    const getFields = () => {
        return [
            {
                type: 'textarea',
                field: 'adjustReason',
                label: '调账原因',
                required: true,
                placeholder: '请输入调账原因...',
                rows : 4
            }
        ]
    }

    const handleSubmit = () => {
        formRef.current.getForm().validateFields()
            .then(values => {
                if(record.errorType == '0'){
                    Ajax.Post('PayUrl', '/manage/chkErrorRecord.updateAdjust',
                        {
                            merchantId: record.merchantId,
                            checkId: record.checkId,
                            accountDate: record.accountDateFormat.replaceAll('-', ''),
                            adjustFlag: '1',
                            adjustReason: values.adjustReason,
                            adjustTime: moment().format("YYYY-MM-DD HH:mm:ss"),
                        },
                        (ret: any) => {
                            if (ret.success) {
                                message.success('编辑成功');
                            } else {
                                message.error('编辑失败');
                            }
                            onSuccess();
                        })
                }else{
                    //调账
                    Ajax.Post('PayUrl', '/manage/checkResult.adjust',
                        {
                            merchantId: record.merchantId,
                            checkId: record.checkId,
                            accountDate: record.accountDateFormat.replaceAll('-', ''),
                            adjustFlag: '1',
                            adjustReason: values.adjustReason,
                            adjustTime: moment().format("YYYY-MM-DD HH:mm:ss"),
                            operId: localStorage.account,
                            orderTrace: record.checkId, //orderTrace
                            orderId: record.checkId, //orderTrace
                            opType: '2',
                            opTime: moment().format("YYYY-MM-DD HH:mm:ss")
                        },
                        (ret: any) => {
                            if (ret.success) {
                                message.success('调账成功');
                            } else {
                                message.error('调账失败');
                            }
                            onSuccess();
                        }
                    )
                }
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
                <Col span={2} offset={17}>
                    <Button type="primary" htmlType="submit">提交</Button>
                </Col>
            </Row>
        </SmartForm>
    )

}