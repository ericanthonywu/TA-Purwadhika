import {combineReducers} from "redux";
import UserGlobal from './userGlobal'
import cartGlobal from "./cartGlobal";

export default combineReducers({
    user : UserGlobal,
    reducerlain: cartGlobal
})