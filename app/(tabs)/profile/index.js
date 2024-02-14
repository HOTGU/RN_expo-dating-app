import { FlatList, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import axios from "axios";

import AsyncStorage from "@react-native-async-storage/async-storage";
import "core-js/stable/atob";
import { jwtDecode } from "jwt-decode";
import Profile from "../../components/Profile";

const index = () => {
  const [userId, setUserId] = useState("");
  const [user, setUser] = useState();
  const [profiles, setProfiles] = useState([]);

  console.log("profiles", profiles);

  useEffect(() => {
    const fetchUser = async () => {
      const token = await AsyncStorage.getItem("auth");
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.userId;
      setUserId(userId);
    };

    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/users/${userId}`);
      const user = response.data?.user;
      setUser(user);
    } catch (error) {
      console.log("Error fetching user", error);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchUser();
    }
  }, [userId]);

  const fetchProfiles = async () => {
    try {
      const response = await axios.get("http://localhost:3000/profiles", {
        params: {
          userId,
          gender: user?.gender,
          turnOns: user?.trunOns,
          lookingFor: user?.lookingFor,
        },
      });

      setProfiles(response.data.profiles);
    } catch (error) {
      console.log("Error fetching profiles", error);
    }
  };

  useEffect(() => {
    if (userId && user) {
      console.log("hello");
      fetchProfiles();
    }
  }, [userId, user]);

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={profiles}
        renderItem={({ item, index }) => (
          <Profile
            key={index}
            item={item}
            userId={userId}
            setProfiles={setProfiles}
            isEven={index % 2 === 0}
          />
        )}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

export default index;

const styles = StyleSheet.create({});
