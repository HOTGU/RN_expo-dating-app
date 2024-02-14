import { Pressable, StyleSheet, Text, View } from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { useFocusEffect, useRouter } from "expo-router";
import UserChat from "../../components/UserChat";

const index = () => {
  const [userId, setUserId] = useState("");
  const [profiles, setProfiles] = useState([]);
  const [matches, setMatches] = useState([]);
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

  const fetchReceivedLikesDetails = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/received-likes/${userId}/details`
      );

      const receivedLikesDetails = response.data.receivedLikesArray;

      setProfiles(receivedLikesDetails);
    } catch (error) {
      console.log("Error fetching details", error);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchReceivedLikesDetails();
    }
  }, [userId]);

  const fetchUserMatches = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/users/${userId}/matches`
      );

      const userMatches = response.data.matches;
      setMatches(userMatches);
    } catch (error) {
      console.log("Error", error);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchUserMatches();
    }
  }, [userId]);

  useFocusEffect(
    useCallback(() => {
      if (userId) {
        fetchUserMatches();
      }
    }, [])
  );

  console.log(matches);

  return (
    <View style={{ backgroundColor: "white", flex: 1, padding: 10 }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Text style={{ fontSize: 20, fontWeight: "bold" }}>CHATS</Text>
        <Ionicons name="chatbox-ellipses-outline" size={24} color="black" />
      </View>
      <Pressable
        onPress={() => {
          router.push({
            pathname: "/chat/select",
            params: {
              userId,
              profiles: JSON.stringify(profiles),
            },
          });
        }}
        style={{
          marginVertical: 12,
          flexDirection: "row",
          gap: 4,
          alignItems: "center",
        }}
      >
        <View
          style={{
            width: 50,
            height: 50,
            borderRadius: 25,
            backgroundColor: "#e0e0e0",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <AntDesign name="hearto" size={24} color="black" />
        </View>
        <Text
          style={{ marginLeft: 8, fontWeight: "500", fontSize: 17, flex: 1 }}
        >
          You have got {profiles.length} likes
        </Text>
        <MaterialIcons name="keyboard-arrow-right" size={24} color="black" />
      </Pressable>

      <View>
        {matches.map((item, index) => (
          <UserChat key={index} item={item} userId={item._id} />
        ))}
      </View>
    </View>
  );
};

export default index;

const styles = StyleSheet.create({});
