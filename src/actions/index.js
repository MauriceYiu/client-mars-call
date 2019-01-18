import * as actionTypes from "./../constants";

import * as indexApi from "./../api/indexApi";
// 获取成功action
const receiveSuc = (info) => {
    return {
        type: actionTypes.RECEIVE_SUC,
        data: info
    }
}
//失败获取action
const receiveErr = (info) => {
    return {
        type: actionTypes.RECEIVE_ERR,
        data: info
    }
}

const setIndexData = (data) => {
    return {
        type: actionTypes.SET_INDEX_DATA,
        data
    }
}

const setGifts = (data) => {
    return {
        type: actionTypes.SET_GIFT_DATA,
        data
    }
}


const setNowCallEmp = (data) => {
    return {
        type: actionTypes.SET_NOW_CALL_EMP_DATA,
        data
    }
}

// 获取首页index展示的相关数据
export const getIndexData = (storeId) => {
    return async dispatch => {
        try {
            let res = await indexApi.getIndexData(storeId);
            if (res) {
                dispatch(setIndexData(res.data));
            }
        } catch (error) {
            dispatch(receiveErr({
                code: 0,
                msg: "获取失败"
            }));
        }
    }
}

// 评价网吧
export const ratingStore = (netService, healthConditions, airQuality, comfort, equipment, netFluency, message, storeId, tableNo, storeName) => {
    return async dispatch => {
        try {
            let res = await indexApi.ratingStore(netService, healthConditions, airQuality, comfort, equipment, netFluency, message, storeId, tableNo, storeName);
            if (res) {
                dispatch(receiveSuc({
                    code: 1,
                    msg: "评价成功"
                }));
            }
        } catch (error) {
            dispatch(receiveErr({
                code: 0,
                msg: "评价失败，请稍后再试。"
            }));
        }
    }
}


// 评分员工

export const ratingEmp = (empId, empName, score, storeId, tableNo, message) => {
    return async dispatch => {
        try {
            let res = await indexApi.ratingEmp(empId, empName, score, storeId, tableNo, message);
            if (res) {
                dispatch(receiveSuc({
                    code: 1,
                    msg: "点评成功"
                }));
            }
        } catch (error) {
            dispatch(receiveErr({
                code: 0,
                msg: "点评失败，请稍后再试。"
            }));
        }
    }
}


// 呼叫员工

export const callEmp = (empId, empName, storeId, tableNo) => {
    return async dispatch => {
        try {
            let res = await indexApi.callEmp(empId, empName, storeId, tableNo);
            if (res) {
                if (res.data.result) {
                    if (res.data.result.code === 200) {
                        dispatch(receiveSuc({
                            code: 1,
                            msg: res.data.result.msg
                        }));
                        dispatch(setNowCallEmp(res.data.data));
                        // 存入localStorage
                        sessionStorage.setItem("nowCallEmp", JSON.stringify(res.data.data));
                    } else {
                        dispatch(receiveSuc({
                            code: 1,
                            msg: res.data.result.msg
                        }));
                    }
                } else if (res.data.code === 400) {
                    dispatch(receiveSuc({
                        code: 1,
                        msg: res.data.msg
                    }));
                }

            }
        } catch (error) {
            dispatch(receiveErr({
                code: 0,
                msg: error.response.data.message ? error.response.data.message : "呼叫失败"
            }));
        }
    }
}



//员工服务完成后，用户点击评论所调用的完成服务接口

export const callEmpFinish = (empId) => {
    return async dispatch => {
        try {
            let res = await indexApi.callEmpFinish(empId);
            if (res) {
                dispatch(receiveSuc({
                    code: 1,
                    msg: "完成呼叫"
                }));
                // 完成呼叫后，将当前呼叫员工数据进行重置
                dispatch(setNowCallEmp({
                    id: -1
                }));
                sessionStorage.removeItem("nowCallEmp");
            }
        } catch (error) {
            dispatch(receiveErr({
                code: 0,
                msg: error.response.data.message ? error.response.data.message : "完成呼叫失败"
            }));
        }
    }
}


export const getGifts = () => {
    return async dispatch => {
        try {
            let res = await indexApi.getGifts();
            if (res) {
                if (res.data) {
                    dispatch(setGifts(res.data));
                }
            }
        } catch (error) {
            dispatch(receiveErr({
                code: 0,
                msg: error.response.data.message ? error.response.data.message : "获取失败"
            }));
        }
    }
}