import {
  Image,
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import React, { useEffect, useLayoutEffect, useState } from "react";
import axios from "axios";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Entypo, Feather } from "@expo/vector-icons";
import { io } from "socket.io-client";

const chatroom = () => {
  const navigation = useNavigation();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const params = useLocalSearchParams();
  const socket = io("http://localhost:8000");

  socket.on("connect", () => console.log("sockey io connected"));
  socket.on("receiverMessage", (newMessage) => {
    console.log("New Message", newMessage);
    setMessages((prevMessages) => [...prevMessages, newMessage]);
  });
  const sendMessage = async (senderId, receiverId) => {
    socket.emit("sendMessage", { senderId, receiverId, message });

    setMessage("");
    setTimeout(() => {
      fetchMessages();
    }, 200);
  };
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "",
      headerLeft: () => (
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <Ionicons name="arrow-back" size={24} color="black" />
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            {params?.image ? (
              <>
                <Image
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 15,
                    resizeMode: "cover",
                  }}
                  source={{ uri: params?.image }}
                />
                <Text style={{ fontSize: 15, fontWeight: "bold" }}>
                  {params?.name}
                </Text>
              </>
            ) : (
              <>
                <View
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 15,
                    backgroundColor: "#ecf0f1",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text style={{ fontSize: 18, fontWeight: "bold" }}>
                    {params?.name.substr(0, 1)}
                  </Text>
                </View>
                <Text style={{ fontSize: 15, fontWeight: "bold" }}>
                  {params?.name}
                </Text>
              </>
            )}
          </View>
        </View>
      ),
      headerRight: () => (
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <MaterialCommunityIcons
            name="dots-vertical"
            size={24}
            color="black"
          />
          <Ionicons name="videocam-outline" size={24} color="black" />
        </View>
      ),
    });
  }, []);

  const fetchMessages = async () => {
    try {
      const senderId = params?.senderId;
      const receiverId = params?.receiverId;

      const response = await axios.get("http://localhost:3000/messages", {
        params: { senderId, receiverId },
      });

      setMessages(response.data);
    } catch (error) {
      console.log("Error fetching the messages", error);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  console.log("messages", messages);

  const formatTime = (time) => {
    const options = { hour: "numeric", minute: "numeric" };
    return new Date(time).toLocaleString("en-US", options);
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: "white" }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {messages.map((item, index) => (
          <Pressable
            style={[
              item?.senderId === params?.senderId
                ? {
                    alignSelf: "flex-end",
                    backgroundColor: "#f08080",
                    padding: 8,
                    maxWidth: "60%",
                    borderRadius: 7,
                    margin: 10,
                  }
                : {
                    alignSelf: "flex-start",
                    backgroundColor: "#db7093",
                    padding: 8,
                    maxWidth: "60%",
                    borderRadius: 7,
                    margin: 10,
                  },
            ]}
          >
            <Text
              style={{
                fontSize: 13,
                textAlign: "left",
                color: "white",
                fontWeight: 500,
              }}
            >
              {item?.message}
            </Text>
            <Text
              style={{
                fontSize: 9,
                textAlign: "right",
                color: "#f0f0f0",
                marginTop: 5,
              }}
            >
              {formatTime(item?.timestamp)}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 10,
          paddingVertical: 10,
          borderTopWidth: 1,
          borderTopColor: "#dddddd",
          marginBottom: 1,
        }}
      >
        <Entypo
          style={{ marginRight: 7 }}
          name="emoji-happy"
          size={24}
          color="gray"
        />
        <TextInput
          value={message}
          onChangeText={(text) => setMessage(text)}
          style={{
            flex: 1,
            height: 40,
            borderWidth: 1,
            borderColor: "#dddddd",
            borderRadius: 20,
            padding: 10,
          }}
          placeholder="Type your message..."
        />
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
            marginHorizontal: 8,
          }}
        >
          <Entypo name="camera" size={24} color="gray" />

          <Feather name="mic" size={24} color="gray" />
        </View>
        <Pressable
          onPress={() => sendMessage(params?.senderId, params?.receiverId)}
          style={{
            backgroundColor: "#007bff",
            paddingHorizontal: 12,
            paddingVertical: 8,
            borderRadius: 20,
          }}
        >
          <Text style={{ textAlign: "center", color: "white" }}>Send</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
};

export default chatroom;

const styles = StyleSheet.create({});
