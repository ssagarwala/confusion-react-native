import React, { Component } from 'react';
import { View, Text, ScrollView, FlatList, Modal, StyleSheet} from 'react-native';
import { Card, Button} from 'react-native-elements';
import { connect } from 'react-redux';
import { baseUrl } from '../shared/baseUrl';
import { postFavorite } from '../redux/ActionCreators';
import { Rating } from 'react-native-elements';
import { Input } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';



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

   

    if(dish!= null){
        return(
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
        <Card title="Comments">
            <FlatList
                data={comments}
                renderItem={renderCommentItem}
                keyExtractor={item=>item.id.toString()}
            />  
        </Card>
    );
}

class Dishdetail extends Component{

    constructor(props){
        super(props);
        this.state = {            
            showModal:false,
            rating:0,
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

        this.props.postComment(dishId, rating, author, comment);
    }
    handleCancel(){
        toggleModal();
        
    }

    static navigationOptions = {
        title: 'Dish Details'
    };

    render(){
        const dishId = this.props.navigation.getParam('dishId','');
        return (
            <ScrollView>
                <RenderDish dish={this.props.dishes.dishes[+dishId]} 
                            favorite={this.props.favorites.some(el =>el === dishId)}
                            onPress={()=>this.markFavorite(dishId)} onClick={()=>this.toggleModal()}/>
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
                        onFinishRating={this.rating}
                        onStartRating={this.ratingStarted}
                        style={{ paddingVertical: 10 }}                        
                        />
                    </View>

                    <View style={styles.formRow}>
                        <Input  placeholder='Author`' 
                                name="author"
                                leftIcon={
                                    <Icon
                                    name='user'
                                    size={24}
                                    color='black'
                                    />
                                }
                              onChangeText={(text) => this.setState({text})}                          
                        />              
                    </View>
                    <View style={styles.formRow}>
                        <Input  placeholder='Comment'
                                name="comment"
                                leftIcon={
                                <Icon
                                    name='comment' size={24} color='black' />
                                }
                                
                        />
                    </View>
                    <View style={styles.formRow}>
                        <Button
                                title='SUBMIT'
                                onPress={()=>this.handleComment(dishId, rating, author, comment)} 
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
                                    backgroundColor: "rgb(72,72,72) ",
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