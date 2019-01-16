import React, { Component } from 'react';
import Menu from './MenuComponent';
import Home from './HomeComponent';
import Dishdetail from './DishdetailComponent';
import About from './AboutComponent';
import Contact from './ContactComponent';
import { View, Platform } from 'react-native';
import { createStackNavigator,createDrawerNavigator } from 'react-navigation';
import { Icon } from 'react-native-elements';


const MenuNavigator = createStackNavigator({
        Menu: {screen: Menu,
               navigationOptions:({navigation})=>({
                               headerLeft: <Icon name="menu" size={24}
                               color='white'
                               onPress={()=>navigation.toggleDrawer()}
                                />

               })
        },
        Dishdetail: { screen:Dishdetail }     
}, {
    initalRouteName : 'Menu',
    navigationOptions:{
        headerStyle:{
            backgroundColor:'#512DA8'
        },
        headerTintColor: '#fff',
        headerTitleStyle:{
            color:'#fff'
        }
    }
});

const HomeNavigator = createStackNavigator({
    Home: {screen: Home},
   
}, {
    navigationOptions:({navigation})=>({
        headerStyle:{
            backgroundColor:'#512DA8'
    },
    headerTintColor: '#fff',
    headerTitleStyle:{
        color:'#fff'
    }
})
});
const ContactNavigator = createStackNavigator({
    Contact: {screen: Contact},
   
}, {
    navigationOptions:{
        headerStyle:{
            backgroundColor:'#512DA8'
    },
    headerTintColor: '#fff',
    headerTitleStyle:{
        color:'#fff'
    }
}
});
const AboutNavigator = createStackNavigator({
    About: {screen: About},
   
}, {
    navigationOptions:({navigation})=>({
        headerStyle:{
            backgroundColor:'#512DA8'
    },
    headerTintColor: '#fff',
    headerTitleStyle:{
        color:'#fff'
    }
})
});


const MainNavigator = createDrawerNavigator({
    Home: {
        screen:HomeNavigator,
        navigationOptions:{
            title: 'Home',
            drawerLabel: 'Home'
        }
    },
    Menu: {
        screen:MenuNavigator,
        navigationOptions:{
            title: 'Menu',
            drawerLabel: 'Menu'
        }
    },
    Contact: {
        screen:ContactNavigator,
        navigationOptions:{
            title: 'Contact',
            drawerLabel: 'Contact'
        }
    },
    About: {
        screen:AboutNavigator,
        navigationOptions:{
            title: 'About',
            drawerLabel: 'About'
        }
    }
},{
    drawerBackgroundColor: '#D1C4E9'
});

class Main extends Component{
        render(){
            return (
                <View style={{flex:1, paddingTop: Platform.OS === 'ios' ? 0 : expo.Constants.statusBarHeight}}>
                    <MainNavigator />
                </View>
            )
        }

}
export default Main;