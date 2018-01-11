import React, { Component } from 'react';
import { StyleSheet, View, StatusBar, ListView, ActivityIndicator, FlatList, Image, Linking, InteractionManager } from 'react-native';
import {
    Container, Header, Item, Input, Icon, Button, Content, List, ListItem, Left, Body, Right,
    Thumbnail, Text, Tab, Tabs, H2
} from 'native-base';
import { Col, Row, Grid } from "react-native-easy-grid";
import DetailScreen from './DetailScreen';
import ImageLoad from 'react-native-image-placeholder';

class MyListItem extends React.PureComponent {

    openCorespondingApp(source, url) {
        if (source === 'wiki') {
            Linking.openURL(url.replace('cola', 'answer')).catch(err => console.error('An error occurred', err));
        } else if (source === 'facebook') {
            url = url.replace('facebook.com/', 'facebook.com/groups/').replace('posts', 'permalink');
            Linking.openURL(url).catch(err => console.error('An error occurred', err));
        } else {
            Linking.openURL(url).catch(err => console.error('An error occurred', err));
        }
    }
    renderImage(source) {
        var imgUrl = '';
        switch (source) {
            case ('facebook'):
                return (
                    <View>
                        <Image style={styles.imageRound}
                            source={require('../img/Topicagroup.jpg')}
                        />
                    </View>
                )
                break
            case ('google'):
                return (
                    <View>
                        <Image style={styles.imageRound}
                            source={require('../img/TopicaGDoc.jpg')}
                        />
                    </View>
                )
                break
            case ('innews'):
                return (
                    <View>
                        <Image style={styles.imageRound}
                            source={require('../img/Innews.jpg')}
                        />
                    </View>
                )
                break
            case ('hrm'):
                return (
                    <View>
                        <Image style={styles.imageRound}
                            source={require('../img/HRM.jpg')}
                        />
                    </View>
                )
                break
            default:
                return (
                    <View>
                        <Image style={styles.imageRound}
                            source={require('../img/Other.jpg')}
                        />
                    </View>
                )
        }
    }

    renderTitle(source, content, title) {
        var result = '';
        switch (source) {
            case ('facebook'):
                if (title === null && content !== null) {
                    result = content;
                }
                break
            case ('google'):
                result = title;
                break
            case ('innews'):
                result = title;
                break
            case ('wiki'):
                result = title;
                break
            default:
                result = title;
        }
        return (
            <View>
                <Text numberOfLines={1} style={styles.titleStyle}>{result}</Text>
            </View>
        )
    }

