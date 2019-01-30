import React, { Component } from 'react';
import { View, Text, ScrollView, FlatList, Modal, StyleSheet,Alert, PanResponder } from 'react-native';
import { Card, Button} from 'react-native-elements';
import { connect } from 'react-redux';
import { baseUrl } from '../shared/baseUrl';
import { postFavorite, postComment } from '../redux/ActionCreators';
import { Rating } from 'react-native-elements';
import { Input } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as Animatable from 'react-native-animatable';


const mapStateToProps = state =>{
    return {
        dishes:state.dishes,
        comments:state.comments,
        favorites: state.favorites
    }
}
const mapDispatchToProps = dispatch => ({
    postFavorite : (dishId) => dispatch(postFavorite(dishId)),
    postComment: (dishId, rating, author, comment) =>dispatch(postComment(dishId, rating, author, comment))

});


function RenderDish(props){
    const dish = props.dish;
    handleViewRef = ref => this.view = ref;
    const recognizeDrag = ({moveX, moveY, dx, dy}) =>{
        if(dx <  -200)
            return true;
        else
            return false;

    };
    const panResponder = PanResponder.create({
            onStartShouldSetPanResponder: (e, gestureState) =>{
                return true;
            },
            onPanResponderGrant: () => {
                this.view.rubberBand(1000)
                    .then(endState =>console.log(endState.finished ? 'finished': 'cancelled'))
            },
            onPanResponderEnd: (e, gestureState) => {
                if(recognizeDrag(gestureState))
                    Alert.alert(
                        'Add to Favorites?',
                        'Are you sure you wish to add '+ dish.name+ 'to your favorites',
                        [
                            {
                                text:'Cancel',
                                onPress:() => console.log('Cancel pressed'),
                                style:'cancel'
                            },
                            {
                                text: 'OK',
                                onPress: ()=>()=>props.favorite ? console.log('Already favorite'): props.onPress()                              
                            }
                        ],
                        {cancelable:false}
                        
                    );                 
                return true;
            }
    });
    
    if(dish!= null){
        return(
            <Animatable.View animation="fadeInDown" duration={2000} delay={1000}
            ref={this.handleViewRef}
            {...panResponder.panHandlers}
            >
            <Card 
                featuredTitle={dish.name}
                image = {{uri: baseUrl + dish.image}}
                >
                <Text style={{margin:10}}>
                    {dish.description}                
                </Text>
                <Icon
                    raised
                    reverse
                    size={40}
                    name={props.favorite ? 'heart': 'heart-o'}
                    type='font-awesome'
                    color='#ff5500'
                    onPress={()=>props.favorite ? console.log('Already favorite'): props.onPress()}
                />
                <Icon
                    raised
                    reverse
                    size={40}
                    name='pencil'
                    type='font-awesome'
                    color='#512DA8' 
                    onPress={()=>props.onClick()}                  
                />
                </Card>
                </Animatable.View>

        );
    }
    else{
       return(<View></View>);
    }
}

function RenderComments(props){
    const comments = props.comments;
    const renderCommentItem = ({item, index})=>{
        return (
            <View key={index} style={{margin:10}}>
                <Text style={{fontSize:14}}>
                    {item.comment}
                </Text>
                <Text style={{fontSize:12}}>
                    {item.rating} Starts
                </Text>
                <Text style={{fontSize:12}}>
                    {'--'+item.author+','+item.date}
                </Text>

            </View>
        );
    }

    return(
        <Animatable.View animation="fadeInUp" duration={2000} delay={1000}
                        >
        <Card title="Comments">
            <FlatList
                data={comments}
                renderItem={renderCommentItem}
                keyExtractor={item=>item.id.toString()}
            />  
        </Card>
        </Animatable.View>
    );
}

class Dishdetail extends Component{

