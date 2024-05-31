/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  FlatList,
  StyleSheet,
  SafeAreaView,
} from 'react-native';

const WebSocketExample = () => {
  const ws = useRef(null); // Create a reference to the WebSocket instance
  const [messages, setMessages] = useState([]); // State to store incoming messages
  const [messageInput, setMessageInput] = useState(''); // State to store message input

  useEffect(() => {
    ws.current = new WebSocket('wss://echo.websocket.org');

    ws.current.onopen = () => {
      console.log('WebSocket connection established');
    };

    ws.current.onmessage = event => {
      const newMessage = event.data;
      setMessages(prevMessages => [
        ...prevMessages,
        {message: newMessage, type: 'incoming'},
      ]); // Add new incoming message to the messages array
    };

    ws.current.onerror = error => {
      console.error('WebSocket error:', error);
    };

    ws.current.onclose = () => {
      console.log('WebSocket connection closed');
    };

    // Cleanup function
    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, []);

  const sendMessage = () => {
    // Send a message to the WebSocket server
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(messageInput);
      setMessages(prevMessages => [
        ...prevMessages,
        {message: messageInput, type: 'outgoing'},
      ]); // Add new outgoing message to the messages array
      setMessageInput(''); // Clear message input after sending
    }
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <FlatList
        data={messages}
        renderItem={({item}) =>
          item.message != '' ? (
            <Text
              style={
                item.type === 'outgoing'
                  ? styles.outgoingMessage
                  : styles.incomingMessage
              }>
              {item.message}
            </Text>
          ) : null
        }
        keyExtractor={(item, index) => index.toString()}
        style={{flex: 1}}
      />
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 10,
        }}>
        <TextInput
          style={{flex: 1, borderWidth: 1, borderColor: 'gray', padding: 10}}
          value={messageInput}
          onChangeText={text => setMessageInput(text)}
          placeholder="Enter message"
        />
        <TouchableOpacity
          onPress={sendMessage}
          style={{
            padding: 10,
            backgroundColor: 'blue',
            borderRadius: 5,
            marginLeft: 10,
          }}>
          <Text style={{color: 'white'}}>Send</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  incomingMessage: {
    backgroundColor: 'darkgreen',
    color: 'white',
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
  },
  outgoingMessage: {
    backgroundColor: 'red',
    color: 'white',
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
  },
});

export default WebSocketExample;
