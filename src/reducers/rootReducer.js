import {
    combineReducers
} from "redux";
import {
    indexData,
    msgData,
    nowCallEmpData,
    giftsData
} from "./indexData";

export default combineReducers({
    indexData,
    msgData,
    nowCallEmpData,
    giftsData
})