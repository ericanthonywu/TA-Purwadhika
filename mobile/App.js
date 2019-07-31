import React, {Component} from 'react';
import {createAppContainer, createStackNavigator} from 'react-navigation'
import {Animated,Easing} from 'react-native'
import Index from './views'
import Login from './views/login'
import Register from './views/register'
import ListChat from './views/listchat'
import firstapplication from "./views/firstapplication";

const RootStack = createStackNavigator(
    {
        IndexPage: {screen: Index},
        LoginPage: {screen: Login},
        RegisterPage: {screen: Register},
        ListChatPage: {screen: ListChat},
        FirstSetupPage:{screen: firstapplication}
    },
    {
        initialRouteName: 'FirstSetupPage',
        headerMode: 'none',
    },
);
console.disableYellowBox = true;
const AppContainer = createAppContainer(RootStack);
export default class App extends Component {
    render() {
        return (
            <AppContainer/>
        );
    }
}

