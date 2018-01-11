import React, { Component } from 'react';
import { StyleSheet, View, StatusBar, ListView, ActivityIndicator, FlatList, Image, Linking, InteractionManager } from 'react-native';
import {
    Container, Header, Item, Input, Icon, Button, Content,
    List, ListItem, Left, Body, Right, Thumbnail, Text, Tab, Tabs, H2
} from 'native-base';
import Communications from 'react-native-communications';

class MyListItem extends React.PureComponent {
    openCorespondingApp(url) {
        Linking.openURL(url.replace('cola', 'answer')).catch(err => console.error('An error occurred', err));
    }

    render() {
        const item = this.props.item;

        if (item === undefined) {
            return null;
        }

        return (
            <ListItem avatar key={item.item_id} onPress={() => this.openCorespondingApp(item.url)}
                style={{ borderBottomColor: 'rgb(234, 230, 229)', borderBottomWidth: 1, marginLeft: 0, paddingLeft: 10 }}
            >
                <Left>
                    <Image style={styles.imageRound} source={require('../img/Other.jpg')} />
                </Left>
                <Body style={{ borderBottomColor: 'white' }}>
                    <Text numberOfLines={1} style={styles.titleStyle}>{item.title}</Text>
                    <View style={styles.infoDetail}>
                        <View style={styles.phoneStyle} note>
                            <Icon style={{ color: 'grey', fontSize: 15 }} name='ios-calendar' />
                            <Text style={styles.typeFontSizeStyle} >{item.created_time}</Text>
                        </View>
                        <View style={styles.phoneStyle} note>
                            <Icon style={{ color: 'grey', fontSize: 15 }} name='ios-person-add' />
                            <Text style={styles.typeFontSizeStyle} >{item.author}</Text>
                        </View>
                        <View style={styles.phoneStyle} note>
                            <Icon style={{ color: 'grey', fontSize: 15 }} name='ios-brush' />
                            <Text style={styles.typeFontSizeStyle} >BENEFITS</Text>
                        </View>
                    </View>
                </Body>
                <Right>
                    <Icon style={{ paddingTop: 25, fontSize: 30, color: 'grey' }} name='ios-arrow-forward' />
                </Right>
            </ListItem>
        );
    }

}

class BenefitsTab extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            start: 0,
            end: 10,
            isLoadMore: false,
        };
    }
    static navigationOptions = {
        title: 'Search Screen'
    };

    _renderItem = ({ item }) => (
        <MyListItem
            item={item}
        />
    );

    async loadMore() {
        this.setState({
            start: this.state.end,
            end: (this.state.end + 3),
            isLoadMore: true,
        })
        await this.props.paging('wiki', this.state.start, this.state.end);

        const newData = this.props.searchResultPaging;
        this.setState({ data: this.state.data.concat(newData), isLoading: false });
    }

    componentDidMount() {
        if (this.props.isKeywordChanged) {
            this.setState({
                data: this.props.searchResult,
                start: 10,
                end: 13,
                isLoadMore: false
            });
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.isKeywordChanged) {
            this.setState({
                data: nextProps.searchResult,
                start: this.state.end,
                end: (this.state.end + 3),
                isLoadMore: false
            });
        }
    }

    render() {
        if (this.props.searchResult.length === 0) {
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
        fontSize: 20,
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
    },
    // Other styles
    titleStyle: {
        fontSize: 15,
        fontWeight: 'bold',
        flex: 1,

    },
    typeStyle: {
        paddingBottom: 5,
        paddingLeft: 5,
        flexDirection: 'row'
    },
    typeFontSizeStyle: {
        fontSize: 13,
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

export default BenefitsTab; 