/**
 * Created by Alex on 2/4/2017.
 */
import React, {Component} from 'react';
import {
    AppRegistry,
    StyleSheet,
    Modal,
    Alert
} from 'react-native';

import {Container, Content, List, ListItem, Text, Spinner, CardItem, Card, H2, Input, Button} from 'native-base';
import PushNotification from 'react-native-push-notification';
// import StatusBarAlert from 'react-native-statusbar-alert';
//
// <StatusBarAlert
//     visible={true}
//     message="Silent Switch ON"
//     backgroundColor="#3CC29E"
//     color="white"
//     pulse="background"
// />
export default class ListComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            items: [],
            loading: false,
            modalVisible: false,
            selectedItem: undefined,
            buyQuantity: 0,
            buyPrice: 0,
            bestPrice: undefined,
            failedBuy: false,
            ws : new WebSocket('ws://172.30.119.227:3000')
        };
    }

    async componentDidMount() {
        this.state.ws.onopen = () => {
            //ws.send('something'); // send a message
        };

        this.state.ws.onmessage = (e) => {
            // a message was received
            console.log(e.data, 'ws messaje recived');
            this.fetchList().then().then();
        };

        this.state.ws.onerror = (e) => {
            // an error occurred
            console.log(e.message, 'WS ERROR');
            Alert.alert('the market is offline');
            PushNotification.localNotificationSchedule({
                message: "The server is offline", // (required)
                date: new Date(Date.now() ) // in 60 secs
            });
            this.setState({loading: false});
        };

        this.state.ws.onclose = (e) => {
            // connection closed
            console.log(e.code, e.reason, 'WS Closed');
        };

        await this.fetchList();
        }

    async fetchList() {
        try {
            this.setState({loading: true});
            let response = await fetch('http://172.30.119.227:3000/items');
            this.setState({loading: false});

            console.log(response, "RESPONSE FROM GET LIST");

            response = await response.json();
            this.setState({items: response});
        } catch (err) {
            console.log(err, 'ERROR HTTP GET LIST');
            this.setState({loading: false});
        }
    }

    setModalVisible(bool, item) {
        this.setState({
            modalVisible: bool,
            selectedItem: item
        });
    }

    async onAddPress() {
        try {
            this.setState({loading: true});
            let response = await fetch('http://172.30.119.227:3000/buy', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: this.state.selectedItem.id,
                    name: this.state.selectedItem.name,
                    quantity: this.state.buyQuantity,
                })
            });
            console.log(response, 'BUY');
            if (response.status === 200) {
                let content = await response.json();
                this.setState({loading: false});
                this.setState({failedBuy: false});
                this.setState({buyQuantity:undefined});
                this.setState({modalVisible:false});
            }
            if (response.status === 404) {
                this.setState({failedBuy: true});
                this.setState({loading: false});
            }
        } catch (err) {
            this.setState({loading: false});
            console.log(err);
            this.setState({modalVisible:false});
            Alert.alert(err);
        }
    }

    render() {
        if (this.state.loading === true) {
            return (
                <Content>
                    <Spinner/>
                </Content>
            )
        }
        return (
            <Content>
                <List dataArray={this.state.items}
                      renderRow={(item) =>
                            <ListItem button onPress={()=> this.setModalVisible(true, item)}>

                                <Text>Name: {item.name} </Text>
                                <Text>Quantity: {item.quantity} </Text>
                                <Text>Status: {item.status}</Text>

                            </ListItem>
                        }
                />
                <Modal
                    animationType="slide"
                    transparent={false}
                    visible={this.state.modalVisible}
                    onRequestClose={() => {this.setState({modalVisible:false, failedBuy:false, buyQuantity:undefined})}}>
                    {this.state.modalVisible ?
                        <Content>
                            <Card>
                                <H2>Buy some goods</H2>
                                <CardItem>
                                    <Text>Name: {this.state.selectedItem.name} </Text>
                                    <Text>Quantity: {this.state.selectedItem.quantity} </Text>
                                </CardItem>
                                <CardItem>
                                    <Input placeholder="quantity"
                                           onChangeText={(text) => this.setState({buyQuantity : text})}/>
                                    <Button block success onPress={() => this.onAddPress()}> Buy </Button>
                                </CardItem>
                                {this.state.bestPrice ?
                                    <CardItem>
                                        <Text>The best price is : {this.state.bestPrice}</Text>
                                    </CardItem> :
                                    null
                                }
                                {this.state.failedBuy ?
                                    <CardItem>
                                        <Text>Item not found</Text>
                                    </CardItem> :
                                    null
                                }
                            </Card>
                        </Content>
                        //this is just so the doesn't break when it tryes to get props of an undefined
                        : null
                    }

                </Modal>
            </Content>
        )
    }
}
