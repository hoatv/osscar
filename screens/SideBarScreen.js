import React, { Component } from 'react';
import { StackNavigator } from 'react-navigation';
import { StatusBar, StyleSheet, View, AsyncStorage } from 'react-native'
import { Container, Content, Text, Thumbnail, Header, List, ListItem, Icon, Left, Body, Right, Toast, Drawer } from 'native-base';
import { Col, Row, Grid } from "react-native-easy-grid";
import ImageLoad from 'react-native-image-placeholder';
import DetailScreen from '../screens/DetailScreen';

class SideBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showToast: false,
            //tennv: '',
            anhdaidien: 'wrongpath',
            //id: '',
        }
    }

    componentDidMount() {
        this.setUserInfo();
    }

    async removeSesstion() {
        await AsyncStorage.removeItem('valid_email');
        // await AsyncStorage.removeItem('tennv');
        // await AsyncStorage.removeItem('anhdaidien');
        return this.props.navigation.navigate('Login');
    }

    async setUserInfo() {
        // console.log('setUserInfo:');
        let tennv = await AsyncStorage.getItem('tennv');
        let anhdaidien = await AsyncStorage.getItem('anhdaidien');
        let id = await AsyncStorage.getItem('id');
        this.setState({
            tennv: tennv.replace(/['"]+/g, ''),
            anhdaidien: anhdaidien,
            id: id,
        });
    }

    render() {
        // StatusBar.setBarStyle('light-content', true);
        const { navigate } = this.props.navigation;
        return (
            <Container style={styles.topContent}>
                <Grid>
                    {/*---------------- Top ---------------- */}
                    <Row size={1} style={{ backgroundColor: 'rgba(183, 133, 67, 1)' }}>
                        <View style={styles.avatar} >
                            <ImageLoad style={styles.imageRound}
                                placeholderSource={require('../img/default-user-image.png')}
                                source={{ uri: this.state.anhdaidien }}
                            />
                            <Text style={styles.nameStyle}>{this.state.tennv}</Text>
                        </View>
                    </Row>
                    {/*---------------- Navigation ---------------- */}
                    <Row size={3} style={{ backgroundColor: 'white' }}>
                        <Content contentContainerStyle={{ backgroundColor: 'white', paddingTop: 0, marginTop: 0 }}>
                            <List >
                                <ListItem icon onPress={() => this.props.navigation.navigate('Detail', { id: this.state.id })}>
                                    <Left>
                                        <Icon name="ios-contact" style={{ fontSize: 30, color: 'grey' }} />
                                    </Left>
                                    <Body><Text>My Profile</Text></Body>
                                    <Right></Right>
                                </ListItem>
                                {/* <ListItem icon onPress={() =>  this.props.navigation.navigate('Search')}>
                                    <Left>
                                        <Icon name="ios-search" style={{ fontSize: 30, color: 'grey' }} />
                                    </Left>
                                    <Body><Text>Search</Text></Body>
                                    <Right></Right>
                                </ListItem> */}
                                <ListItem icon onPress={() => this.removeSesstion()}>
                                    <Left>
                                        <Icon name="md-key" style={{ fontSize: 30, color: 'grey' }} />
                                    </Left>
                                    <Body><Text>Logout</Text></Body>
                                    <Right></Right>
                                </ListItem>
                            </List>
                        </Content>
                    </Row>
                </Grid>
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    avatar: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    nameStyle: {
        paddingTop: 15,
        fontSize: 25,
        fontWeight: 'bold',
        color: 'white',
    },
    // Handle image round
    imageRound: {
        width: 80,
        height: 80,
        borderRadius: 40,
        overflow: 'hidden',
    }
});
// export const SideBar = StackNavigator({
//     Detail: { screen: DetailScreen },
// });

export default SideBar; 