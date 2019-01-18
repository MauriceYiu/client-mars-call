import instance from "./index";

//首页获取员工列表以及店铺信息相关接口


export const getIndexData = (storeId) => {
    return instance({
        url: "get-marsIndex",
        method: "GET",
        params: {
            storeId
        }
    }).then(res => {
        if (res) {
            try {
                if (res.status === 200) {
                    return Promise.resolve(res);
                }
            } catch (error) {
                return Promise.reject(error);
            }
        }
    });
}


// 网吧点评接口

export const ratingStore = (netService, healthConditions, airQuality, comfort, equipment, netFluency, message, storeId, tableNo, storeName) => {
    return instance({
        url: "appraise",
        method: "POST",
        data: {
            netService,
            healthConditions,
            airQuality,
            comfort,
            equipment,
            netFluency,
            message,
            storeId,
            tableNo,
            storeName
        }
    }).then(res => {
        if (res) {
            try {
                if (res.status === 200) {
                    return Promise.resolve(res);
                }
            } catch (error) {
                return Promise.reject(error);
            }
        }
    });
}

// 评价服务员接口

export const ratingEmp = (empId, empName, score, storeId, tableNo,message) => {
    return instance({
        url: "appraise-emp",
        method: "POST",
        data: {
            empId,
            empName,
            appraise: score,
            storeId,
            tableNo,
            message
        }
    }).then(res => {
        if (res) {
            try {
                if (res.status === 200) {
                    return Promise.resolve(res);
                }
            } catch (error) {
                return Promise.reject(error);
            }
        }
    });
}
// 
const afterCallEmp = (empId, empName, storeId, tableNo) => {
    return instance({
        url: "call-service",
        method: "POST",
        data: {
            empId,
            empName,
            storeId,
            table: tableNo
        }
    }).then(res => {
        if (res) {
            try {
                if (res.status === 200) {
                    return Promise.resolve(res);
                }
            } catch (error) {
                return Promise.reject(error);
            }
        }
    });
}
// 呼叫服务员接口,先调用callEmp,然后再调用afterCallEmp
export const callEmp = (empId, empName, storeId, tableNo) => {
    return instance({
        url: "judge-call",
        method: "GET",
        params: {
            empId,
            storeId,
            tableNo
        }
    }).then(async res => {
        if (res) {
            try {
                if (res.status === 200) {
                    if(res.data.code === 200){
                        let res = await afterCallEmp(empId, empName, storeId, tableNo);
                        return Promise.resolve(res);
                    }else{
                        console.log(res);
                        return Promise.resolve(res);
                    }
                }
            } catch (error) {
                return Promise.reject(error);
            }
        }
    });
}

// 完成呼叫服务员接口

export const callEmpFinish = (empId) => {
    return instance({
        url: "call-finish",
        method: "GET",
        params: {
            id: empId
        }
    }).then(res => {
        if (res) {
            try {
                if (res.status === 200) {
                    return Promise.resolve(res);
                }
            } catch (error) {
                return Promise.reject(error);
            }
        }
    });
}


// 获取打赏记录接口

export const getRewardList = (storeId) => {
    return instance({
        url: "get-ranking",
        method: "GET",
        params: {
            storeId,
        }
    }).then(res => {
        if (res) {
            try {
                if (res.status === 200) {
                    return Promise.resolve(res);
                }
            } catch (error) {
                return Promise.reject(error);
            }
        }
    });
}



// 获取礼物商品的接口

export const getGifts = () => {
    return instance({
        url: "get-gift",
        method: "GET",
        params: {}
    }).then(res => {
        if (res) {
            try {
                if (res.status === 200) {
                    return Promise.resolve(res);
                }
            } catch (error) {
                return Promise.reject(error);
            }
        }
    });
}


// 打赏初次创建订单接口

export const createOrder = (productId, count, total, tableNo, storeId, empId) => {
    return instance({
        url: "reward-order",
        method: "POST",
        data: {
            productId,
            count,
            total,
            tableNo,
            storeId,
            empId
        }
    }).then(res => {
        if (res) {
            try {
                if (res.status === 200) {
                    return Promise.resolve(res);
                }
            } catch (error) {
                return Promise.reject(error);
            }
        }
    });
}

// 打赏支付

export const pay = (rewardId, type) => {
    return instance({
        url: "scan-code",
        method: "POST",
        data: {
            rewardId,
            type
        }
    }).then(res => {
        if (res) {
            try {
                if (res.status === 200) {
                    return Promise.resolve(res);
                }
            } catch (error) {
                return Promise.reject(error);
            }
        }
    });
}

//取消支付

export const cancelPay = (rewardId) => {
    return instance({
        url: "reward/" + rewardId,
        method: "DELETE"
    }).then(res => {
        if (res) {
            try {
                if (res.status === 200) {
                    return Promise.resolve(res);
                }
            } catch (error) {
                return Promise.reject(error);
            }
        }
    });
}


//支付轮询

export const pollPay = (rewardId) => {
    return instance({
        url: "rotation-reward",
        method: "GET",
        params: {
            id: rewardId
        }
    }).then(res => {
        if (res) {
            try {
                if (res.status === 200) {
                    return Promise.resolve(res);
                }
            } catch (error) {
                return Promise.reject(error);
            }
        }
    });
}

// 调取登录二维码
export const getLoginCode = (storeId, orderId) => {
    return instance({
        url: "wechat-binding",
        method: "GET",
        params: {
            storeId,
            orderId
        }
    }).then(res => {
        if (res) {
            try {
                if (res.status === 200) {
                    return Promise.resolve(res);
                }
            } catch (error) {
                return Promise.reject(error);
            }
        }
    });
}

// 登录轮询

export const pollLogin = (rewardId) => {
    return instance({
        url: "get-memberInfo",
        method: "GET",
        params: {
            id: rewardId
        }
    }).then(res => {
        if (res) {
            try {
                if (res.status === 200) {
                    return Promise.resolve(res);
                }
            } catch (error) {
                return Promise.reject(error);
            }
        }
    });
}

// 已经登录的，绑定该会员再次进行打赏

export const bindMember = (id, memberId) => {
    return instance({
        url: "bind",
        method: "POST",
        data: {
            id,
            memberId
        }
    }).then(res => {
        if (res) {
            try {
                if (res.status === 200) {
                    return Promise.resolve(res);
                }
            } catch (error) {
                return Promise.reject(error);
            }
        }
    });
}