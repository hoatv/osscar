import React, { Component } from 'react';
import { StyleSheet, View, StatusBar, ListView, ActivityIndicator, FlatList, InteractionManager } from 'react-native';
import {
    Container, Header, Item, Input, Icon, Button, Content, List, ListItem, Left, Body, Right,
    Thumbnail, Text, Tab, Tabs, H2
} from 'native-base';
import { Col, Row, Grid } from "react-native-easy-grid";
import DetailScreen from './DetailScreen';
import Communications from 'react-native-communications';
import ImageLoad from 'react-native-image-placeholder';
import InNewsTab from './InNewsTab';

class MyListItem extends React.PureComponent {

    render() {
        const item = this.props.item;

        if (item === undefined) {
            return null;
        }
        
        return (
            <ListItem avatar key={item.id} onPress={() => this.props.navigation.navigate('Detail', { id: item.id })}
                style={{ borderBottomColor: 'rgb(234, 230, 229)', borderBottomWidth: 1, marginLeft: 0, paddingLeft: 10 }}
            >
                <Left>
                    <ImageLoad style={styles.imageRound}
                        placeholderSource={require('../img/default-user-image.png')}
                        source={{ uri: 'http://osscar.topica.vn' + item.anhdaidien }}
                        key={item.id}
                    />
                </Left>
                <Body style={{ borderBottomColor: 'white' }}>
                    <Text style={styles.nameStyle}>{item.tennv}</Text>
                    <View style={styles.infoDetail}>
                        {
                            item.mobile !== '' ?
                                <View style={styles.phoneStyle} note>
                                    <Icon style={{ color: 'blue', fontSize: 15 }} name='ios-call' />
                                    <Text style={styles.phoneNumberStyle} onPress={() => Communications.phonecall(item.mobile, true)}>{item.mobile}</Text>
                                </View>
                                :
                                null
                        }
                        {
                            item.email !== '' ?
                                <View style={styles.phoneStyle} note>
                                    <Icon style={{ color: 'grey', fontSize: 15 }} name='ios-mail' />
                                    <Text underline={true} style={styles.emailStyle} >{item.email}</Text>
                                </View>
                                :
                                null
                        }
                    </View>
                </Body>
                <Right style={{ borderBottomColor: 'white' }}>
                    <Icon style={{ paddingTop: 15, fontSize: 30, color: 'grey' }} name='ios-arrow-forward' />
                </Right>
            </ListItem>
        );
    }
}

class EmployeeTab extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = ({
            data: [],
            start: 0,
            end: 10,
            isLoadMore: false,
        });
    }
    static navigationOptions = {
        title: 'Employee tab'
    };

    async loadMore() {
        this.setState({
            start: this.state.end,
            end: (this.state.end + 3),
            isLoadMore: true,
        })
        await this.props.paging('hrm', this.state.start, this.state.end);

        const newData = this.props.searchResultPaging;
        this.setState({ data: this.state.data.concat(newData), isLoading: false });
    }
    // render item Flat list
    _renderItem = ({ item }) => (
        <MyListItem
            item={item}
            navigation={this.props.navigation}
        />
    );

    componentDidMount() {
        if (this.props.isKeywordChanged) {
            this.setState({
                data: this.props.searchResultHRM,
                start: 10,
                end: 13,
                isLoadMore: false
            });
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.isKeywordChanged) {
            this.setState({
                data: nextProps.searchResultHRM,
                start: this.state.end,
                end: (this.state.end + 3),
                isLoadMore: false
            });
        }
    }

    render() {
        if (this.props.searchResultHRM.length === 0) {
            return (
                <View>
                    <H2 style={{ alignSelf: 'center', paddingTop: 20 }}>No data found!!!!!</H2>
                </View>
            );
        } else {
            return (
                <FlatList
                    data={this.state.data}
                    renderItem={this._renderItem}
                    keyExtractor={(item, index) => index}
                    style={{ paddingTop: 10, backgroundColor: 'rgb(234, 230, 229)' }}
                    onEndReachedThreshold={0.5}
                    onEndReached={this.loadMore.bind(this)}
                />
            );
        }
    }
}

// Style
const styles = StyleSheet.create({
    nameStyle: {
        fontSize: 15,
        fontWeight: 'bold',
    },
    infoDetail: {
        paddingTop: 5,
    },
    phoneStyle: {
        paddingLeft: 0,
        width: 300,
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start'
    },
    phoneNumberStyle: {
        paddingBottom: 5,
        paddingLeft: 5,
        color: 'blue',
        textDecorationLine: 'underline',
    },
    emailStyle: {
        paddingBottom: 5,
        paddingLeft: 5,
    },
    // Handle image round
    imageRound: {
        width: 70,
        height: 70,
        borderRadius: 35,
        overflow: 'hidden',
    }
});

export default EmployeeTab;