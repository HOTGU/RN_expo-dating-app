import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import { useRouter } from "expo-router";

const UserChat = ({ item, userId }) => {
  const router = useRouter();
  console.log(userId);
  return (
    <Pressable
      onPress={() => {
        router.push({
          pathname: "/chat/chatroom",
          params: {
            images: item?.profileImages[0],
            name: item?.name,
            receiverId: item?._id,
            senderId: userId,
          },
        });
      }}
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        marginVertical: 12,
      }}
    >
      <View>
        {item.profileImages[0] ? (
          <Image
            style={{ width: 60, height: 60, borderRadius: 35 }}
            source={{ uri: item?.profileImages[0] }}
          />
        ) : (
          <View
            style={{
              width: 60,
              height: 60,
              borderRadius: 35,
              backgroundColor: "#ecf0f1",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ fontSize: 24, fontWeight: "bold" }}>
              {item?.name.substr(0, 1)}
            </Text>
          </View>
        )}
      </View>

      <View>
        <Text
          style={{
            fontWeight: "500",
            color: "#de3163",
            fontSize: 16,
            fontFamily: "Kailasa",
          }}
        >
          {item?.name}
        </Text>
        <Text style={{ fontSize: 15, fontWeight: "500", marginTop: 6 }}>
          Start the chat with {item?.name}
        </Text>
      </View>
    </Pressable>
  );
};

export default UserChat;

const styles = StyleSheet.create({});
