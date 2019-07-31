import React, {Component} from 'react'
import {Dimensions, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View,TouchableHighlight} from 'react-native'
import {Root, Spinner, Toast} from "native-base";
import axios from "axios";

const url = require('../global').url;
export default class App extends Component {
    constructor() {
        super();
        this.state = {
            isLoading: false
        }
    }

    checkusername = () => {
        if (this.state.username == null || typeof this.state.username == "undefined" || this.state.username === "") {
            this.setState({
                errorusername: "Please Fill Username"
            })
        } else {
            axios.post(`${url}checkusername`, {
                username: this.state.username,
            }).then(res => {
                this.setState({
                    errorusername: ""
                })
            }).catch(err => {
                this.setState({
                    errorusername: "Username Tersedia"
                })
            })
        }
    };
    checkemail = () => {
        if (this.state.email == null || typeof this.state.email == "undefined" || this.state.email === "") {
            this.setState({
                erroremail: "Please Fill email"
            })
        } else {
            axios.post(`${url}checkemail`, {
                email: this.state.email,
            }).then(res => {
                this.setState({
                    erroremail: ""
                })
            }).catch(err => {
                this.setState({
                    erroremail: "Email Tersedia"
                })
            })
        }
    };
    handleLogin = () => {
        this.checkemail();
        this.checkusername();
        this.setState({
            errcpassword: this.state.cpassword === "" || typeof this.state.cpassword == "undefined" ? "Please Confirm your Password" : (
                this.state.password !== this.state.cpassword ? "Password doesn't match" : ""
            )
        });
        this.setState({
            errpassword: this.state.password === "" || typeof this.state.password == "undefined" ? "Please Fill Password" : ""
        })
        if (!this.state.erroremail && !this.state.errorusername &&
            !(this.state.cpassword === "" || typeof this.state.cpassword == "undefined") &&
            !(this.state.password === "" || typeof this.state.password == "undefined" )) {
            this.setState({
                isLoading: true
            });
            if (this.state.password !== this.state.cpassword) {
                this.setState({
                    errcpassword: "Password doesn't match"
                });
                this.setState({
                    isLoading: false
                })
            } else {
                axios.post(`${url}register`, {
                    email: this.state.email,
                    password: this.state.password,
                    username: this.state.username
                }).then(res => {
                    // alert(JSON.stringify(res))
                    this.setState({
                        isLoading: false
                    });
                    Toast.show({
                        text: res.data.message,
                        buttonText: "Okay",
                        type: "success",
                        duration: 10000
                    });
                    this.props.navigation.goBack('LoginPage')
                }).catch(err => {
                    this.setState({
                        isLoading: false
                    });
                    Toast.show({
                        text: err.response.data.message,
                        buttonText: "Okay",
                        type: "danger"
                    })

                })
            }
        }
    };

    render() {
        return (
            <Root>
                <ScrollView style={{width: '100%', height: '100%'}}>
                    <View style={{backgroundColor: '#DCDCDC',width:"100%"}}>
                        <TouchableOpacity underlayColor='#DCDCDC' onPress={() => this.props.navigation.navigate('LoginPage')}>
                            <Image style={{width: 30, height: 30,margin:20}} source={require('../img/Arrow-Back-3-icon.png')}/>
                        </TouchableOpacity>
                    </View >
                    <View style={styles.container}>
                            <Image style={{width: 200, height: 200,margin:0}} source={require('../img/logo-7queue.png')}/>
                        <View style={styles.inputContainer}>
                            <Image style={styles.inputIcon}
                                   source={require('../img/person.png')}/>
                            <TextInput style={styles.inputs}
                                       placeholder="Username"
                                       underlineColorAndroid='transparent'
                                       onChangeText={(username) => this.setState({username})}
                                       onBlur={this.checkusername}
                            />
                        </View>
                        <View style={styles.errmsg}>
                            <Text style={{color: "#cb0003"}}>{this.state.errorusername}</Text>
                        </View>
                        <View style={styles.inputContainer}>
                            <Image style={styles.inputIcon}
                                   source={require('../img/icons8-envelope-16.png')}/>
                            <TextInput style={styles.inputs}
                                       placeholder="Email"
                                       keyboardType="email-address"
                                       underlineColorAndroid='transparent'
                                       onChangeText={(email) => this.setState({email})}
                                       onBlur={this.checkemail}
                            />
                        </View>
                        <View style={styles.errmsg}>
                            <Text style={{color: "#cb0003"}}>{this.state.erroremail}</Text>
                        </View>

                        <View style={styles.inputContainer}>
                            <Image style={styles.inputIcon}
                                   source={{uri: 'https://png.icons8.com/key-2/ultraviolet/50/3498db'}}/>
                            <TextInput style={styles.inputs}
                                       placeholder="Password"
                                       secureTextEntry={true}
                                       underlineColorAndroid='transparent'
                                       onChangeText={(password) => this.setState({password})}
                                       onblur={() => this.setState({
                                           errpassword: this.state.password === "" ? "Please Fill Password" : ""
                                       })
                                       }
                            />
                        </View>
                        <View style={styles.errmsg}>
                            <Text style={{color: "#cb0003"}}>{this.state.errpassword}</Text>
                        </View>
                        <View style={styles.inputContainer}>
                            <Image style={styles.inputIcon}
                                   source={{uri: 'https://png.icons8.com/key-2/ultraviolet/50/3498db'}}/>
                            <TextInput style={styles.inputs}
                                       placeholder="Confirm Password"
                                       secureTextEntry={true}
                                       underlineColorAndroid='transparent'
                                       onChangeText={(cpassword) => this.setState({cpassword})}
                                       onblur={() =>
                                           this.setState({
                                               errcpassword: this.state.cpassword === "" ? "Please Confirm your Password" : (
                                                   this.state.password !== this.state.cpassword ? "Password doesn't match" : ""
                                               )
                                           })
                                       }
                            />
                        </View>
                        <View style={styles.errmsg}>
                            <Text style={{color: "#cb0003"}}>{this.state.errcpassword}</Text>
                        </View>

                        <TouchableOpacity style={[styles.buttonContainer, styles.loginButton]}
                                          onPress={this.handleLogin}>
                            {this.state.isLoading ? <Spinner/> : <Text style={styles.loginText}>Register</Text>}
                        </TouchableOpacity>
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
        height: ScreenHeight,
        padding: 0
    },
    errmsg: {
        marginBottom: 3.5,
        marginTop: 3.5,
        padding: 0,
        height: 20,
        width: 250,
        marginLeft: 120
    },
    inputContainer: {
        borderBottomColor: '#F5FCFF',
        backgroundColor: '#FFFFFF',
        borderRadius: 30,
        borderBottomWidth: 1,
        width: 250,
        height: 45,
        flexDirection: 'row',
        alignItems: 'center'
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
