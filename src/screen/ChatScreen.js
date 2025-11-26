import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Image,
  SafeAreaView,
  StatusBar,
  ActivityIndicator
} from 'react-native';
import Icons from '../assets/Icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import socketServices from '../utils/socketServices';
import { BASE_URL } from '../api/BaseUrl';
import { GET_CHATS_DATA } from '../api/Endpoints';
import { loadUserLocalMethod } from '../redux/slice/UserSlice';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { COLORS } from '../theme/Colors';


const ChatScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { bookingId } = route?.params || {};
  const [userLocalData, setUserLocalData] = useState(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [socketInitialized, setSocketInitialized] = useState(false);
  const [driverInfo, setDriverInfo] = useState(null);
  const [clientInfo, setClientInfo] = useState(null);
  const [loadingMessages, setLoadingMessages] = useState(true);
  const [initializingSocket, setInitializingSocket] = useState(false);
  const flatListRef = useRef(null);
  const messageIdRef = useRef(new Set());

  // Load user data and initialize socket
  useEffect(() => {
    const initializeApp = async () => {
      try {
        const localData = await loadUserLocalMethod();
        setUserLocalData(localData);
      } catch (error) {
        console.error('Initialization error:', error);
      }
    };

    initializeApp();

    return () => {
      messageIdRef.current.clear();
    };
  }, []);

  // Initialize socket when token is available
  useEffect(() => {
    if (!userLocalData?.token) return;

    const initializeSocket = async () => {
      try {
        console.log('socketServices.isConnected()', socketServices.isConnected());
        setInitializingSocket(true);
        // await socketServices.initializeSocket(userLocalData.token);
        setSocketInitialized(true);
      } catch (error) {
        console.error('Socket initialization failed:', error);
      } finally {
        setInitializingSocket(false);
      }
    };

    initializeSocket();

    return () => {
      setSocketInitialized(false);
    };
  }, [userLocalData]);

  // Load messages and setup socket listeners
  useEffect(() => {
    if (!socketInitialized || !bookingId) return;

    const loadMessages = async () => {
      try {
        setLoadingMessages(true);
        const url = `${BASE_URL}${GET_CHATS_DATA.url}${bookingId}`;
        // const url = `http://192.168.31.250:5000/api/chat/${bookingId}`;
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${userLocalData?.token}`
          },
        });
        console.warn('response loading messages:', response.data);
        
        setClientInfo(response?.data?.clientInfo);
        setDriverInfo(response?.data?.riderInfo);
        
        // Clear existing message IDs and add new ones
        messageIdRef.current.clear();
        const newMessages = response.data.messages.map((msg) => {
          messageIdRef.current.add(msg._id);
          return msg;
        });
        
        setMessages(newMessages);
        scrollToBottom();
      } catch (error) {
        console.error('Error loading messages:', error?.response);
      } finally {
        setLoadingMessages(false);
      }
    };

    // Join chat room
    socketServices.emit('joinBookingChatRoom', { bookingId });

    // Listen for new messages
    const handleReceiveMessage = (newMessage) => {
      // Check if message already exists to prevent duplicates
      if (!messageIdRef.current.has(newMessage._id)) {
        messageIdRef.current.add(newMessage._id);
        setMessages(prev => [...prev, newMessage]);
        scrollToBottom();
      }
    };

    socketServices.on('receiveMessage', handleReceiveMessage);

    loadMessages();

    return () => {
      // socketServices.off('receiveMessage', handleReceiveMessage);
    };
  }, [socketInitialized, bookingId]);

  const scrollToBottom = () => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const handleSendMessage = () => {
    if (message.trim() === '') return;

    const tempId = Date.now().toString();
    const newMessage = {
      _id: tempId,
      senderType: 'RIDER',
      bookingId,
      message,
      timestamp: new Date().toISOString()
    };

    // Optimistically update UI
    messageIdRef.current.add(tempId);
    // setMessages(prev => [...prev, newMessage]);
    setMessage('');
    scrollToBottom();

    // Emit message via socket
    socketServices.emit('sendMessage', {
      senderType: 'RIDER',
      bookingId,
      message
    });
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const renderMessage = ({ item }) => {
    const isMe = item.senderType === 'RIDER';
    const profileImage = isMe ? driverInfo?.profileImgUrl : clientInfo?.imgUrl;

    return (
      <View
        style={[
          styles.messageContainer,
          isMe ? styles.myMessageContainer : styles.otherMessageContainer
        ]}
      >
        {!isMe && profileImage && (
          <Image
            source={{ uri: profileImage }}
            style={styles.avatar}
          />
        )}
        <View
          style={[
            styles.messageBubble,
            isMe ? styles.myMessageBubble : styles.otherMessageBubble
          ]}
        >
          <Text style={[
            styles.messageText,
            isMe ? styles.myMessageText : styles.otherMessageText
          ]}>
            {item.message}
          </Text>
          <Text style={[
            styles.timeText,
            isMe ? styles.myTimeText : styles.otherTimeText
          ]}>
            {formatTime(item.timestamp)}
          </Text>
        </View>
      </View>
    );
  };

  if (initializingSocket || loadingMessages) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FFC107" />
          <Text style={styles.loadingText}>
            {initializingSocket ? "Connecting to chat..." : "Loading messages..."}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View style={styles.container}>
        {/* Custom AppBar */}
        <View style={styles.appBar}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            {/* <Image
              source={Icons.backButton}
              style={styles.backIcon}
            /> */}
            <MaterialIcons
              name="arrow-back"
              size={25}
              color={COLORS.black}
            />
          </TouchableOpacity>
          <Text style={styles.title}>{clientInfo?.name || "Chat"}</Text>
          <View style={styles.rightIconPlaceholder} />
        </View>

        <KeyboardAvoidingView
          // behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardAvoidingView}
          keyboardVerticalOffset={40}
        >
          <FlatList
            ref={flatListRef}
            data={messages}
            renderItem={renderMessage}
            keyExtractor={item => item._id}
            contentContainerStyle={styles.messageList}
            showsVerticalScrollIndicator={false}
            onContentSizeChange={scrollToBottom}
            onLayout={scrollToBottom}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No messages yet</Text>
              </View>
            }
          />

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={message}
              onChangeText={setMessage}
              placeholder="Type your message here..."
              placeholderTextColor="#999"
              multiline
              maxLength={1000}
            />

            <TouchableOpacity
              style={styles.sendButton}
              onPress={handleSendMessage}
              disabled={!message.trim()}
            >
              <Image
                source={Icons.sendMessage}
                style={[
                  styles.sendIcon,
                  message.trim() ? styles.activeSendIcon : null
                ]}
              />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#FFC107',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  appBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
  },
  backButton: {
    // padding: 8,
  },
  backIcon: {
    width: 24,
    height: 24,
    tintColor: '#000',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  rightIconPlaceholder: {
    width: 24,
    height: 24,
  },
  messageList: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    flexGrow: 1,
  },
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginVertical: 4,
  },
  myMessageContainer: {
    justifyContent: 'flex-end',
  },
  otherMessageContainer: {
    justifyContent: 'flex-start',
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 8,
    marginBottom: 8,
  },
  messageBubble: {
    maxWidth: '75%',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
  },
  myMessageBubble: {
    backgroundColor: '#FFC107',
    marginLeft: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.18,
    shadowRadius: 1,
    elevation: 1,
  },
  otherMessageBubble: {
    backgroundColor: '#F0F0F0',
    marginRight: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 1,
    elevation: 1,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
  },
  myMessageText: {
    color: '#fff',
  },
  otherMessageText: {
    color: '#2C2C2C',
  },
  timeText: {
    fontSize: 11,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  myTimeText: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
  otherTimeText: {
    color: '#888',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#E8E8E8',
    backgroundColor: '#fff',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  input: {
    flex: 1,
    backgroundColor: '#F8F8F8',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    maxHeight: 100,
    fontSize: 15,
    color: '#2C2C2C',
    marginHorizontal: 8,
    borderWidth: 0.5,
    borderColor: '#E0E0E0',
  },
  sendButton: {
    padding: 8,
    borderRadius: 20,
  },
  sendIcon: {
    width: 24,
    height: 24,
  },
  activeSendIcon: {
    tintColor: '#FFC107',
  },
});

export default ChatScreen;