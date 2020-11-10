import React from 'react';
import { StyleSheet, Text, View,Image } from 'react-native';
import {createAppContainer} from 'react-navigation';
import {createBottomTabNavigator} from 'react-navigation-tabs'
import BookTransectionScreen from './screens/BookTransectionScreen';
import SearchScreen from './screens/SearchScreen';
console.disableYellowBox=true;
export default class App extends React.Component {
  render(){
  return (
    
   <AppContainer/>
   
  );
}
}
//create Tab Navigation
const TabNavigator=createBottomTabNavigator({
  BookTransection:{screen:BookTransectionScreen},
  Search:{screen:SearchScreen}
},
{
  defaultNavigationOptions:({navigation})=>({
    tabBarIcon:({})=>{
      const routeName=navigation.state.routeName
      if(routeName==="BookTransection")
      {
        return(
            <Image
            source={require('./assets/book.png')}
            style={{width:40,height:40}}
            />
        )
      }
      else if(routeName==="Search")
      {
        return(
          <Image
          source={require('./assets/searchingbook.png')}
          style={{width:40,height:40}}
          />
      )
      }
    }
  })
}

)


//create App container
const AppContainer=createAppContainer(TabNavigator)
