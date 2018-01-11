import React, { Component } from 'react';
import { StyleSheet, StatusBar, ListView, ActivityIndicator, View, SegmentedControlIOS } from 'react-native';
import SideBar from './SideBarScreen';
import {
    Drawer, Container, Header, Item, Input, Icon, Button, Content, List,
    ListItem, Left, Body, Right, Thumbnail, Text, Tab, Tabs, ScrollableTab, Toast, H2
} from 'native-base';
import Communications from 'react-native-communications';
import AllTab from './AllTab';
import InNewsTab from './InNewsTab';
import EmployeeTab from './EmployeeTab';
import FacebookGroupTab from './FacebookGroupTab';
import GoogleTab from './GoogleTab';
import BenefitsTab from './BenefitsTab';
import DetailScreen from './DetailScreen';

class SearchScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentTab: 0, // Active tab
            searchKeyword: '',
            previousKeyword: '',

            // Handle for search with new keyword
            isKeywordChanged: false,
            hrmKeywordChanged: false,
            innewsKeywordChanged: false,
            facebookGroupKeywordChanged: false,
            googleKeywordChanged: false,
            wikiKeywordChanged: false,

            //Loading indicator
            isLoading: false,

            // Data for each tab
            dataSourceHRMAll: [],
            dataSourceHRM: [],
            dataSourceOther: [],
            dataSourceForEachTab: [],
            dataSourceFacebookGroupTab: [],
            dataSourceGoogleTab: [],
            dataSourceBenefitsTab: [],

            // Append data for paging
            dataSourceOtherPaging: [],
            dataSourceForEachTabPaging: [],
            dataSourceHRMPaging: [],
            dataSourceFacebookGroupPaging: [],
            dataSourceGooglePaging: [],

            tabsRef: {},
        };
    }

    static navigationOptions = {
        title: '', header: null,
        headerTintColor: 'white',
        headerStyle: {
            backgroundColor: 'rgba(183, 133, 67, 1)'
        },
    };

    componentDidMount() {
        this.setState({ tabsRef: this.refs.MyTab });
        this.handleSearchKeyword(this.state.currentTab);
    }

    // Paging
    getPaging(type, start, end) {
        switch (type) {
            case 'all':
                return fetch('http://hackathon07.edumall.vn/api/search?keyword=' + this.state.searchKeyword)
                    .then(response => response.json())
                    .then(response => {
                        let ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
                        return this.setState({
                            isKeywordChanged: false,
                            dataSourceOtherPaging: ds.cloneWithRows(response || [])._dataBlob.s1.result.slice(start, end),
                        }, function () { });
                    })
                    .catch(error => {
                        console.error(error);
                    });
                break
            case 'hrm':
                return fetch('http://osscar.topica.vn/ad/admin/search/hrm?num=50&key=' + this.state.searchKeyword)
                    .then(response => response.json())
                    .then(response => {
                        let ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
                        return this.setState({
                            hrmKeywordChanged: false,
                            dataSourceHRMPaging: ds.cloneWithRows(response || [])._dataBlob.s1.slice(start, end),
                        }, function () { });
                    })
                    .catch(error => {
                        console.error(error);
                    });
                break
            case 'innews':
                return fetch('http://hackathon07.edumall.vn/api/search?keyword=' + this.state.searchKeyword + '&source=innews')
                    .then(response => response.json())
                    .then(response => {
                        let ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
                        return this.setState({
                            innewsKeywordChanged: false,
                            dataSourceForEachTabPaging: ds.cloneWithRows(response || [])._dataBlob.s1.result.slice(start, end),
                        }, function () { });
                    })
                    .catch(error => {
                        console.error(error);
                    });
                break
            case 'facebook':
                return fetch('http://hackathon07.edumall.vn/api/search?keyword=' + this.state.searchKeyword + '&source=facebook')
                    .then(response => response.json())
                    .then(response => {
                        let ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
                        return this.setState({
                            facebookGroupKeywordChanged: false,
                            dataSourceFacebookGroupPaging: ds.cloneWithRows(response || [])._dataBlob.s1.result.slice(start, end),
                        }, function () { });
                    })
                    .catch(error => {
                        console.error(error);
                    });
                break
            case 'google':
                return fetch('http://hackathon07.edumall.vn/api/search?keyword=' + this.state.searchKeyword + '&source=google')
                    .then(response => response.json())
                    .then(response => {
                        let ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
                        return this.setState({
                            googleKeywordChanged: false,
                            dataSourceGooglePaging: ds.cloneWithRows(response || [])._dataBlob.s1.result.slice(start, end),
                        }, function () { });
                    })
                    .catch(error => {
                        console.error(error);
                    });
                break
            case 'wiki':
                return fetch('http://hackathon07.edumall.vn/api/search?keyword=' + this.state.searchKeyword + '&source=wiki')
                    .then(response => response.json())
                    .then(response => {
                        let ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
                        return this.setState({
                            wikiKeywordChanged: false,
                            dataSourceWikiPaging: ds.cloneWithRows(response || [])._dataBlob.s1.result.slice(start, end),
                        }, function () { });
                    })
                    .catch(error => {
                        console.error(error);
                    });
                break
            default:
        }

    }

    // get HRM's data for tab HRM
    getDataHRM() {
        return fetch('http://osscar.topica.vn/ad/admin/search/hrm?num=50&key=' + this.state.searchKeyword)
            .then(response => response.json())
            .catch(error => {
                console.error(error);
            });
    }

    // get Other information for tab All
    getDataOther() {
        return fetch('http://hackathon07.edumall.vn/api/search?keyword=' + this.state.searchKeyword)
            .then(response => response.json())
            .catch(error => {
                console.error(error);
            });
    }

    // Get HRM for AllTab
    getDataHRMEmployee() {
        return fetch('http://osscar.topica.vn/ad/admin/search/hrm?num=10&key=' + this.state.searchKeyword)
            .then(response => response.json())
            .then(response => {
                let ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
                return this.setState({
                    dataSourceHRM: ds.cloneWithRows(response || [])._dataBlob.s1.slice(0, 10),
                }, function () {
                    this.setState({ isLoading: false });
                });
            })
            .catch(error => {
                console.error(error);
            });
    }

    // get data by source (HRM,Inews,FB...)
    getDataBySource(source) {
        console.log('http://hackathon07.edumall.vn/api/search?keyword=' + this.state.searchKeyword + '&source=' + source);
        return fetch('http://hackathon07.edumall.vn/api/search?keyword=' + this.state.searchKeyword + '&source=' + source)
            .then(response => response.json())
            .then(response => {
                let ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
                if (source === 'innews') {
                    return this.setState({
                        dataSourceForEachTab: ds.cloneWithRows(response || [])._dataBlob.s1.result.slice(0, 10),
                    }, function () {
                        this.setState({ isLoading: false });
                    });
                } else if (source === 'facebook') {
                    return this.setState({
                        dataSourceFacebookGroupTab: ds.cloneWithRows(response || [])._dataBlob.s1.result.slice(0, 10),
                    }, function () {
                        this.setState({ isLoading: false });
                    });
                } else if (source === 'google') {
                    return this.setState({
                        dataSourceGoogleTab: ds.cloneWithRows(response || [])._dataBlob.s1.result.slice(0, 10),
                    }, function () {
                        this.setState({ isLoading: false });
                    });
                } else if (source === 'wiki') {
                    return this.setState({
                        dataSourceBenefitsTab: ds.cloneWithRows(response || [])._dataBlob.s1.result.slice(0, 10),
                    }, function () {
                        this.setState({ isLoading: false });
                    });
                }
            })
            .catch(error => {
                console.error(error);
            });
    }

    // Get data for TabAll
    handleTabAll() {
        return Promise.all([this.getDataHRM(), this.getDataOther()])
            .then(data => {
                let ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
                return this.setState({
                    dataSourceHRMAll: ds.cloneWithRows(data[0] || []),
                    dataSourceOther: ds.cloneWithRows(data[1] || [])._dataBlob.s1.result.slice(0, 10),
                }, function () {
                    this.setState({ isLoading: false });
                });

            })
    }

    // update previousKeyword when changed search keyword
    async handleSearchKeyword(i) {
        this.setState({ currentTab: i });
        if (this.state.previousKeyword === '') {
            this.setState({
                previousKeyword: this.state.searchKeyword,

                isKeywordChanged: true,
                hrmKeywordChanged: true,
                innewsKeywordChanged: true,
                facebookGroupKeywordChanged: true,
                googleKeywordChanged: true,
                wikiKeywordChanged: true,
            }, function () {
                this.getData(i, true);
            });
        } else {
            if (this.state.previousKeyword !== this.state.searchKeyword) {
                await this.setState({
                    dataSourceHRMAll: [],
                    dataSourceOther: [],
                    dataSourceHRM: [],
                    dataSourceForEachTab: [],
                    dataSourceFacebookGroupTab: [],
                    dataSourceGoogleTab: [],
                    dataSourceBenefitsTab: [],
                })
                await this.setState({
                    previousKeyword: this.state.searchKeyword,
                    isKeywordChanged: true,
                    hrmKeywordChanged: true,
                    innewsKeywordChanged: true,
                    facebookGroupKeywordChanged: true,
                    googleKeywordChanged: true,
                    wikiKeywordChanged: true,
                }, function () {
                    this.getData(i, true);
                });
            } else {
                this.getData(i, false);
            }
        }
    }

    // update state of keyword from child component
    updateKeywordState(source) {
        switch (source) {
            case 'all': {
                this.setState({ isKeywordChanged: false });
                break
            } case 'hrm': {
                this.setState({ hrmKeywordChanged: false });
                break
            } case 'innews': {
                this.setState({ innewsKeywordChanged: false });
                break
            } case 'facebookgroup': {
                this.setState({ facebookGroupKeywordChanged: false });
                break
            } case 'google': {
                this.setState({ googleKeywordChanged: false });
                break
            } case 'wiki': {
                this.setState({ wikiKeywordChanged: false });
                break
            }
            default:
        }

    }

    // Handle search data for each tab when changed tab
    async handleChangeTab(i) {
        this.setState({ currentTab: i });

        // check data.length > 0
        switch (i) {
            case 0: {
                if (this.state.dataSourceHRMAll.length <= 0 || this.state.dataSourceOther.length <= 0) {
                    this.getData(i, true);
                }
                break
            } case 1: {
                if (this.state.dataSourceHRM.length <= 0) {
                    this.getData(i, true);
                }
                break
            } case 2: {
                if (this.state.dataSourceForEachTab.length <= 0) {
                    this.getData(i, true);
                }
                break
            } case 3: {
                if (this.state.dataSourceFacebookGroupTab.length <= 0) {
                    this.getData(i, true);
                }
                break
            } case 4: {
                if (this.state.dataSourceGoogleTab.length <= 0) {
                    this.getData(i, true);
                }
                break
            } case 5: {
                if (this.state.dataSourceBenefitsTab.length <= 0) {
                    this.getData(i, true);
                }
                break
            }
            default:
        }
    }

    // get data
    getData(i, isSearch) {
        this.setState({ isLoading: true });
        if (this.state.searchKeyword.trim() !== '') {
            switch (i) {
                case 0:
                    if (this.state.isKeywordChanged || this.state.dataSourceHRMAll.length <= 0) {
                        this.handleTabAll();
                    } else {
                        this.setState({ isLoading: false });
                    }
                    break
                case 1:
                    if (this.state.hrmKeywordChanged || this.state.dataSourceHRM.length <= 0) {
                        this.getDataHRMEmployee();
                    } else {
                        this.setState({ isLoading: false });
                    }
                    break
                case 2:
                    if (this.state.innewsKeywordChanged || this.state.dataSourceForEachTab.length <= 0) {
                        this.getDataBySource('innews');
                    } else {
                        this.setState({ isLoading: false });
                    }
                    break
                case 3:
                    if (this.state.facebookGroupKeywordChanged || this.state.dataSourceFacebookGroupTab.length <= 0) {
                        this.getDataBySource('facebook');
                    } else {
                        this.setState({ isLoading: false });
                    }
                    break
                case 4:
                    if (this.state.googleKeywordChanged || this.state.dataSourceGoogleTab.length <= 0) {
                        this.getDataBySource('google');
                    } else {
                        this.setState({ isLoading: false });
                    }
                    break
                case 5:
                    if (this.state.wikiKeywordChanged || this.state.dataSourceBenefitsTab.length <= 0) {
                        this.getDataBySource('wiki');
                    } else {
                        this.setState({ isLoading: false });
                    }
                    break
                default:
            }
        } else {
            this.setState({
                isLoading: false,
                dataSource: []
            })
            return Toast.show({
                text: 'Please input...',
                position: 'bottom',
                buttonText: 'Dismiss',
                duration: 3000
            });
        }
    }

    _handleFocusNextField = (nextField) => {
        console.log(nextField);
        this.refs[nextField].Input.focus();
    }

    render() {
        // StatusBar.setBarStyle('light-content', true);
        const { navigate } = this.props.navigation;
        closeDrawer = () => {
            this.drawer._root.close()
        };
        openDrawer = () => {
            this.drawer._root.open()
        };

        return (
            <Drawer
                ref={(ref) => { this.drawer = ref; }}
                content={<SideBar navigation={this.props.navigation} />}
                onClose={() => closeDrawer()} >
                <Container>
                    {/*------------------------ Search input ----------------------------- */}
                    <Header style={{ paddingTop: 15, backgroundColor: 'rgba(183, 133, 67, 1)', borderBottomWidth: 0, borderTopWidth: 0 }} searchBar rounded>
                        <Icon style={{ color: 'white', paddingTop: 10, paddingRight: 5 }} name="ios-menu"
                            onPress={() => openDrawer()} />
                        <Item style={{ backgroundColor: 'rgba(134, 97, 50, 1)' }}>
                            <Icon style={{ color: 'white' }} name="ios-search" />
                            <Input ref='SearchInput' style={{ color: 'white' }} placeholder="Search" placeholderTextColor='rgba(201, 202, 186, 0.81)'
                                value={this.state.searchKeyword} onChangeText={(value) => { this.setState({ searchKeyword: value }); }}
                                onSubmitEditing={() => this.handleSearchKeyword(this.state.currentTab)}
                                blurOnSubmit={false}
                            />
                            {
                                this.state.searchKeyword !== '' ? <Icon style={{ color: 'white' }} name="md-close"
                                    onPress={() => {
                                        this.setState({ searchKeyword: '' });
                                        this.refs.SearchInput._root.focus();
                                    }

                                    } /> : null
                            }
                        </Item>
                    </Header>
                    {/*------------------------ Tab ----------------------------- */}
                    <Tabs initialPage={0} renderTabBar={() => <ScrollableTab />}
                        tabBarUnderlineStyle={{ backgroundColor: 'rgba(183, 133, 67, 1)' }}
                        onChangeTab={({ i, ref, from }) => { this.handleChangeTab(i) }}
                        ref="MyTab"
                    >
                        <Tab heading="All" activeTextStyle={{ color: 'rgba(183, 133, 67, 1)', fontWeight: 'bold' }}>
                            {
                                // Handle Loading indicator
                                this.state.isLoading
                                    ?
                                    <View style={{ flex: 1, paddingTop: 20 }}><ActivityIndicator /></View>
                                    :
                                    <AllTab navigation={this.props.navigation}
                                        isKeywordChanged={this.state.isKeywordChanged}
                                        searchResultHRM={this.state.dataSourceHRMAll}
                                        searchResultOther={this.state.dataSourceOther}
                                        searchResultPaging={this.state.dataSourceOtherPaging}
                                        paging={this.getPaging.bind(this)}
                                        tabsRef={this.state.tabsRef} />
                            }
                        </Tab>
                        <Tab heading="Employees" activeTextStyle={{ color: 'rgba(183, 133, 67, 1)', fontWeight: 'bold' }}>
                            {
                                // Handle Loading indicator 
                                this.state.isLoading
                                    ?
                                    <View style={{ flex: 1, paddingTop: 20 }}><ActivityIndicator /></View>
                                    :
                                    <EmployeeTab navigation={this.props.navigation}
                                        isKeywordChanged={this.state.hrmKeywordChanged}
                                        searchResultHRM={this.state.dataSourceHRM}
                                        searchResultPaging={this.state.dataSourceHRMPaging}
                                        paging={this.getPaging.bind(this)}
                                    />
                            }
                        </Tab>
                        <Tab heading="In News" activeTextStyle={{ color: 'rgba(183, 133, 67, 1)', fontWeight: 'bold' }}>
                            {
                                // Handle Loading indicator
                                this.state.isLoading
                                    ?
                                    <View style={{ flex: 1, paddingTop: 20 }}><ActivityIndicator /></View>
                                    :
                                    <InNewsTab
                                        navigation={this.props.navigation}
                                        isLoading={this.state.isLoading}
                                        isKeywordChanged={this.state.innewsKeywordChanged}
                                        searchResult={this.state.dataSourceForEachTab}
                                        searchResultPaging={this.state.dataSourceForEachTabPaging}
                                        paging={this.getPaging.bind(this)}
                                    />
                            }
                        </Tab>
                        <Tab heading="FB Group" activeTextStyle={{ color: 'rgba(183, 133, 67, 1)', fontWeight: 'bold' }}>
                            {
                                // Handle Loading indicator
                                this.state.isLoading
                                    ?
                                    <View style={{ flex: 1, paddingTop: 20 }}><ActivityIndicator /></View>
                                    :
                                    <FacebookGroupTab navigation={this.props.navigation}
                                        searchResult={this.state.dataSourceFacebookGroupTab}
                                        isKeywordChanged={this.state.facebookGroupKeywordChanged}
                                        searchResultPaging={this.state.dataSourceFacebookGroupPaging}
                                        paging={this.getPaging.bind(this)}
                                    />
                            }
                        </Tab>
                        <Tab heading="GDOC" activeTextStyle={{ color: 'rgba(183, 133, 67, 1)', fontWeight: 'bold' }}>
                            {
                                // Handle Loading indicator
                                this.state.isLoading
                                    ?
                                    <View style={{ flex: 1, paddingTop: 20 }}><ActivityIndicator /></View>
                                    :
                                    <GoogleTab navigation={this.props.navigation}
                                        searchResult={this.state.dataSourceGoogleTab}
                                        isKeywordChanged={this.state.googleKeywordChanged}
                                        searchResultPaging={this.state.dataSourceGooglePaging}
                                        paging={this.getPaging.bind(this)}
                                    />
                            }
                        </Tab>

                        <Tab heading="BENEFITS" activeTextStyle={{ color: 'rgba(183, 133, 67, 1)', fontWeight: 'bold' }}>
                            {
                                // Handle Loading indicator
                                this.state.isLoading
                                    ?
                                    <View style={{ flex: 1, paddingTop: 20 }}><ActivityIndicator /></View>
                                    :
                                    <BenefitsTab navigation={this.props.navigation}
                                        searchResult={this.state.dataSourceBenefitsTab}
                                        isKeywordChanged={this.state.wikiKeywordChanged}
                                        searchResultPaging={this.state.dataSourceWikiPaging}
                                        paging={this.getPaging.bind(this)}
                                    />
                            }
                        </Tab>
                    </Tabs>
                </Container>
            </Drawer>
        );
    }
}
SearchScreen.router = AllTab.router;
export default SearchScreen; 