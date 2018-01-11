import React from 'react';
import { StyleSheet, View, StatusBar, ActivityIndicator, Keyboard, Dimensions, Image } from 'react-native';
import {
  Drawer, Container, Header, Item, Input, Icon, Button, Content,
  List, ListItem, Left, Body, Right, Thumbnail, Text, Tab, Tabs, ScrollableTab, Form, Label
} from 'native-base';
import { Col, Row, Grid } from "react-native-easy-grid";
import Communications from 'react-native-communications';
import ImageLoad from 'react-native-image-placeholder';

class DetailScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      anhdaidien: '../img/default-user-image.png',
    }
  }
  static navigationOptions = {
    title: 'Profile',
    headerTintColor: 'white',
    headerStyle: {
      backgroundColor: 'rgba(183, 133, 67, 1)'
    },
  };

  componentDidMount() {
    this.getData();
  }

  getData() {
    const { params } = this.props.navigation.state;

    console.log('http://osscar.topica.vn/ad/admin/search/hrm?id=' + params.id.replace(/['"]+/g, ''));
    return fetch('http://osscar.topica.vn/ad/admin/search/hrm?id=' + params.id.replace(/['"]+/g, ''))
      .then(response => response.json())
      .then(responseJson => {
        this.setState({
          isLoading: false,
          manv: responseJson.manv,
          anhdaidien: 'http://osscar.topica.vn' + responseJson.anhdaidien,
          tennv: responseJson.tennv,
          mobile: responseJson.mobile,
          email: responseJson.email,
          facebook: responseJson.Facebook,
          ngaysinh: responseJson.ngaysinh,
          capbac: responseJson.capbac,
          ngach: responseJson.ngach,
          gioitinh: responseJson.gioitinh,
        }, function () {

        });

      })
      .catch(error => {
        console.error(error);
      });
  }

  render() {
    // StatusBar.setBarStyle('light-content', true);
    if (this.state.isLoading) {
      return (
        <View style={{ flex: 1, paddingTop: 20 }}>
          <ActivityIndicator />
        </View>
      );
    } else {
      const { params } = this.props.navigation.state;
      return (
        <Container>
          <Grid>
            <Row size={1}>
              <View style={styles.avatar} >
                <ImageLoad style = {styles.imageRound}
                  placeholderSource={require('../img/default-user-image.png')}
                  source={{ uri: this.state.anhdaidien }}
                />
              </View>
            </Row>
            <Row size={3} style={styles.bottomStyle}>
              <Content>
                <Form>
                  <Item floatingLabel>
                    <Label>Tên</Label>
                    <Input value={this.state.tennv} editable={false} />
                  </Item>
                  <Item floatingLabel onPress={() => Communications.phonecall(this.state.mobile, true)}>
                    <Label onPress={() => Communications.phonecall(this.state.mobile, true)}>Phone</Label>
                    <Input value={this.state.mobile} editable={false} />
                  </Item>
                  <Item floatingLabel>
                    <Label>Email</Label>
                    <Input value={this.state.email} editable={false} />
                  </Item>
                  <Item floatingLabel>
                    <Label>Facebook</Label>
                    <Input value={this.state.facebook} editable={false} />
                  </Item>
                  <Item floatingLabel>
                    <Label>D.O.B</Label>
                    <Input value={this.state.ngaysinh} editable={false} />
                  </Item>
                  <Item floatingLabel>
                    <Label>Cấp bậc</Label>
                    <Input value={this.state.capbac} editable={false} />
                  </Item>
                  <Item floatingLabel>
                    <Label>Ngạch</Label>
                    <Input value={this.state.ngach} editable={false} />
                  </Item>
                  <Item floatingLabel>
                    <Label>Giới tính</Label>
                    <Input value={this.state.gioitinh} editable={false} />
                  </Item>
                </Form>
                {/* <Button primary style={styles.buttonStyle}><Text> Cập nhật </Text></Button> */}
              </Content>
            </Row>
          </Grid>
        </Container>
      );
    }
  }
}

const styles = StyleSheet.create({
  topStyle: {
    // backgroundColor: 'pink',
  },
  avatar: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomStyle: {
    // backgroundColor: 'blue',
  },
  buttonStyle: {
    backgroundColor: 'rgba(183, 133, 67, 1)',
    marginTop: 20,
    justifyContent: "flex-start",
    justifyContent: 'center',
    alignItems: 'center',
    width: 250,
    alignSelf: 'center',
  },
  // Handle image round
  imageRound: {
    width: 120,
    height: 120,
    borderRadius: 60,
    overflow: 'hidden',
  }
});

export default DetailScreen; 