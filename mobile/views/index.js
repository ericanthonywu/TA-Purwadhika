import React, {Component} from 'react'
import {FlatList, TouchableOpacity} from 'react-native'
import {
    Body,
    Button,
    Container,
    Content,
    Footer,
    FooterTab,
    Header,
    Icon,
    Left,
    ListItem,
    Right,
    Text,
    Thumbnail,
    Title,
} from 'native-base'
import {NavigationActions, StackActions} from "react-navigation";

export default class App extends Component {
    constructor() {
        super();
        this.state = {
            isloading: false,
            email: '',
            password: '',
            data: [
                {name: "Movies", header: true},
                {name: "Interstellar", header: false},
                {name: "Dark Knight", header: false},
                {name: "Pop", header: false},
                {name: "Pulp Fiction", header: false},
                {name: "Burning Train", header: false},
                {name: "Music", header: true},
                {name: "Adams", header: false},
                {name: "Nirvana", header: false},
                {name: "Amrit Maan", header: false},
                {name: "Oye Hoye", header: false},
                {name: "Eminem", header: false},
                {name: "Places", header: true},
                {name: "Jordan", header: false},
                {name: "Punjab", header: false},
                {name: "Ludhiana", header: false},
                {name: "Jamshedpur", header: false},
                {name: "India", header: false},
                {name: "People", header: true},
                {name: "Jazzy", header: false},
                {name: "Appie", header: false},
                {name: "Baby", header: false},
                {name: "Sunil", header: false},
                {name: "Arrow", header: false},
                {name: "Things", header: true},
                {name: "table", header: false},
                {name: "chair", header: false},
                {name: "fan", header: false},
                {name: "cup", header: false},
                {name: "cube", header: false}
            ],
            stickyHeaderIndices: []
        }
    }

    componentWillMount() {
        const arr = [];
        this.state.data.map(obj => {
            if (obj.header) {
                arr.push(this.state.data.indexOf(obj));
            }
        });
        arr.push(0);
        this.setState({
            stickyHeaderIndices: arr
        });
    }

    renderItem = ({item}) => {
        return (
            <>
                <ListItem itemDivider>
                    <Left/>
                    <Body style={{marginRight: 40}}>
                        <Text style={{fontWeight: "bold"}}>
                            Profile Picture
                        </Text>
                    </Body>
                    <Right/>
                </ListItem>
                <ListItem avatar>
                    <Left>
                        <Thumbnail source={{uri: 'https://github.githubassets.com/favicon.ico'}}/>
                    </Left>
                    <Body>
                        <Text>Kumar Pratik</Text>
                        <Text note>Doing what you like will always keep you happy . .</Text>
                    </Body>
                </ListItem>
            </>
        );
    };

    render() {
        return (
            <Container>
                <Header hasTabs>
                    <Body>
                        <Title>Contact List</Title>
                    </Body>
                    <Right/>
                </Header>
                <Content>
                    <FlatList
                        data={this.state.data}
                        renderItem={this.renderItem}
                        keyExtractor={item => item.name}
                        stickyHeaderIndices={this.state.stickyHeaderIndices}
                    />
                </Content>
                <Footer>
                    <FooterTab>
                        <TouchableOpacity>
                            <Button vertical active><Icon
                                name="apps"/><Text> Apps </Text></Button>
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <Button vertical onPress={() => this.props.navigation.dispatch(StackActions.reset({
                                index: 0, // <-- currect active route from actions array
                                actions: [
                                    NavigationActions.navigate({routeName: 'ListChatPage'}),
                                ],
                            }))}><Icon name="chatboxes"/><Text> Chat </Text></Button>
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <Button vertical onPress={() => this.props.navigation.navigate('timeline')}><Icon
                                name="paper"/><Text> TimeLine </Text></Button>
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <Button vertical onPress={this.props.navigation.navigate('profile')}><Icon
                                name="person"/><Text> Profile </Text></Button>
                        </TouchableOpacity>
                    </FooterTab>
                </Footer>
            </Container>

        );
    }
}
