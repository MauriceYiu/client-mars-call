/* eslint-disable */
import React, { Component } from 'react';
import "./index.scss";
import { connect } from "react-redux";
import { getIndexData, ratingStore, ratingEmp, callEmp, callEmpFinish, getGifts } from "./../../actions";
// import StarRating from "./../../components/starRating/starRating";
import RatingStore from "./../../components/ratingStore/ratingStore";
import EmpDetail from "./../../components/empDetail/empDetail";
// import alertMessage from "./../../utils/alertMessage";

class Index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            doShowRatingStore: false,//是否显示评价网吧弹窗
            doShowEmpDetail: false,//是否显示员工详情弹窗
            nowSelEmp: {},//当前选择的员工
            nowSelEmpIndex: -1,//当前选择的员工的索引
            alertMsg: "",//显示的消息
            showAlert: false,//是否显示消息提示弹窗
            storeId: "",//店铺id
            tableNo: -1,//座位号
            showRatingSuc: false//是否显示评论员工成功弹窗
        };
        this.confirmRating = this.confirmRating.bind(this);
        this.uploadEmpReview = this.uploadEmpReview.bind(this);
        this.callEmp = this.callEmp.bind(this);
        this.getGiftsData = this.getGiftsData.bind(this);
        this.doShowAlert = this.doShowAlert.bind(this);
        this.changeNowSelEmp = this.changeNowSelEmp.bind(this);
        this.topWindow = this.topWindow.bind(this);
        this.refreshWindow = this.refreshWindow.bind(this);
    }
    render() {
        console.log(this.props);
        // 员工列表数组
        let emps = [];
        // 当前在线员工数
        // let empCount = 0;
        // 店铺logo
        let logo = "";
        let reward = "";
        // 店铺简介
        // let summary = "";
        // 店铺名字
        let storeName = "";
        if (this.props.indexData) {
            // empCount = this.props.indexData.empCount;
            emps = this.props.indexData.emps;
            reward = this.props.indexData.reward
            // logo = this.props.indexData.logo;
            // summary = this.props.indexData.summary;
            storeName = this.props.indexData.storeName;
        }
        // console.log(emps);
        let { doShowRatingStore, doShowEmpDetail, nowSelEmp, alertMsg, showAlert, showRatingSuc } = this.state;
        return (
            <div className="index">
                <div className="top-cont">
                    <div className="store-name-tit">{storeName}| 全心全意为您服务</div>
                    <div className="store-rating">
                        <div className="store-name">{storeName}</div>
                        <button onClick={() => this.setState({ doShowRatingStore: true })}>网吧点评</button>
                    </div>
                </div>
                <div className="bot-cont">
                    <div className="bot-emp">
                        <div className="emp-list">
                            <ul>
                                {
                                    emps.map((item, index) => {
                                        return (
                                            <li className="item" key={index}>
                                                <div className="item-inner-wrap" onClick={() => this.setState({ nowSelEmp: item, nowSelEmpIndex: index, doShowEmpDetail: true })}>
                                                    <div className="emp-avatar">
                                                        <img src={item.empPhoto ? item.empPhoto : require("./../../static/images/defaultAvatar.png")} alt="" />
                                                    </div>
                                                    <p className="emp-name">{item.empName} | <b>{item.empJob ? item.empJob : ""}</b></p>
                                                    <div className={item.work ? "online" : "online not-online"}>
                                                        <span>{item.work ? "在线" : "离线"}</span>
                                                    </div>
                                                </div>
                                            </li>
                                        );
                                    })
                                }
                            </ul>
                        </div>
                    </div>
                </div>
                {
                    /* 评价网吧弹窗 */
                    doShowRatingStore ? (<RatingStore
                        logo={logo}
                        hide={() => { this.setState({ doShowRatingStore: false }) }}
                        confirm={(grade, textVal) => this.confirmRating(grade, textVal)} />) : ("")
                }
                {
                    // 员工详细信息弹窗
                    doShowEmpDetail ? (
                        <EmpDetail
                            reward={reward}
                            nowSelEmp={nowSelEmp}
                            hide={() => this.setState({ doShowEmpDetail: false })}
                            uploadEmpReview={(grade, message, avatar) => this.uploadEmpReview(grade, message, avatar)}
                            callEmp={() => this.callEmp()}
                            getGifts={() => this.getGiftsData()}
                            giftsData={this.props.giftsData}
                            storeId={this.state.storeId}
                            tableNo={this.state.tableNo}
                            changeNowSelEmp={(type) => this.changeNowSelEmp(type)}
                            doShowAlert={(msg) => this.doShowAlert(msg)}
                            showRatingSuc={showRatingSuc}
                            setHideRatingSuc={() => this.setState({ showRatingSuc: false })}
                        />
                    ) : ("")
                }
                {
                    showAlert ? (
                        <div className="alert-msg">
                            {alertMsg}
                        </div>
                    ) : ("")
                }
                <div className="refresh-top">
                    {
                        emps.length > 8 ? (
                            <span className="iconfont icon-zhiding" onClick={() => this.topWindow()}></span>
                        ) : ("")
                    }
                    <span className="iconfont icon-shuaxin" onClick={() => this.refreshWindow()}></span>
                </div>
            </div>
        );
    }

    // 给网吧评分
    async confirmRating(grade, textVal) {
        console.log(grade);
        let netService, healthConditions, airQuality, comfort, equipment, netFluency;
        let { storeId, tableNo } = this.state;
        let storeName = this.props.indexData.storeName;
        for (let i = 0; i < grade.length; i++) {
            switch (grade[i].englishName) {
                case "netService":
                    netService = grade[i].grade;
                    break;
                case "healthConditions":
                    healthConditions = grade[i].grade;
                    break;
                case "airQuality":
                    airQuality = grade[i].grade;
                    break;
                case "comfort":
                    comfort = grade[i].grade;
                    break;
                case "equipment":
                    equipment = grade[i].grade;
                    break;
                case "netFluency":
                    netFluency = grade[i].grade;
                    break;
                default:
                    break;
            }
        }
        await this.props.ratingStore(netService, healthConditions, airQuality, comfort, equipment, netFluency, textVal, storeId, tableNo, storeName);
        if (this.props.msgData.code === 1) {
            this.doShowAlert(this.props.msgData.msg);
            this.setState({
                doShowRatingStore: false
            });
        }
    }
    refreshWindow() {
        window.location.reload(true);
    }
    topWindow() {
        $(".bot-emp").animate({ scrollTop: 0 }, 500);
    }
    // 给员工打分
    async uploadEmpReview(grade, message, avatar) {
        let { nowSelEmp, storeId, tableNo } = this.state;
        await this.props.ratingEmp(nowSelEmp.empId, nowSelEmp.empName, grade, storeId, tableNo, message);
        // 先判断当前是否有呼叫员工，有呼叫的话nowCallEmpData的id不为-1
        if (this.props.nowCallEmpData.id !== -1) {
            await this.props.callEmpFinish(this.props.nowCallEmpData.id);
        }
        // 如果用户刷新界面，那就获取sessionStorage中的当前所呼叫员工信息，来进行完成呼叫（ps：如果有的话）
        if (sessionStorage.getItem("nowCallEmp")) {
            let nowCallEmp = JSON.parse(sessionStorage.getItem("nowCallEmp"));
            if (nowCallEmp.id !== -1) {
                await this.props.callEmpFinish(nowCallEmp.id);
            }
        }
        if (this.props.msgData.code === 1) {
            this.setState({
                showRatingSuc: true
            })
        }
    }
    // 呼叫员工
    async callEmp() {
        let { nowSelEmp, storeId, tableNo } = this.state;
        await this.props.callEmp(nowSelEmp.empId, nowSelEmp.empName, storeId, tableNo);
        if (this.props.msgData.code === 1) {
            this.doShowAlert(this.props.msgData.msg);
        } else {
            this.doShowAlert(this.props.msgData.msg);
        }
    }
    //获取商品数据
    async getGiftsData() {
        await this.props.getGifts();
    }
    // 显示alert
    doShowAlert(msg) {
        this.setState({
            showAlert: true,
            alertMsg: msg
        });
        setTimeout(() => {
            this.setState({
                showAlert: false,
                alertMsg: ""
            });
        }, 3000);
    }
    // 改变当前所选择的服务员
    changeNowSelEmp(type) {
        let { nowSelEmpIndex } = this.state;
        console.log(nowSelEmpIndex)
        let emps = [];
        if (this.props.indexData) {
            emps = this.props.indexData.emps;
        }
        if (type === "left") {
            if (nowSelEmpIndex <= 0) {
                return;
            } else {
                nowSelEmpIndex--;
                this.setState({
                    nowSelEmp: emps[nowSelEmpIndex],
                    nowSelEmpIndex
                });
            }
        } else {
            if (nowSelEmpIndex >= emps.length - 1) {
                return;
            } else {
                nowSelEmpIndex++;
                this.setState({
                    nowSelEmp: emps[nowSelEmpIndex],
                    nowSelEmpIndex
                });
            }
        }
    }
    componentDidMount() {
        try {
            let searchStr = window.location.search.split('?')[1];
            let searchArr = searchStr.split('&');
            let searchObj = {};
            for (var i = 0; i < searchArr.length; i++) {
                var curParam = searchArr[i].split('=');
                searchObj[curParam[0]] = curParam[1];
            }
            this.setState({
                storeId: searchObj.storeId,
                tableNo: decodeURI(searchObj.tableNo)
            });

            this.props.getIndexData(searchObj.storeId);
        } catch (error) {
            console.log(error);
        }
    }
    componentWillUnmount() {
        this.setState = (state, callback) => {
            return;
        };
    }
}

export default connect(
    state => ({ indexData: state.indexData, msgData: state.msgData, nowCallEmpData: state.nowCallEmpData, giftsData: state.giftsData }),
    { getIndexData, ratingStore, ratingEmp, callEmp, callEmpFinish, getGifts }
)(Index);