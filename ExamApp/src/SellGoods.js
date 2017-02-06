/**
 * Created by Alex on 2/4/2017.
 */
import React, {Component} from 'react';
import {
    AppRegistry,
    StyleSheet,
    NetInfo,
    Alert,
    AsyncStorage
} from 'react-native';
import {Container, Content, List, ListItem, Text, Spinner, CardItem, Card, H2, Input, Button} from 'native-base';

export default class SellGoods extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            name: '',
            quantity: '',
            failedBuy: false,
            isConnected: true,
            pendingAdds:0
        };
    }

    // componentDidMount() {
    //     NetInfo.addEventListener(
    //         'change',
    //         this._handleConnectionInfoChange
    //     );
    // }
    //
    // componentWillUnmount() {
    //     NetInfo.removeEventListener(
    //         'change',
    //         this._handleConnectionInfoChange
    //     );
    // }
    //
    // _handleConnectionInfoChange = (connectionInfo) => {
    //     console.log(this.state.isConnected, 'STATE CHANGED');
    //     this.setState({isConnected:connectionInfo});
    // };

    async onAddPress() {

            try {
                this.setState({loading: true});
                if (this.state.isConnected) {
                    let response = await fetch('http://172.30.119.227:3000/add', {
                        method: 'POST',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            name: this.state.name,
                            quantity: this.state.quantity,
                        })
                    });
                    console.log(response, 'ADD');
                    let content = await response.json();
                    if (response.status === 200) {
                        this.setState({loading: false});
                        this.setState({failedBuy: false});
                        this.setState({quantity: undefined});
                        return;
                    }
                    if (response.status === 404) {
                        this.setState({failedBuy: true});
                        this.setState({loading: false});
                        console.log(content);
                        Alert.alert(content.text);
                        return;
                    }
                }
                else{
                    await AsyncStorage.setItem('ITEMS', JSON.stringify([]));
                    let items = await AsyncStorage.getItem("ITEMS");
                    console.log(items,'ITEMS');
                    let updated = JSON.parse(items);
                    console.log(updated,'UPDATE');
                    if(updated.length ===0){
                        updated=[];
                    }
                    updated.push({name:this.state.name,quantity:this.state.quantity});
                    AsyncStorage.setItem("items", JSON.stringify(updated), ()=>{ this.setState({pendingAdds:this.state.pendingAdds+1})});
                    this.state.name='';
                    this.state.quantity = '';
                }
                console.log(content);
                Alert.alert(content.text);

            } catch (err) {
                this.setState({loading: false});
                console.log(err);
            }
    }

    turnOn(){
        if(!this.state.isConnected){
            return;
        }
        // let items = [];
        // AsyncStorage.getItem("ITEMS").then(response => items=response);
        // if( JSON.parse(items).length!==0){
        //     let list = JSON.parse(items);
        //     list.forEach(x=>{
        //         let response = fetch('http://172.30.119.227:3000/add', {
        //             method: 'POST',
        //             headers: {
        //                 'Accept': 'application/json',
        //                 'Content-Type': 'application/json',
        //             },
        //             body: JSON.stringify({
        //                 name: x.name,
        //                 quantity: x.quantity,
        //             })
        //         });
        //         console.log(response, 'ADD');
        //         let content = response.json();
        //         if (response.status === 200) {
        //         }
        //         if (response.status === 404) {
        //             console.log(content);
        //             Alert.alert(content.text);
        //             return;
        //         }
        //     });
        //     AsyncStorage.setItem('ITEMS', JSON.stringify([]));
        // }
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
                <Button block success onPress={() => {this.setState({isConnected:!this.state.isConnected}); this.turnOn()}}> Turn {this.state.isConnected ? 'Off' : 'On'} </Button>
                <Card>
                    {!this.state.isConnected ?
                        <CardItem>
                            <Text>Pending adds: {this.state.pendingAdds}</Text>
                        </CardItem> : null}
                    <H2>Add some stuff</H2>
                    <CardItem>
                        <Input placeholder="name"
                               onChangeText={(text) => this.setState({name : text})}/>
                        <Input placeholder="quantity"
                               onChangeText={(text) => this.setState({quantity : text})}/>
                        <Button block success onPress={() => this.onAddPress()}> Add </Button>
                    </CardItem>
                </Card>
            </Content>
        );
    }
}