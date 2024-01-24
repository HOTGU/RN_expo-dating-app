import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  Pressable,
  TextInput,
  KeyboardAvoidingView,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import axios from "axios";

const register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleRegister = async () => {
    const user = {
      name,
      email,
      password,
    };

    axios
      .post("http://localhost:3000/register", user)
      .then((response) => {
        console.log(response);
        Alert.alert(
          "Resistration Succesfull",
          "you have been registerd successfully"
        );
        setEmail("");
        setName("");
        setPassword("");
      })
      .catch((error) => {
        console.log("error while registering the user", error.response.data);
        Alert.alert(
          "Registration failed",
          "An error occurred during registration"
        );
      });
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "white", alignItems: "center" }}
    >
      <View style={{ height: 200, backgroundColor: "pink", width: "100%" }}>
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            marginTop: 25,
          }}
        >
          <Image
            style={{ width: 150, height: 80, resizeMode: "contain" }}
            source={{
              uri: "https://cdn-icons-png.flaticon.com/128/6655/6655045.png",
            }}
          />
        </View>
        <Text
          style={{
            marginTop: 20,
            fontSize: 20,
            textAlign: "center",
            fontFamily: "GillSans-SemiBold",
          }}
        >
          Match Mate
        </Text>
      </View>

      <KeyboardAvoidingView>
        <View style={{ alignItems: "center" }}>
          <Text
            style={{
              fontSize: 17,
              fontWeight: "bold",
              marginTop: 25,
              color: "#f9629f",
            }}
          >
            Register to your Account
          </Text>
        </View>

        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            marginTop: 20,
          }}
        >
          <Image
            style={{ resizeMode: "cover", width: 100, height: 80 }}
            source={{
              uri: "https://cdn-icons-png.flaticon.com/128/2509/2509078.png",
            }}
          />
        </View>

        <View style={{ marginTop: 30 }}>
          <View style={{ marginTop: 20 }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 5,
                backgroundColor: "#ffc0cb",
                paddingVertical: 5,
                borderRadius: 5,
              }}
            >
              <Ionicons
                name="person-sharp"
                size={24}
                color="white"
                style={{ marginLeft: 8 }}
              />

              <TextInput
                value={name}
                onChangeText={(text) => setName(text)}
                placeholder="Enter your name"
                placeholderTextColor={"white"}
                autoCapitalize="none"
                style={{
                  color: "white",
                  marginVertical: 10,
                  width: 300,
                  fontSize: 17,
                }}
              />
            </View>
          </View>

          <View style={{ marginTop: 20 }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 5,
                backgroundColor: "#ffc0cb",
                paddingVertical: 5,
                borderRadius: 5,
              }}
            >
              <MaterialCommunityIcons
                name="email"
                size={24}
                color="white"
                style={{ marginLeft: 8 }}
              />
              <TextInput
                value={email}
                onChangeText={(text) => setEmail(text)}
                placeholder="Email your email"
                autoCapitalize="none"
                placeholderTextColor={"white"}
                style={{
                  color: "white",
                  marginVertical: 10,
                  width: 300,
                  fontSize: 17,
                }}
              />
            </View>
          </View>

          <View style={{ marginTop: 20 }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 5,
                backgroundColor: "#ffc0cb",
                paddingVertical: 5,
                borderRadius: 5,
              }}
            >
              <AntDesign
                style={{ marginLeft: 8 }}
                name="lock1"
                size={24}
                color="white"
              />
              <TextInput
                value={password}
                onChangeText={(text) => setPassword(text)}
                secureTextEntry
                placeholder="Enter your password"
                autoCapitalize="none"
                placeholderTextColor={"white"}
                style={{
                  color: "white",
                  marginVertical: 10,
                  width: 300,
                  fontSize: 17,
                }}
              />
            </View>
          </View>

          <View style={{ marginTop: 50 }} />

          <Pressable
            onPress={handleRegister}
            style={{
              width: 200,
              backgroundColor: "#ffc0cb",
              borderRadius: 6,
              marginLeft: "auto",
              marginRight: "auto",
              padding: 10,
            }}
          >
            <Text
              style={{
                textAlign: "center",
                color: "white",
                fontSize: 20,
                fontWeight: "bold",
              }}
            >
              Register
            </Text>
          </Pressable>

          <Pressable
            onPress={() => router.replace("/login")}
            style={{ marginTop: 12 }}
          >
            <Text style={{ textAlign: "center", color: "gray", fontSize: 16 }}>
              Already have an account?
            </Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default register;

const styles = StyleSheet.create({});
