import * as actionTypes from "./../constants";

const initialStateForMsg = {
    code: 1,
    msg: ""
};
export const msgData = (state = initialStateForMsg, action) => {
    switch (action.type) {
        case actionTypes.RECEIVE_ERR:
            return { ...action.data
            };
        case actionTypes.RECEIVE_SUC:
            return { ...action.data
            };
        default:
            return state;
    }
}

const initialStateForIndex = {
    emps: [],
    empCount: 0,
    logo: "",
    summary: ""
};

export const indexData = (state = initialStateForIndex, action) => {
    switch (action.type) {
        case actionTypes.SET_INDEX_DATA:
            if(action.data.emps === null){
                return initialStateForIndex;
            }
            return { ...action.data
            };
        default:
            return state;
    }
}


const initialStateForNowCallEmp = {
    id: -1
};

export const nowCallEmpData = (state = initialStateForNowCallEmp, action) => {
    switch (action.type) {
        case actionTypes.SET_NOW_CALL_EMP_DATA:
            return { ...action.data
            };
        default:
            return state;
    }
}


const initialStateForGiftsData = [];

export const giftsData = (state = initialStateForGiftsData, action) => {
    switch (action.type) {
        case actionTypes.SET_GIFT_DATA:
            return [...action.data];
        default:
            return state;
    }
}