    constructor(props){
        super(props);
        this.state = {            
            showModal:false,
            rating:'',
            author:'',
            comment:''
        }
    }
    toggleModal(){
        this.setState({showModal: !this.state.showModal})
    }
     markFavorite(dishId){
        this.props.postFavorite(dishId);
    }
    handleComment(dishId, rating, author, comment){
        console.log(JSON.stringify(this.state));
        console.log("dishiD in handleComment " +dishId);
        
        this.props.postComment(dishId,rating,author, comment);    
        this.toggleModal();
    }
    handleCancel(){
        this.setState({
            showModal:false,
            rating:0,         
            author:'',
            comment:'',
            showModal:false
          });       
    }

    static navigationOptions = {
        title: 'Dish Details'
    };
//<!-- Now the plus here means that since this
//will be a string here I am going to turn that in to a number.
    render(){
        const dishId = this.props.navigation.getParam('dishId','');
        //const dishIdInt = parseInt(dishId, 10);
        console.log("Type of " , (typeof dishId));
        return (
            <ScrollView>
                
                <RenderDish dish={this.props.dishes.dishes[+dishId]} 
                            favorite={this.props.favorites.some(el =>el === dishId)}
                            onPress={()=>this.markFavorite(dishId)} onClick={()=>{this.toggleModal();}}/>
                <RenderComments comments={this.props.comments.comments.filter((comment)=>comment.dishId === dishId)} />
            
                <Modal animationType = {"slide"} transparent={false}
                        visible={this.state.showModal}>

                    <View style={styles.formRow}>
                        <Rating
                        showRating
                        type="star"
                        startingValue={1}
                        ratingCount= {5}
                        imageSize={40}
                        onFinishRating={(ratingCount)=>{this.setState({rating:ratingCount.toString()})}}
                        onStartRating={this.ratingStarted}
                        style={{ paddingVertical: 10 }}                        
                        />
                    </View>
                    <View style={styles.formRow}>
                        <Input  placeholder='Author' 
                                name="author"
                                leftIcon={
                                    <Icon
                                    name='user' 
                                    Size={24}
                                    color='black'
                                    />
                                }
                              onChangeText={(text) => this.setState({author:text})}                          
                        />              
                    </View>
                    <View style={styles.formRow}>
                        <Input  placeholder='Comment'
                                name="comment"
                                leftIcon={
                                <Icon
                                    name='comment' size={24} color='black' />
                                }
                                onChangeText={(text) => this.setState({comment:text})}
                                
                        />
                    </View>

        
                    <View style={styles.formRow}>
                        <Button
                                title='SUBMIT'
                                onPress={()=>{
                                    console.log("dishiD in submit " +dishId);
                                    this.handleComment(dishId, this.state.rating, this.state.author, this.state.comment)}}
                                raised ={true}
                                buttonStyle={{
                                    backgroundColor: "#512DA8",
                                    width: 300,
                                    height: 45,
                                    borderColor: "transparent",
                                    borderWidth: 0,
                                    borderRadius: 5
                                  }}
                        />
                    </View>
                    <View style={styles.formRow}>
                        <Button
                                title='CANCEL'                               
                                onPress={()=>this.handleCancel()} 
                                buttonStyle={{
                                    backgroundColor:"rgb(72,72,72) ",
                                    width: 300,
                                    height: 45                                    
                                  }}
                        />       
                    </View>                                
                </Modal>        
            </ScrollView>
        
        );
    }
}
const styles = StyleSheet.create({
    formRow:{
        alignItems: 'center',
        justifyContent: 'center',
        flex:1,
        flexDirection: 'row',
        margin:5
    },
    formLabel: {
        fontSize:18,
        flex:2
    },
    formItem :{
        flex:1
    },
    modal:{
        justifyContent:'center',
        margin:20
    },
    modalTitle:{
        fontSize:24,
        fontWeight:'bold',
        backgroundColor:'#512DA8',
        textAlign:'center',
        color:'white',
        marginBottom:20
    },
    modalText:{
        fontSize:18,
        margin:10
    }
});
export default connect(mapStateToProps,mapDispatchToProps)(Dishdetail);