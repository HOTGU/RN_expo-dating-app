import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import "core-js/stable/atob";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "expo-router";
const select = () => {
  const [option, setOption] = useState("");
  const [userId, setUserId] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const token = await AsyncStorage.getItem("auth");
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.userId;
      setUserId(userId);
    };

    fetchUser();
  }, []);

  const updateUserGender = async () => {
    try {
      const response = await axios.put(
        `http://localhost:3000/users/${userId}/gender`,
        { gender: option }
      );

      if (response.status === 200) {
        router.replace("/(tabs)/bio");
      }
    } catch (error) {
      console.log("Error updating user gender", error);
    }
  };

  return (
    <View style={{ flex: 1, gap: 25, backgroundColor: "white", padding: 12 }}>
      <Pressable
        onPress={() => setOption("male")}
        style={{
          backgroundColor: "#f0f0f0",
          padding: 12,
          justifyContent: "space-between",
          flexDirection: "row",
          alignItems: "center",
          borderRadius: 5,

          borderColor: option == "male" ? "#D0D0D0" : "transparent",
          borderWidth: option == "male" ? 1 : 0,
        }}
      >
        <Text style={{ fontSize: 16, fontWeight: "500" }}>I am a Man</Text>
        <Image
          style={{ width: 50, height: 50 }}
          source={{
            uri: "https://cdn-icons-png.flaticon.com/128/12442/12442425.png",
          }}
        />
      </Pressable>
      <Pressable
        onPress={() => setOption("female")}
        style={{
          backgroundColor: "#f0f0f0",
          padding: 12,
          justifyContent: "space-between",
          flexDirection: "row",
          alignItems: "center",
          borderRadius: 5,

          borderColor: option == "female" ? "#D0D0D0" : "transparent",
          borderWidth: option == "female" ? 1 : 0,
        }}
      >
        <Text style={{ fontSize: 16, fontWeight: "500" }}>I am a W omen</Text>
        <Image
          style={{ width: 50, height: 50 }}
          source={{
            uri: "https://cdn-icons-png.flaticon.com/128/9844/9844179.png",
          }}
        />
      </Pressable>
      <Pressable
        onPress={() => setOption("nonbinary")}
        style={{
          backgroundColor: "#f0f0f0",
          padding: 12,
          justifyContent: "space-between",
          flexDirection: "row",
          alignItems: "center",
          borderRadius: 5,

          borderColor: option == "nonbinary" ? "#D0D0D0" : "transparent",
          borderWidth: option == "nonbinary" ? 1 : 0,
        }}
      >
        <Text style={{ fontSize: 16, fontWeight: "500" }}>
          I am a Non-Binary
        </Text>
        <Image
          style={{ width: 50, height: 50 }}
          source={{
            uri: "https://cdn-icons-png.flaticon.com/128/12442/12442425.png",
          }}
        />
      </Pressable>

      {option && (
        <Pressable
          onPress={updateUserGender}
          style={{
            marginTop: 25,
            backgroundColor: "black",
            padding: 12,
            borderRadius: 4,
          }}
        >
          <Text
            style={{ textAlign: "center", color: "white", fontWeight: "600" }}
          >
            Done
          </Text>
        </Pressable>
      )}
    </View>
  );
};

export default select;

const styles = StyleSheet.create({});
