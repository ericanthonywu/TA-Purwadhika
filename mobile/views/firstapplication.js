import React, {Component} from 'react'
import {
    AsyncStorage,
    Dimensions,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native'
import {Root, Spinner, Toast,Button,H1,Icon} from "native-base";
import axios from 'axios'
import {NavigationActions, StackActions} from "react-navigation";
import ImagePicker from 'react-native-image-picker'
// import ImagePicker from 'react-native-image-crop-picker';
export default class App extends Component {
    constructor() {
        super();
        this.state = {
            isLoading: false,
            erroremail: false,
            filepath: ""
        }
    }

    componentDidMount() {

    }

    handleLogin = () => {
        this.setState({
            isLoading: true
        });
        const url = require('../global').url;
        axios.post(`${url}login`, {
            email: this.state.email,
            password: this.state.password,
        }).then(res => {
            AsyncStorage.setItem('token', res.data._token);
            AsyncStorage.setItem('user', res.data.username);
            AsyncStorage.setItem('userid', res.data._id);
            // alert(JSON.stringify(res))
            this.setState({
                isLoading: false
            });
            // Toast.show({
            //     text: "Success Login",
            //     buttonText: "Okay",
            //     type: "success",
            //     duration:10000
            // })
            this.props.navigation.dispatch(StackActions.reset({
                index: 0, // <-- currect active route from actions array
                actions: [
                    NavigationActions.navigate({routeName: 'IndexPage'}),
                ],
            }))
        }).catch(err => {
            this.setState({
                isLoading: false
            });
            Toast.show({
                text: err.response.data.message,
                buttonText: "Okay",
                type: "danger",
                duration: 10000
            })

        })
    };
    showpicture = () => {
        var options = {
             title: 'Choose Profile Picture',
            noData: true,
             // storageOptions: {
             //     skipBackup: true,
             //     path: 'MyChat',
             // },
         };
        ImagePicker.showImagePicker({
             title: 'Choose Profile Picture',
             storageOptions: {
                skipBackup: true,
                path: 'MyChat',
            }
        }, res => {
            if(!res.error && res.uri){
                this.setState({
                    filepath: res
                })
            }
         })

     };
    // showcroppicture = () => {
    //     ImagePicker.openPicker({
    //         // multiple: true,
    //         cropping: true,
    //         mediaType:'photo',
    //         enableRotationGesture:true,
    //         hideBottomControls:true
    //     }).then(images => {
    //         console.log(images)
    //         this.setState({
    //             filepath:images
    //         })
    //     })
    // }
    render() {
        let ScreenHeight = Dimensions.get("window").height;
        return (
            <Root>
                <ScrollView style={{width: '100%', height: ScreenHeight}}>
                    <View style={styles.container}>
                        <View>
                            <Text><H1>Choose Profile Picture</H1></Text>
                        </View>
                        <View>
                            <TouchableOpacity onPress={this.showpicture.bind(this)}>
                                <Image style={{width: 100, height: 100, margin: 100}}
                                       source={this.state.filepath !== "" ? {uri: this.state.filepath.uri} : require('../img/default-user.png')}
                                />
                            </TouchableOpacity>
                        </View>

                        <Button iconRight bordered primary>
                            <Text>Next</Text>
                            <Icon name='arrow-forward' />
                        </Button>
                    </View>
                </ScrollView>
            </Root>
        )

    }
}
let ScreenHeight = Dimensions.get("window").height;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#DCDCDC',
        height:ScreenHeight
    },
    inputContainer: {
        borderBottomColor: '#F5FCFF',
        backgroundColor: '#FFFFFF',
        borderRadius: 30,
        borderBottomWidth: 1,
        width: 250,
        height: 45,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    inputs: {
        height: 45,
        marginLeft: 16,
        borderBottomColor: '#FFFFFF',
        flex: 1,
    },
    inputIcon: {
        width: 30,
        height: 30,
        marginLeft: 15,
        justifyContent: 'center'
    },
    warningIcon: {
        width: 30,
        height: 30,
        marginRight: 15,
        justifyContent: 'center'
    },
    buttonContainer: {
        height: 45,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        width: 250,
        borderRadius: 30,
    },
    loginButton: {
        backgroundColor: "#00b5ec",
    },
    loginText: {
        color: 'white',
    }
});