    renderType(source, title) {
        var result = '';
        switch (source) {
            case ('facebook'):
                result = 'Topica Group';
                break
            case ('google'):
                result = 'Google Drive';
                break
            case ('innews'):
                result = 'Innews';
                break
            case ('wiki'):
                result = 'BENEFITS';
                break
            default:
                result = '';
        }
        if (result !== '') {
            return (
                <View style={{ flexDirection: 'row' }}>
                    <Icon style={{ color: 'grey', fontSize: 15 }} name='ios-brush' />
                    <Text style={styles.typeFontSizeStyle} >{result}</Text>
                </View>
            )
        } else {
            return (null);
        }

    }
    render() {
        const item = this.props.item;

        if (item === undefined) {
            return null;
        }

        return (
            <ListItem avatar key={item.item_id} onPress={() => this.openCorespondingApp(item.source, item.url)}
                style={{
                    flex: 1, borderBottomColor: 'rgb(234, 230, 229)', borderBottomWidth: 1
                    , marginLeft: 0, paddingLeft: 10
                }}
            >
                <Left>
                    {
                        this.renderImage(item.source)
                    }
                </Left>
                <Body style={{ borderBottomColor: 'white' }}>
                    {
                        this.renderTitle(item.source, item.content, item.title)
                    }
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
                            {
                                this.renderType(item.source, item.title)
                            }
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

class AllTab extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = ({
            start: 0,
            end: 10,
            displayNumber: 1,
            actualRowCountHRM: 0,
            actualRowCountOther: 0,
            dataSourceOther: [],
            searchKeyword: '',
            data: []
        });
    }
    static navigationOptions = {
        title: 'All tab'
    };

    // Navigate to Profile
    goToMorePeople() {
        this.props.tabsRef.goToPage(1);
    }

    // render item Flat list
    renderHRMItem = ({ item }) => {
        return (
            <ListItem avatar key={item.id} onPress={() => this.props.navigation.navigate('Detail', { id: item.id })}
                style={{ borderBottomColor: 'white', borderBottomWidth: 1, marginLeft: 0, paddingLeft: 10 }}
            >
                <Left>
                    <ImageLoad style={styles.imageRound}
                        placeholderSource={require('../img/default-user-image.png')}
                        source={{ uri: 'http://osscar.topica.vn' + item.anhdaidien }}
                        key={'http://osscar.topica.vn' + item.anhdaidien}
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
                                    {/* <Text underline={true} style={styles.emailStyle} onPress={() => Communications.email([item.email], null, null, '', '')} >{item.email}</Text> */}
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
    };

    // render item Flat list
    _renderOtherItem = ({ item }) => (
        <MyListItem
            item={item}
            navigation={this.props.navigation}
        />
    );

    async loadMore() {
        this.setState({
            start: this.state.end,
            end: (this.state.end + 3),
            isLoadMore: true,
        })

        await this.props.paging('all', this.state.start, this.state.end);

        const newData = this.props.searchResultPaging;
        this.setState({ data: this.state.data.concat(newData), isLoading: false });
    }

    componentDidMount() {
        if (this.props.isKeywordChanged) {
            this.setState({
                data: this.props.searchResultOther,
                start: 10,
                end: 13,
                isLoadMore: false
            });
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.isKeywordChanged) {
            this.setState({
                data: nextProps.searchResultOther,
                start: this.state.end,
                end: (this.state.end + 3),
                isLoadMore: false
            });
        }
    }

    render() {
        const { params } = this.props.navigation.state;
        const { navigate } = this.props.navigation;
        if ((this.props.searchResultHRM.length === 0 || this.props.searchResultHRM._cachedRowCount <= 0)) {
            return (
                <View>
                    <H2 style={{ alignSelf: 'center', paddingTop: 20 }}>No data found!!!!!</H2>
                </View>
            );
        } else {
            return (

                <View style={{ backgroundColor: 'rgb(234, 230, 229)' }}>

                    <View style={{ backgroundColor: 'white', marginTop: 10, borderBottomColor: 'rgb(234, 230, 229)', borderBottomWidth: 1 }}>
                        <FlatList
                            data={this.props.searchResultHRM._dataBlob.s1.slice(0, this.state.displayNumber)}
                            renderItem={this.renderHRMItem}
                            keyExtractor={(item, index) => item.id}
                        />
                        {
                            (this.props.searchResultHRM._cachedRowCount > 1) ?
                                <Grid style={{
                                    backgroundColor: 'white',
                                    borderTopWidth: 1, borderTopColor: '#DDDDDD', borderBottomColor: 'rgb(234, 230, 229)',
                                    paddingTop: 2, paddingBottom: 2, marginTop: 0, marginBottom: 20
                                }}>
                                    <Row style={{ justifyContent: 'center', height: 18 }}
                                        onPress={() => { this.goToMorePeople() }} >
                                        <Text>See more {this.props.searchResultHRM._cachedRowCount - this.state.displayNumber} people</Text>
                                        <Icon style={{ paddingLeft: 7, fontSize: 20, color: 'grey' }} name='ios-arrow-dropright' />
                                    </Row>
                                </Grid>
                                :
                                null
                        }
                    </View>

                    <FlatList
                        data={this.state.data}
                        renderItem={this._renderOtherItem}
                        keyExtractor={(item, index) => index}
                        style={{ paddingTop: 10, backgroundColor: 'rgb(234, 230, 229)' }}
                        onEndReachedThreshold={0.5}
                        onEndReached={this.loadMore.bind(this)}
                    // onEndReached={this._getMore()}
                    />


                    {/* {
                        this.state.data.length <= 0 ?
                            <View style={{ paddingTop: 10, backgroundColor: 'white' }}>
                                <H2 style={{ alignSelf: 'center', paddingTop: 20 }}>No data found!!!!!</H2>
                            </View>
                            :
                            <FlatList
                                data={this.state.data}
                                renderItem={this._renderOtherItem}
                                keyExtractor={(item, index) => index}
                                style={{ paddingTop: 10, backgroundColor: 'rgb(234, 230, 229)' }}
                                onEndReachedThreshold={0.5}
                                onEndReached={this.loadMore.bind(this)}
                            />
                    } */}


                </View>
            );
        }
    }
}

// Style ----------------------------------------
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
        flexDirection: 'row',
        alignItems: 'center',
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

export default AllTab;