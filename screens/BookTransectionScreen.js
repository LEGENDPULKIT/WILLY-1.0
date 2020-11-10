import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity,TextInput, Image, KeyboardAvoidingView, Alert, ToastAndroid} from 'react-native';
import * as Permissions from 'expo-permissions';
import {BarCodeScanner} from 'expo-barcode-scanner';
import * as firebase from 'firebase'
import db from '../config';

export default class BookTransectionScreen extends React.Component
{
    constructor()
    {
        super();
        this.state={
            hasCameraPermissions:null,
            scanned:false,
            scannedData:'',
            buttonState:'normal',
            scannedBookId:'',
            scannedStudentId:'',
            transactionMessage:'',
        }
    }
    getCameraPermissions=async(id)=>{
        const {status}=await Permissions.askAsync(Permissions.CAMERA);
        this.setState({
            //status==="granted" is true when user has granted permission
            //status==="granted" is false when user has not granted permission
            hasCameraPermissions:status==="granted",
            buttonState:id,
            scanned:false,
        })

    }
    handleBarCodeScanned=async({type,data})=>
    {
        const {buttonState}=this.state
        console.log(buttonState)
        if(buttonState==="BookId")
        {
            this.setState({
                scanned:true,
                scannedBookId:data,
                buttonState:'normal',
            })
        }
        else if(buttonState==="StudentId")
        {
            this.setState({
                scanned:true,
                scannedStudentId:data,
                buttonState:'normal',
            })
        }
    }
    //issue the book
    initiateBookIssue=async()=>
    {
        //add a transection
        db.collection("Transactions").add({
            'StudentId':this.state.scannedStudentId,
            'BookId':this.state.scannedBookId,
            'date':firebase.firestore.Timestamp.now().toDate(),
            'transactionType':"Issue",
        })
        //change the book status
        db.collection("Books").doc(this.state.scannedBookId).update({
            'BookAvailability':false,

        })
        //change the o. of books for the student
        db.collection("Students").doc(this.state.scannedStudentId).update({
            'numberofbookissued':firebase.firestore.FieldValue.increment(1)
        })
        this.setState({
            scannedBookId:'',
            scannedStudentId:'',
        })
    }

     //return the book
     initiateBookReturn=async()=>
     {
         //add a transection
         db.collection("Transactions").add({
             'StudentId':this.state.scannedStudentId,
             'BookId':this.state.scannedBookId,
             'date':firebase.firestore.Timestamp.now().toDate(),
             'transactionType':"Return",
         })
         //change the book status
         db.collection("Books").doc(this.state.scannedBookId).update({
             'BookAvailability':true,
 
         })
         //change the o. of books for the student
         db.collection("Students").doc(this.state.scannedStudentId).update({
             'numberofbookissued':firebase.firestore.FieldValue.increment(-1)
         })
         this.setState({
             scannedBookId:'',
             scannedStudentId:'',
         })
     }




    handleTransaction=async()=>
    {
        var transactionMessage=null;
        db.collection("Books").doc(this.state.scannedBookId).get().then((doc)=>{
            var book=doc.data();
            var bookId=this.state.scannedBookId
            console.log(book);
            if(book.BookAvailability)
            {
                this.initiateBookIssue();
                transactionMessage="BookIssued"
                Alert.alert("Book Issued: "+bookId);
                //ToastAndroid.show("Book Issued: "+bookId,ToastAndroid.LONG)
            }
            else {
                this.initiateBookReturn();
                transactionMessage="BookReturn"
               Alert.alert("Book Return: "+bookId);
                //ToastAndroid.show("Book Return: "+bookId,ToastAndroid.LONG)
            }
        })
        this.setState({
            transactionMessage:transactionMessage
        })
    }
    //write BOOK ISSUE AND RETURN

    render(){
        const hasCameraPermissions=this.state.hasCameraPermissions
        const scanned=this.state.scanned
        const buttonState=this.state.buttonState
        if(buttonState!=="normal" && hasCameraPermissions)
        {
            return(
                <BarCodeScanner
                onBarCodeScanned={scanned ? undefined:this.handleBarCodeScanned}
                style={StyleSheet.absoluteFillObject}/>
            )
        }
        else if(buttonState==="normal")
        {

        
        return(
                <KeyboardAvoidingView style={styles.container} behavior="padding"enabled>
                    <View>
                        <Image
                            source={require("../assets/booklogo.jpg")}
                            style={{width:200,height:200}}
                        />
                        <Text style={{textAlign:'center',fontSize:30}}>WILLY</Text>
                    </View>
                    <View style={styles.inputView}>
                        <TextInput style={styles.inputBox}
                        placeholder="Book ID"
                        onChangeText={text=>this.setState({scannedBookId:text})}
                        value={this.state.scannedBookId}
                        />
                        <TouchableOpacity style={styles.scanButton}
                        onPress={()=>{
                            this.getCameraPermissions("BookId")
                        }}>
                            <Text style={styles.buttonText}>Scan</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.inputView}>
                        <TextInput style={styles.inputBox}
                        placeholder="Student ID"
                        onChangeText={text=>this.setState({scannedStudentId:text})}
                        value={this.state.scannedStudentId}
                        />
                        <TouchableOpacity style={styles.scanButton}onPress={()=>{
                            this.getCameraPermissions("StudentId")
                        }}>
                            <Text style={styles.buttonText}>Scan</Text>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity style={styles.submitButton}
                    onPress={async()=>
                    {
                        var transactionMessage=await this.handleTransaction()
                        
                    }}
                    >
                            <Text style={styles.submitbuttonText}>SUBMIT</Text>
                    </TouchableOpacity>
                </KeyboardAvoidingView>
        )
    }
}

}
const styles=StyleSheet.create({
    container:{
        flex:1,
        justifyContent:"center",
        alignItems:"center",
    },
    displayText:{
        fontSize:15,
        textDecorationLine:'underline',
    },
    scanButton:{
        backgroundColor:'#66bb6a',
       width:50,
       borderWidth:1.5,
       borderLeftWidth:0,
    },
    buttonText:{
        fontSize:15,
        textAlign:"center",
        marginTop:10,
    },
    inputView:
    {
        flexDirection:'row',
        margin:20,
    },
    inputBox:
    {
        width:200,
        height:40,
        borderWidth:1.5,
        borderRightWidth:0,
        fontSize:20,
    },
    submitButton:
    {
        backgroundColor:'teal',
        width:100,
        height:50,
        justifyContent:'center',
        borderWidth:2,
    },
    submitbuttonText:
    {
        fontSize:20,
        textAlign:'center',
        color:'white',
    }
})