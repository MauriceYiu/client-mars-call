/* eslint-disable */
import React, { Component } from 'react';
import "./empDetail.scss";
// import StarRating from "./../starRating/starRating";
import InfiniteScroll from 'react-infinite-scroller';
import alertMessage from "./../../utils/alertMessage";

import { createOrder, getRewardList, pay, pollPay, getLoginCode, pollLogin, bindMember } from "./../../api/indexApi";

import { Radio } from 'antd';

const RadioGroup = Radio.Group;

class EmpDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showReview: false,//是否显示评论窗口
            showEmpDetail: true,//是否显示员工详细窗口
            showReward: false,//是否显示打赏窗口
            showQrcode: false,//是否显示登录窗口
            goodsCount: 1,//所选商品数量
            nowGoodsIndex: 0,//当前所选择的商品的索引
            nowSelGoods: {
                id: 0
            },
            showPay: false,//显示结算窗口
            totalAmount: 0,//总金额
            page: 0,//打赏记录的页面
            size: 10,//分页大小
            rewardList: [],//打赏记录列表
            // totalPage: 0,//总页数
            hasMore: false,//是否还有打赏记录
            rewardId: -1,//创建订单后，返回的打赏id
            showPayCode: false,//是否显示支付码弹窗
            payCodeImg: "",//支付图片链接
            valForRatEmp: "VERY_GOOD",//当前服务员的评价
            nowCountTime: "倒计时：3分00秒",
            nowRatingSucAvatar: "",//当前评论成功的服务员头像
            nowSelPayType: "",
            showPayFinish: false,//当前是否在评论成功的界面
            textVal: ""
        };
        this.uploadReview = this.uploadReview.bind(this);
        this.callEmpAndShowReview = this.callEmpAndShowReview.bind(this);
        this.rewardHim = this.rewardHim.bind(this);
        this.reward = this.reward.bind(this);
        this.changeCount = this.changeCount.bind(this);
        this.getRewardListData = this.getRewardListData.bind(this);
        this.loadFunc = this.loadFunc.bind(this);
        this.goPay = this.goPay.bind(this);
        this.isPaySuc = this.isPaySuc.bind(this);
        this.changeSelEmp = this.changeSelEmp.bind(this);
        this.login = this.login.bind(this);
        this.reCallIsLogin = this.reCallIsLogin.bind(this);
        this.hidePay = this.hidePay.bind(this);
        this.payFinish = this.payFinish.bind(this);
        this.countDown = this.countDown.bind(this);
    }
    render() {
        let avatar = this.props.nowSelEmp.empPhoto ? this.props.nowSelEmp.empPhoto : require("./../../static/images/defaultAvatar.png");
        // 当前所选择的员工
        let { showReview,
            showEmpDetail,
            showPay,
            showReward,
            showQrcode,
            nowGoodsIndex,
            nowSelGoods,
            goodsCount,
            rewardList,
            hasMore,
            payCodeImg,
            showPayCode,
            nowCountTime,
            rewardId,
            nowSelPayType,
            showPayFinish } = this.state;
        let { nowSelEmp, giftsData, showRatingSuc } = this.props;

        // 如评论或打赏显示的话，则员工详细窗口不显示
        showReview || showReward || showPay || showRatingSuc || showPayFinish ? showEmpDetail = false : showEmpDetail = true;
        nowSelGoods.id === 0 ? nowSelGoods = giftsData[0] : ""//默认第一个礼物
        return (
            <div className="emp-detail" onClick={() => this.props.hide()}>
                {
                    showEmpDetail ? (
                        <div className="emp-detail-box" onClick={(e) => e.stopPropagation()}>
                            <div className="head">
                                <div className="avatar">
                                    <img src={avatar} alt="" />
                                </div>
                                <div className="emp-info">
                                    <div className="emp-name">
                                        <span className="name">{nowSelEmp.empName} | <b>{nowSelEmp.empJob ? nowSelEmp.empJob : ""}</b></span>
                                    </div>
                                    {/* <div className="reward">
                                        <span className="reward-count">
                                            已有16人为TA打赏
                                        </span>
                                        <span className="look-reward-detail">查看详情</span>
                                    </div> */}
                                </div>
                            </div>
                            <div className={this.props.reward ? "big-avatar" : "big-avatar center"}>
                                <div className="avatar-img">
                                    <img src={avatar} alt="" />
                                </div>
                                {
                                    this.props.reward ? (
                                        <div className="reward-detail right">
                                            <div className="detail-tit">打赏排行榜</div>
                                            <div className="reward-list" ref={(ref) => this.scrollParentRef = ref}>
                                                <InfiniteScroll
                                                    pageStart={0}
                                                    loadMore={this.loadFunc}
                                                    hasMore={hasMore}
                                                    useWindow={false}
                                                    getScrollParent={() => this.scrollParentRef}
                                                    initialLoad={false}
                                                >
                                                    <ul>
                                                        {
                                                            rewardList.map((item, index) => {
                                                                return (
                                                                    <li key={index}>
                                                                        {
                                                                            item.memberName || item.count ? (
                                                                                <React.Fragment>
                                                                                    <span className="list-index">NO{index + 1}.{item.memberName}</span>
                                                                                    <span className="wechat-name right">{item.amount}元</span>
                                                                                </React.Fragment>
                                                                            ) : (
                                                                                    <React.Fragment>
                                                                                        <span className="list-index"></span>
                                                                                        <span className="wechat-name right"></span>
                                                                                    </React.Fragment>
                                                                                )
                                                                        }
                                                                    </li>
                                                                )
                                                            })
                                                        }
                                                    </ul>
                                                </InfiniteScroll>
                                                {
                                                    // !hasMore || rewardList.length === 0 ? (
                                                    //     <div className="loader">加载完毕</div>
                                                    // ) : (<div className="loader">加载中...</div>)
                                                }
                                            </div>
                                        </div>
                                    ) : ("")
                                }
                            </div>
                            <div className="bottom">
                                <div className="button-box">
                                    <button className="review" onClick={() => this.setState({ showReview: true })}>给TA评论</button>
                                    {
                                        this.props.reward ? (
                                            <button className="reward-money" onClick={() => this.rewardHim()}>给TA打赏</button>
                                        ) : ("")
                                    }
                                    {
                                        nowSelEmp.reward ? (
                                            <button className="call" onClick={() => this.callEmpAndShowReview()}>立即呼叫</button>
                                        ) : ("")
                                    }
                                </div>
                            </div>
                            <span className="close iconfont icon-guanbi" onClick={() => this.props.hide()}></span>

                        </div>
                    ) : ("")
                }
                {
                    showReview ? (
                        <div className="review-him" onClick={(e) => e.stopPropagation()}>
                            <div className="review-box">
                                <div className="review-head">
                                    <span className="left arrow-back" onClick={() => this.setState({ showReview: false })}>返回上级</span>
                                    <span className="head-tit">
                                        <b>对我点评</b> <br />
                                        您的点评是促进我成长~
                                    </span>
                                </div>
                                <div className="left review-info">
                                    <div className="avatar">
                                        <img src={avatar} alt="" />
                                    </div>
                                </div>
                                <div className="right review-button">
                                    <div className="right-tit">请对我的服务进行点评</div>
                                    <div className="rating">
                                        <RadioGroup name="radiogroup" onChange={e => this.setState({ valForRatEmp: e.target.value })} value={this.state.valForRatEmp}>
                                            <Radio value={"VERY_GOOD"}>非常满意</Radio>
                                            <Radio value={"GOOD"}>满意</Radio>
                                            <Radio value={"BAD"}>不满意</Radio>
                                        </RadioGroup>
                                    </div>
                                    <div className="ranting-emp-text">
                                        <textarea name="" id="rating-text"
                                            onChange={(e) => this.setState({
                                                textVal: e.target.value
                                            })}
                                            placeholder="给TA说点悄悄话吧~"></textarea>
                                    </div>
                                    <button onClick={(avatar) => this.uploadReview(avatar)}>立即点评</button>
                                </div>
                            </div>
                        </div>
                    ) : ("")
                }

                {
                    showReward ? (
                        <div className="review-him reward-him" onClick={(e) => e.stopPropagation()}>
                            <div className="review-box">
                                <div className="review-head">
                                    <span className="left arrow-back" onClick={() => this.setState({ showReward: false })}>返回上级</span>
                                    <span className="head-tit">
                                        <b>对我打赏</b> <br />
                                        您的打赏是对我工作的肯定
                                    </span>
                                </div>
                                <div className="review-info left">
                                    <div className="avatar">
                                        <img src={avatar} alt="" />
                                    </div>
                                </div>
                                <div className="review-right right">
                                    <div className="review-reward">
                                        <span className="review-tit left">打赏物品:</span>
                                        <div className="reward-item-out-wrap">
                                            <div className="reward-item-wrap">
                                                <ul>
                                                    {
                                                        giftsData.map((item, index) => {
                                                            return (
                                                                <li className={nowGoodsIndex === index ? "reward-item active" : "reward-item"} key={index}
                                                                    onClick={() => this.setState({ nowGoodsIndex: index, nowSelGoods: item })}>
                                                                    <img src={item.imageURL} alt="" />
                                                                    {/* <span className="goods-name">{item.name}</span> */}
                                                                </li>
                                                            );
                                                        })
                                                    }
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="item-count">
                                        <span className="item-name">打赏数量:</span>
                                        <input type="text" value={goodsCount} disabled="disabled" ref={(goodsCountInp) => this.goodsCountInp = goodsCountInp} />
                                        <div className="change-count">
                                            <span className="add-count" onClick={() => this.changeCount("add")}>{"+"}</span>
                                            <span className="redu-count" onClick={() => this.changeCount("redu")}>{"-"}</span>
                                        </div>
                                    </div>
                                    <div className="now-amount">
                                        <span>合计金额:</span>
                                        <span className="amount"><span>{nowSelGoods.salesPrice ? (nowSelGoods.salesPrice * goodsCount).toFixed(2) : ("0")}</span><i>元</i></span>
                                    </div>
                                    <div className="reward-button">
                                        <button onClick={() => this.reward()}>打赏</button>
                                    </div>
                                </div>
                            </div>
                            {
                                showQrcode ? (
                                    <div className="login-box">
                                        <div className="login-cont">
                                            <div className="login-tit">微信扫码登录</div>
                                            <div className="login-info">很高兴认识你，请扫码关注，让小姐姐/小哥哥记住你...</div>
                                            <div className="count-down">
                                                {nowCountTime}
                                            </div>
                                            <span id="login-qrcode"></span>
                                            <i className="close iconfont icon-guanbi" onClick={() => this.setState({ showQrcode: false })}></i>
                                        </div>
                                    </div>
                                ) : ("")
                            }
                        </div>
                    ) : ("")
                }
                {
                    showPay && !showPayCode ? (
                        <div className="go-pay" onClick={(e) => e.stopPropagation()}>
                            <div className="head">
                                <span className="head-tit">在线支付</span>
                                <span className="left arrow-back" onClick={() => this.setState({ showPay: false, showReward: true })}>返回上级</span>
                            </div>
                            {/* <div className="center">
                                <div className="center-tit">打赏物品</div>
                                <div className="center-goods">
                                    <div className="goods-img">
                                        <img src={nowSelGoods.imageURL} alt="" />
                                        <span className="goods-price">￥{nowSelGoods.salesPrice * goodsCount}</span>
                                    </div>
                                    <div className="goods-name">{nowSelGoods.name}*{goodsCount}</div>
                                </div>
                            </div> */}
                            <div className="center">
                                <div className="order-info-item order-code">订单编号：{rewardId}</div>
                                <div className="order-info-item order-gift">订单物品：{nowSelGoods.name}</div>
                                <div className="order-info-item order-count-amount">
                                    <span className="count left">订单数量：{goodsCount}</span>
                                </div>
                                <span className="amount"> 应付金额：￥<b>{(nowSelGoods.salesPrice * goodsCount).toFixed(2)}</b></span>
                            </div>
                            <div className="bottom">
                                <div className="bottom-tit">请您选择付款方式</div>
                                <div className="sel-pay-type">
                                    <span className="pay-type ali" onClick={() => this.goPay("ali")}>
                                        <div className="icont-wrap">
                                            <i className="iconfont icon-zhifubao"></i>
                                            <span className="pay-name">支付宝</span>
                                        </div>
                                    </span>
                                    <span className="pay-type wechat" onClick={() => this.goPay("wechat")}>
                                        <div className="icont-wrap">
                                            <i className="iconfont icon-weixin"></i>
                                            <span className="pay-name">微信</span>
                                        </div>
                                    </span>
                                </div>
                            </div>
                            <span className="close-pay iconfont icon-guanbi" onClick={() => this.hidePay()}></span>
                            {
                                // showPayCode ? (
                                //     <div className="pay-code">


                                //         <div className="pay-tit">请扫码支付</div>
                                //         <img src={payCodeImg} alt="" />
                                //         {/* <div className="cancel-pay">
                                //             <button onClick={() => this.setState({showPayCode:false})}>关闭</button>
                                //         </div> */}
                                //     </div>
                                // ) : ("")
                            }
                        </div>
                    ) : ("")
                }
                {
                    showPayCode ? (
                        <div className="pay-code" onClick={(e) => e.stopPropagation()}>
                            <div className="head">
                                <span className="head-tit">在线支付</span>
                                <span className="left arrow-back" onClick={() => this.setState({ showPayCode: false })}>返回上级</span>
                            </div>
                            <div className="center">
                                <div className="order-info-item order-code">订单编号：{rewardId}</div>
                                <div className="order-info-item order-gift">订单物品：{nowSelGoods.name}</div>
                                <div className="order-info-item order-count-amount">
                                    <span className="count left">订单数量：{goodsCount}</span>
                                </div>
                                <span className="amount"> 应付金额：￥<b>{(nowSelGoods.salesPrice * goodsCount).toFixed(2)}</b></span>
                            </div>
                            <div className="bottom">
                                <div className="pay-img">
                                    <div className="pay-tit">请您及时付款，倒计时结束后，该订单将失效。</div>
                                    <div className="pay-count-down">{nowSelPayType === "wechat" ? (
                                        <span className="now-pay-type wechat">
                                            <i className="iconfont icon-weixinzhifu"></i>
                                            <span>微信支付</span>
                                        </span>
                                    ) : (
                                            <span className="now-pay-type ali">
                                                <i className="iconfont icon-zhifubao"></i>
                                                <span>支付宝支付</span>
                                            </span>
                                        )}{nowCountTime}</div>
                                    <img src={payCodeImg} alt="" />
                                </div>
                                <div className="close-button">
                                    <button onClick={() => this.payFinish()}>支付完成</button>
                                </div>
                            </div>
                            <span className="close-pay iconfont icon-guanbi" onClick={() => this.hidePay()}></span>
                        </div>
                    ) : ("")
                }
                {/* {
                    showEmpDetail ? (
                        <React.Fragment>
                            <div className="arrow arrow-left" onClick={(e) => this.changeSelEmp(e, "left")}>
                                <i className="iconfont icon-xiazai6"></i>
                            </div>
                            <div className="arrow arrow-right" onClick={(e) => this.changeSelEmp(e, "right")}>
                                <i className="iconfont icon-xiazai6"></i>
                            </div>
                        </React.Fragment>
                    ) : ("")
                } */}

                {
                    // 评分成功,打赏成功
                    showRatingSuc || showPayFinish ? (
                        <div className="rating-suc" onClick={() => this.props.setHideRatingSuc()}>
                            <div className="rating-suc-box">
                                <div className="avatar-img">
                                    <img src={avatar} alt="" />
                                </div>
                                <div className="thank-info">
                                    <div className="thanks">{!showPayFinish ? "谢谢您的点评，我会继续努力的" : "谢谢您的打赏，我会继续努力的"}</div>
                                </div>
                                <button onClick={() => this.props.setHideRatingSuc()}>不客气</button>
                            </div>
                        </div>
                    ) : ("")
                }
            </div>
        );
    }
    // 关闭支付界面
    async hidePay() {
        await this.setState({ showPayCode: false });
        this.props.hide();
    }
    async payFinish() {
        if (!this.state.showPayFinish) {
            this.props.doShowAlert("还未支付成功，请等待。");
            return;
        }
        await this.setState({ showPayCode: false, showPayFinish: true, showPay: false });
    }
    // 重新选择员工
    changeSelEmp(e, type) {
        e.stopPropagation();
        this.props.changeNowSelEmp(type);
        this.setState({
            page: 0,
            size: 10,
            rewardList: [],
            totalPage: 0
        });
        this.getRewardListData(0, 10);
    }
    // 上传评分数据
    async uploadReview(avatar) {
        await this.props.uploadEmpReview(this.state.valForRatEmp, this.state.textVal, avatar);
        // 评论完成后关闭评论等界面
        this.setState({
            showReview: false,
            valForRatEmp: ""
        });
    }
    async rewardHim() {
        //获取商品
        await this.props.getGifts();
        this.setState({ showReward: true });
        console.log(this.props.giftsData);
    }
    // 呼叫服务员
    async callEmpAndShowReview() {
        await this.props.callEmp();
        // 显示评论服务员窗口，点击完成评论完成呼叫
        // this.setState({
        //     showReview: true
        // });
    }
    // 需要登录过后才能下单
    async reward() {

        // 判断是否登陆，如果已登录就执行下面的结算相关代码，如果没有登录则执行登录，成功后在执行结算代码。
        // if (!sessionStorage.getItem("user")) {
        //     this.login();
        //     return;
        // }

        let { storeId, tableNo, nowSelEmp } = this.props;
        let { nowSelGoods, goodsCount } = this.state;
        if (nowSelGoods.id === 0) {
            nowSelGoods = this.props.giftsData[0];
            this.setState({
                nowSelGoods
            });
        }
        console.log(nowSelGoods);
        // 总金额
        let totalAmount = (nowSelGoods.salesPrice * goodsCount).toFixed(2);
        this.setState({
            totalAmount
        });
        //先创建订单
        try {
            let res = await createOrder(nowSelGoods.id, goodsCount, totalAmount, tableNo, storeId, nowSelEmp.empId);
            console.log(res);
            let resData = res.data;
            if (resData.result.code === 200) {
                setTimeout(async () => {
                    if (!sessionStorage.getItem("user")) {
                        this.login(resData.data.id);
                    } else {
                        try {
                            let user = JSON.parse(sessionStorage.getItem("user"));
                            let resForBind = await bindMember(resData.data.id, user);
                            if (resForBind.data.result.code === 200) {
                                this.setState({
                                    showPay: true,
                                    showReward: false,
                                    rewardId: resData.data.id
                                });
                                return;
                            } else if (resForBind.data.result.code === 400) {
                                // 重新登录
                                this.login(resData.data.id);
                            }
                        } catch (error) {
                            console.log(error);
                        }
                    }
                }, 300);
            }
        } catch (error) {
            console.log(error);
        }

    }
    // 打赏记录加载更多
    loadFunc() {
        setTimeout(() => {
            let { page, totalPage, size } = this.state;
            page++;
            if (page <= totalPage) {
                this.getRewardListData(page, size);
                this.setState({
                    hasMore: true,
                    page
                });
                console.log(page);
                if (page === totalPage) {
                    this.setState({
                        hasMore: false
                    });
                }
            } else {
                return;
            }
        }, 100);
    }
    // 改变商品数量
    changeCount(type) {
        if (type === "add") {
            this.goodsCountInp.value++;
        } else {
            console.log(this.goodsCountInp.value)
            if (this.goodsCountInp.value <= 1) {
                return;
            }
            this.goodsCountInp.value--;
        }
        this.setState({
            goodsCount: this.goodsCountInp.value
        });
    }
    // 支付
    async goPay(payType) {
        let { rewardId } = this.state;
        let type;
        this.setState({
            nowSelPayType: payType
        });
        try {
            payType === "ali" ? type = true : type = false;
            let res = await pay(rewardId, type);
            if (res.status === 200) {
                this.setState({
                    showPayCode: true,
                    payCodeImg: res.data.url
                });
                this.countDown();
                let payStatus;//是否支付成功
                this.payTimer = setInterval(async () => {
                    payStatus = await this.isPaySuc(rewardId);
                    console.log(this.state.showPayCode);
                    if (payStatus) {
                        clearInterval(this.payTimer);
                        clearInterval(this.countTimer);
                    }
                }, 1500);
            }
        } catch (error) {
            console.log(error);
        }
    }

    //支付轮询
    async isPaySuc(rewardId) {
        try {
            let res = await pollPay(rewardId);
            if (res.status === 200) {
                console.log(res);
                //201支付中，轮询
                if (res.data.code === 201) {
                    return false;
                } else if (res.data.code === 200) {
                    // this.props.doShowAlert("支付成功");
                    this.setState({
                        showPayCode: false,
                        payCodeImg: "",
                        showPay: false,
                        showPayFinish: true
                    });
                    return true;
                }
            }
        } catch (error) {
            console.log(error);
        }
    }
    //倒计时
    countDown() {
        let maxTime = 60 * 3;//三分钟
        let nowCountTime;
        this.countTimer = setInterval(() => {
            if (maxTime >= 0) {
                let minutes = Math.floor(maxTime / 60);
                let seconds = Math.floor(maxTime % 60);
                seconds = seconds < 10 ? "0" + seconds : seconds;
                nowCountTime = `倒计时：${minutes}分${seconds}秒`;
                this.setState({
                    nowCountTime
                });
                --maxTime;
            } else {
                clearInterval(this.countTimer);
                this.setState({
                    showQrcode: false,
                    nowCountTime: "倒计时：3分00秒"
                });
                if (this.state.showPayCode) {
                    this.hidePay();
                }
            }
        }, 1000);
    }

    // 获取登录二维码
    async login(orderId) {
        try {
            let res = await getLoginCode(this.props.storeId, orderId);
            this.setState({
                showQrcode: true
            });
            this.countDown();
            console.log(res);
            setTimeout(() => {
                $('#login-qrcode').innerHTML = '';
                let qrcode = new QRCode("login-qrcode", {
                    text: res.data,
                    colorDark: "#000000",
                    colorLight: "#ffffff",
                    height: 200,
                    width: 200,
                    correctLevel: QRCode.CorrectLevel.H
                });
            }, 100);
            let loginStatus;
            this.loginTimer = setInterval(async () => {
                loginStatus = await this.reCallIsLogin(orderId);
                if (loginStatus.state === 1) {
                    sessionStorage.setItem("user", JSON.stringify(loginStatus.data));
                    this.setState({
                        showQrcode: false
                    });
                    alertMessage.success("登录成功");
                    clearInterval(this.loginTimer);
                    clearInterval(this.countTimer);
                }
            }, 1000);
        } catch (error) {
            console.log(error);
        }
    }

    // 登录轮询
    async reCallIsLogin(rewardId) {
        try {
            let res = await pollLogin(rewardId);
            return res.data;
        } catch (error) {
            console.log(error);
        }
    }

    // 获取打赏记录
    async getRewardListData(page, size) {
        let { storeId } = this.props;
        try {
            let res = await getRewardList(storeId, page, size);
            let rewardList;
            if (res.status === 200) {
                console.log(res);
                if (res.data.length < 8) {
                    console.log(res.data.length)
                    let len = 8 - res.data.length;
                    rewardList = res.data;
                    for (let i = 0; i < len; i++) {
                        rewardList.push({});
                    }
                } else {
                    rewardList = res.data;
                }
                this.setState({
                    rewardList
                });
                // 只有一页的话
                if (res.data.totalPages === 1) {
                    this.setState({
                        hasMore: false
                    });
                }
            }
        } catch (error) {
            console.log(error);
        }
    }
    componentDidMount() {
        // 先获取打赏记录
        let { page, size } = this.state;
        this.getRewardListData(page, size);
    }
    componentDidUpdate() {
        // 如果当前有支付轮询，那么关闭支付框后，应该停止轮询
        if (!this.state.showPayCode && !this.state.showQrcode) {
            clearInterval(this.payTimer);
            clearInterval(this.countTimer);
        }
        // 如果有登录轮询，关闭支付框后，停止轮询
        if (!this.state.showQrcode) {
            clearInterval(this.loginTimer);
        }
    }
    componentWillUnmount() {
        this.setState = (state, callback) => {
            return;
        };
    }
}

export default EmpDetail;