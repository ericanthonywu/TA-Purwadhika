import React, {Component} from 'react'
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
    List,
    ListItem,
    Right,
    Text,
    Thumbnail,
    Title
} from 'native-base'
import {TouchableOpacity} from "react-native";
import {NavigationActions, StackActions} from "react-navigation";

export default class App extends Component {
    constructor() {
        super();
        this.state = {
            isloading: false,
            email: '',
            password: ''
        }
    }

    componentDidMount() {

    }

    render() {
        return (
            <Container>
                <Header hasTabs>
                    <Body>
                        <Title>Index Menu</Title>
                    </Body>
                    <Right/>
                </Header>
                <Content>
                    <List>
                        <ListItem avatar>
                            <Left>
                                <Thumbnail source={{uri: 'https://github.githubassets.com/favicon.ico'}}/>
                            </Left>
                            <Body>
                                <Text>Kumar Pratik</Text>
                                <Text note>Doing what you like will always keep you happy . .</Text>
                            </Body>
                            <Right>
                                <Text note>3:43 pm</Text>
                            </Right>
                        </ListItem>
                    </List>
                </Content>
                <Footer>
                    <FooterTab>
                        <TouchableOpacity>
                            <Button vertical onPress={() =>  this.props.navigation.dispatch(StackActions.reset({
                                index: 0, // <-- currect active route from actions array
                                actions: [
                                    NavigationActions.navigate({routeName: 'IndexPage'}),
                                ],
                            }))}><Icon name="apps"/><Text> Apps </Text></Button>
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <Button vertical active><Icon name="chatboxes"/><Text> Chat </Text></Button>
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <Button vertical onPress={() => this.props.navigation.navigate('timeline')}><Icon
                                name="paper"/><Text> TimeLine </Text></Button>
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <Button vertical onPress={() => this.props.navigation.navigate('profile')}><Icon
                                name="person"/><Text> Profile </Text></Button>
                        </TouchableOpacity>
                    </FooterTab>
                </Footer>
            </Container>

        );
    }
}
