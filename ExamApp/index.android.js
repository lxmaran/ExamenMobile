/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import {
    AppRegistry,
    StyleSheet,
    View, StatusBar
} from 'react-native';
import {Container, Content, Tabs } from 'native-base';
import ListComponent from './src/ListComponent';
import BuyGoods from './src/SellGoods';

export default class ExamApp extends Component {
  constructor(props){
    super(props);
  }
    render() {
        return (
            <Container>
              <Content>
                <Tabs>
                  <ListComponent tabLabel='Items'/>
                  <BuyGoods tabLabel='Add'/>
                </Tabs>
              </Content>
            </Container>
        );
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

AppRegistry.registerComponent('ExamApp', () => ExamApp);
