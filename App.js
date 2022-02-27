/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
  FlatList,
  InteractionManager,
  Alert,
  Image,
  TextInput,
  Button,
  TouchableOpacity
} from 'react-native';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        isReady: false,
        data : [],
        offset: 0,
        countAll : 0,
        textIn:'',
        dataUser : [],
        flagScreen : false
    }
  }

  componentDidMount(){
    InteractionManager.runAfterInteractions(()=>{
      this.handleGetData();
    })
  }

  handleGetData = () => {
      fetch(`https://pokeapi.co/api/v2/pokemon?limit=10&offset=${this.state.offset}`)
      .then((response) => response.json())
      .then((json) =>{
        const data1 = [];
        json.results.forEach(element => {
          data1.push(element)
        })
        this.setState({data : data1, countAll : json.count}),
        this.setState((state) => {
          return {
            offset : state.offset + 10
          }
        })
      })
      .catch((error) => console.error("error : ",error))
      .finally(() => this.setState({isReady:true}));
  }

  handleGetMoreDate = () => {
    this.setState({isReady: false})
    setTimeout(
      function() {
        if(this.state.offset > (this.state.countAll-10)){
          Alert.alert("END OF DATA")
        } else {
          fetch(`https://pokeapi.co/api/v2/pokemon?limit=10&offset=${this.state.offset}`)
          .then((response) => response.json())
          .then((json) =>{
            const olddata = this.state.data;
            json.results.forEach(element => {
              olddata.push(element)
            });
            this.setState({data: olddata}),
            this.setState((state) => {
              return {
                offset : state.offset + 10
              }
            })
          })
          .catch((error) => console.error("error : ",error))
          .finally(() => this.setState({isReady:true}));
        }
      }
      .bind(this),
      1000
    );
  }

  handleAddData = () => {
    const datau = this.state.dataUser;
    datau.push([this.state.textIn , true]);
    this.setState({dataUser : datau});
  }

  handleCrossData = (item, inde) => {
    const newIds = this.state.dataUser.slice()
    newIds[inde][1] = false 
    this.setState({dataUser: newIds})
  }

  renderItem = ({ item, index}) => {
    return (
      <TouchableOpacity style={{alignContent:'center', alignItems:'center'}} onPress={() => this.handleCrossData(item,index)}>
        {item[1] ? <Text style={styles.text}>{item}</Text> : <Text style={styles.textdis}>{item}</Text>}
      </TouchableOpacity>
    )
  }

  render() {
    const { isReady} = this.state;
    if(!isReady){
      return(
        <View style={styles.body}>
          <ActivityIndicator size="large" color="#0000ff"/>
        </View>
      );
    } else {
      return (
        <View style={styles.body}>
          <View style={styles.fixToText}>
            <Button
              title="QUESTION 1"
              onPress={() => this.setState({flagScreen: false})}
            />
            <Button
              title="QUESTION 2"
              onPress={() => this.setState({flagScreen: true})}
            />
          </View>
          {this.state.flagScreen ?
          <FlatList
            data={this.state.data}
            keyExtractor={({ id }, index) => id}
            renderItem={({ item }) => (
              <View style={{alignContent:'center', alignItems:'center'}}>
                <Text style={styles.text}>{item.name}</Text>
                <Image style={styles.tinyLogo} source={{uri: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/"+item.url.substring(34).replace(/\/$/, "")+".png"}}></Image>
              </View>
              
            )}
            onEndReached={this.handleGetMoreDate}
            onEndReachedThreshold ={0.1}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
          />
          :
          <View style={styles.body}>
          <View style={{flexDirection:'row'}}>
            <TextInput
              style={styles.input}
              onChangeText={(text)=> this.setState({textIn : text})}
              value={this.state.textIn}
              placeholder="useless placeholder"
              keyboardType="numeric"
            />
            <TouchableOpacity style={{flex:1, justifyContent:'center', alignItems:'center', borderRadius:2, backgroundColor:"#007AFF", margin:15}} onPress={()=> this.handleAddData()}>
              <Text>Add</Text>
            </TouchableOpacity>
          </View>
          
          <FlatList
            data={this.state.dataUser}
            keyExtractor={({ id }, index) => id}
            renderItem={this.renderItem}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
          />
          </View> 
          }         
        </View>
      );
    }
  }
};

const styles = StyleSheet.create({
  body: {
    backgroundColor: "#ffffff",
    justifyContent: 'center',
    alignContent:'center', 
    flex:1
  },
  separator: {
    height: 10,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  text: {
    fontSize: 15,
    color: 'black',
    textAlign:'center',
    paddingVertical:20
  },
  textdis: {
    fontSize: 15,
    color: 'black',
    textAlign:'center',
    paddingVertical:20,
    textDecorationLine: 'line-through'
  },
  footer: {
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    width:'90%',
    height:'40%',
    margin: 20,
    backgroundColor: "#ea3a3a",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  tinyLogo: {
    width: 50,
    height: 50,
  },
  input: {
    flex:3,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  fixToText: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
});

export default App;
