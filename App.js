import React from 'react';
import { StackNavigator } from 'react-navigation';
import { StyleSheet, AppRegistry, View, Image, StatusBar, AsyncStorage, ListView, ActivityIndicator } from 'react-native';
import { Root, Container, Header, Content, Button, Text, Left, Icon, Drawer, Toast } from 'native-base';
import SearchScreen from './screens/SearchScreen';
import AllTab from './screens/AllTab';
import InNewsTab from './screens/InNewsTab';
import DetailScreen from './screens/DetailScreen';
import SideBarScreen from './screens/SideBarScreen';
import InNewsScreen from './screens/InNewsTab';
import Expo from 'expo';

class LoginScreen extends React.Component {
  static navigationOptions = {
    title: '', header: null,
    headerTintColor: 'white',
    headerStyle: {
      backgroundColor: 'rgba(183, 133, 67, 1)'
    },
  };
  constructor(props) {
    super(props);
    this.state = {
      isReady: false,
      showToast: false,
      dataSource: []
    }
  }

  async getInitData(valid_email) {
    return fetch('http://osscar.topica.vn/ad/admin/search/hrm?num=1&key=' + valid_email)
      .then(response => response.json())
      .then(responseJson => {
        this.saveItem('tennv',  responseJson[0].tennv);
        this.saveItem('anhdaidien', 'http://osscar.topica.vn' + responseJson[0].anhdaidien);
        this.saveItem('id', responseJson[0].id);
      })
      .catch(error => {
        console.error(error);
      });
  }

  async saveItem(item, selectedValue) {
    try {
      selectedValue = JSON.stringify(selectedValue);
      if (selectedValue) {
        await AsyncStorage.setItem(item, selectedValue);
      } else {
        console.log('Cannot set for key:' + item + 'with value:' + selectedValue);
      }
    } catch (error) {
      console.error('AsyncStorage error: ' + error.message);
    }
  }

  signInWithGoogleAsync = async () => {
    try {
      this.setState({
        isReady: false
      });
      const result = await Expo.Google.logInAsync({
        iosClientId: '647978066337-o61j9h4jls2ehm9npe8jjidms5lccc44.apps.googleusercontent.com',
        scopes: ['profile', 'email'],
      })
      if (result.type === 'success') {
        // this.setState({
        //   isReady: true
        // });
        return result
      }
      return { cancelled: true }
    } catch (e) {
      return { error: e }
    }
  }

  onLoginPress = async () => {
    const { navigate } = this.props.navigation;

    const result = await this.signInWithGoogleAsync()
    this.setState({
      isReady: true
    });
    // check email has suffix '@topica.edu.vn' and '@topica.asia'
    if (result.user.email.indexOf('@topica.edu.vn') !== -1 || result.user.email.indexOf('@topica.asia') !== -1) {
      this.saveItem('valid_email', result.user.email);
      this.getInitData(result.user.email);
      return navigate('Search');
    } else {
      return Toast.show({
        text: 'Please use email of TOPICA',
        position: 'bottom',
        buttonText: 'Dismiss',
        duration: 3000
      });
    }
  }

  async componentWillMount() {
    await Expo.Font.loadAsync({
      'Roboto': require('native-base/Fonts/Roboto.ttf'),
      'Roboto_medium': require('native-base/Fonts/Roboto_medium.ttf'),
      'Ionicons': require('@expo/vector-icons/fonts/Ionicons.ttf'),
    });
    this.setState({
      isReady: true
    });
    const { navigate } = this.props.navigation;
    const value = await AsyncStorage.getItem('valid_email');
    if (value !== null && value !== '') {
      this.getInitData(value);
      return navigate('Search');
    }
  }

  render() {
    StatusBar.setBarStyle('light-content', true);
    const { navigate } = this.props.navigation;
    if (!this.state.isReady) {
      return (
        <View style={{ flex: 1, paddingTop: 20 }} style={[styles.container, styles.horizontal]}>
          <ActivityIndicator />
        </View>
      );
    }
    return (
      <Container containerStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.45)' }}>
        <Content contentContainerStyle={{ flex: 1, justifyContent: 'center' }}>
          <Image style={styles.imgLogin} source={require("./img/osscar-login.png")} />
          <Button style={styles.buttonLogin} iconLeft danger onPress={this.onLoginPress}>
            <Icon name='logo-googleplus' />
            <Text>Sign in with Google</Text>
          </Button>
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  buttonLogin: {
    alignSelf: 'center',
  },
  imgLogin: {
    height: 120,
    width: 300,
    alignSelf: 'center',
    marginBottom: 25,
  },
  container: {
    flex: 1,
    justifyContent: 'center'
  },
  horizontal: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10
  }
});
// export default LoginScreen;
export const App = StackNavigator({
  Login: { screen: LoginScreen },
  Search: { screen: SearchScreen },
  TabAll: { screen: AllTab },
  TabInNews: { screen: InNewsTab },
  Detail: { screen: DetailScreen },
  InNews: { screen: InNewsScreen },
}, {
    contentComponent: ({ navigation }) => (<SideBarScreen navigation={navigation} />
    )
  }
);

// export default App;
export default () =>
  <Root>
    <App />
  </Root>;

