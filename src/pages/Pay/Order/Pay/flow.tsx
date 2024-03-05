import { Ajax } from "@/core/trade";
import { Steps } from "antd";
import { forEach } from 'lodash';
import { useEffect, useState, Fragment } from 'react';

export default (props) => {

    const { paylist } = props;  // payOrderPay记录

    const [payInfo, setPayInfo] = useState(null);      // 已支付信息
    const [refundList, setRefundList] = useState([]);  // 退款信息

    // 初始化数据
    const initData = () => {
        let payinfo = null;
        const refundlist = [];
        const refundOrderId = [];
        forEach(paylist, (item) => {
            if (item.transType == 1) {
                payinfo = {
                    createTime: item.createTimeFormat,
                    finishTime: item.thirdTimeFormat,
                    fee: item.orderAmt,
                    status: item.status,
                    orderId: item.orderId,
                    thirdOrderId: item.thirdSeqNo,
                    medfeeSumamt : 0,
                    acctPay : 0,
                    fundPaySumamt : 0
                }
            }
            else {
                refundlist.push({
                    createTime: item.createTimeFormat,
                    finishTime: item.thirdTimeFormat,
                    fee: item.orderAmt,
                    type: item.transType.toString(),
                    status: item.status.toString(),
                    orderId: item.orderId,
                    thirdOrderId: item.thirdSeqNo,
                    refundOperid: item.operId,
                    refundReason: item.refundReason,
                    medfeeSumamt : 0,
                    acctPay : 0,
                    fundPaySumamt : 0
                })
                refundOrderId.push(item.orderId)
            }
        })

        //查询创建订单的医保支付信息
        Ajax.Post('PayUrl', '/manage/payMedicalFee.selectById',
            {
                orderId: payinfo.orderId,
            },
            (ret: any) => {
                if (ret.list.length > 0) {
                    payinfo["medfeeSumamt"] = ret.list[0].medfeeSumamt;
                    payinfo["acctPay"] = ret.list[0].acctPay;
                    payinfo["fundPaySumamt"] = ret.list[0].fundPaySumamt;
                }

                //有退款，就去查医保支付信息
                if (refundOrderId.length > 0) {
                    Ajax.Post('PayUrl', '/manage/payMedicalFee.selectBatchById',
                        {
                            refundOrderId: refundOrderId,
                        },
                        (ret: any) => {
                            //有医保支付信息就用ret.list，是自费就还是refundlist
                            if(ret.list.length > 0){
                                setPayInfo(payinfo);
                                setRefundList(ret.list);
                            }else{
                                setPayInfo(payinfo);
                                setRefundList(refundlist);
                            }
                        })
                } else {
                    //没有退款
                    setPayInfo(payinfo);
                    setRefundList(refundlist);
                }
            }
        );
    }

    useEffect(() => {
        initData();
    }, []);

    const createPayDescription = () => {
        return (
            <Fragment>
                支付订单号：{payInfo.orderId}<br />
                {/* 支付总额：{`${((payInfo.fee + payInfo.medfeeSumamt) / 100).toFixed(2)}元 = 
                 自费 ${(payInfo.fee / 100).toFixed(2)} + 医保个账 ${(payInfo.acctPay / 100).toFixed(2)} + 医保统筹  ${(payInfo.fundPaySumamt / 100).toFixed(2)}`}<br /> */}
                
                支付总额：{`${((payInfo.fee + payInfo.medfeeSumamt) / 100).toFixed(2)}元 = `}
                {payInfo.fee > 0 ? '自费 '+(payInfo.fee / 100).toFixed(2) + ((payInfo.acctPay > 0 || payInfo.fundPaySumamt > 0) ? '+' : '') : ''}
                {payInfo.acctPay > 0 ? '医保个账 '+(payInfo.acctPay / 100).toFixed(2) + (payInfo.fundPaySumamt > 0 ? '+' : '') : ''}
                {payInfo.fundPaySumamt > 0 ? '医保统筹 '+(payInfo.fundPaySumamt / 100).toFixed(2) : ''}<br />
            </Fragment>
        )
    }

    const createRefundDescription = (eachRefundInfo) => {
        return (
            <Fragment>
                退款订单号：{eachRefundInfo.orderId}<br />
                {/* 支付总额：{`${((eachRefundInfo.fee + eachRefundInfo.medfeeSumamt) / 100).toFixed(2)}元 = 
                 自费 ${(eachRefundInfo.fee / 100).toFixed(2)} + 医保个账 ${(eachRefundInfo.acctPay / 100).toFixed(2)} + 医保统筹  ${(eachRefundInfo.fundPaySumamt / 100).toFixed(2)}`}<br /> */}
                
                退款总额：{`${((eachRefundInfo.fee + eachRefundInfo.acctPay + eachRefundInfo.fundPaySumamt) / 100).toFixed(2)}元 = `}
                {eachRefundInfo.fee > 0 ? '自费 '+(eachRefundInfo.fee / 100).toFixed(2) + ((eachRefundInfo.acctPay > 0 || eachRefundInfo.fundPaySumamt > 0) ? '+' : '') : ''}
                {eachRefundInfo.acctPay > 0 ? '医保个账 '+(eachRefundInfo.acctPay / 100).toFixed(2) + (eachRefundInfo.fundPaySumamt > 0 ? '+' : '') : ''}
                {eachRefundInfo.fundPaySumamt > 0 ? '医保统筹 '+(eachRefundInfo.fundPaySumamt / 100).toFixed(2) : ''}<br />

                退款操作员：{eachRefundInfo.refundOperid}<br />
                退款原因：{eachRefundInfo.refundReason}
            </Fragment>
        )
    }

    const { Step } = Steps;

    const refundStep = (eachRefundInfo) => {
        return (
            <Fragment>
                <Step
                    title={eachRefundInfo.type == '-1' ? '创建退款订单' : '创建冲正订单'}
                    status='finish'
                    subTitle={eachRefundInfo.createTime}
                    description={createRefundDescription(eachRefundInfo)}
                />
                <Step
                    title={eachRefundInfo.type == '-1' ? '已退款' : '已冲正'}
                    status={eachRefundInfo.status == '1' ? 'finish' : 'error'}
                    subTitle={eachRefundInfo.status == '1' ? eachRefundInfo.finishTime : null}
                    description={`第三方订单号：${eachRefundInfo.thirdOrderId}`}
                />
            </Fragment>
        )
    }

    return (
        payInfo && (
            <Steps direction='vertical'>
                <Step
                    title="创建支付订单"
                    status='finish'
                    subTitle={payInfo.createTime}
                    description={createPayDescription()}
                />
                {payInfo.status == '9' ?
                    <Fragment>
                        <Step
                            title="已支付"
                            status='error'
                        />
                        <Step
                            title="已关闭"
                            status='finish'
                            subTitle={payInfo.finishTime}
                            description={`第三方订单号：${payInfo.thirdOrderId}`}
                        />
                    </Fragment> :
                    <Step
                        title='已支付'
                        status={payInfo.status == '1' ? 'finish' : 'error'}
                        subTitle={payInfo.status == '1' ? payInfo.finishTime : null}
                        description={payInfo.status == '1' ? `第三方订单号：${payInfo.thirdOrderId}` : ''}
                    />}
                {refundList.map((item) => refundStep(item))}
            </Steps>)
    );
}