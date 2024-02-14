import {
  Alert,
  Button,
  FlatList,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Entypo } from "@expo/vector-icons";
import Carousel from "react-native-snap-carousel";
import { AntDesign } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import "core-js/stable/atob";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { useRouter } from "expo-router";

const index = () => {
  const [option, setOption] = useState("AD");
  const [description, setDescription] = useState("");
  const [activeSlide, setActiveSlide] = useState(0);
  const [userId, setUserId] = useState("");
  const [selectedTurnOns, setSelectedTurnOns] = useState([]);
  const [lookingOptions, setLookingOptns] = useState([]);
  const [imageUrl, setImageUrl] = useState("");
  const [images, setImages] = useState([]);

  const router = useRouter();

  const profileImages = [
    {
      image:
        "https://images.pexels.com/photos/1042140/pexels-photo-1042140.jpeg?auto=compress&cs=tinysrgb&w=800",
    },
    {
      image:
        "https://images.pexels.com/photos/1215695/pexels-photo-1215695.jpeg?auto=compress&cs=tinysrgb&w=800",
    },
    {
      image:
        "https://images.pexels.com/photos/7580971/pexels-photo-7580971.jpeg?auto=compress&cs=tinysrgb&w=800",
    },
  ];
  const turnons = [
    {
      id: "0",
      name: "Music",
      description: "Pop Rock-Indie pick our sound track",
    },
    {
      id: "10",
      name: "Kissing",
      description:
        " It's a feeling of closeness, where every touch of lips creates a symphony of emotions.",
    },
    {
      id: "1",
      name: "Fantasies",
      description:
        "Fantasies can be deeply personal, encompassing diverse elements such as romance",
    },
    {
      id: "2",
      name: "Nibbling",
      description:
        "playful form of biting or taking small, gentle bites, typically done with the teeth",
    },
    {
      id: "3",
      name: "Desire",
      description: "powerful emotion or attainment of a particular person.",
    },
  ];
  const data = [
    {
      id: "0",
      name: "Casual",
      description: "Let's keep it easy and see where it goes",
    },
    {
      id: "1",
      name: "Long Term",
      description: "How about a one life stand",
    },
    {
      id: "2",
      name: "Virtual",
      description: "Let's have some virtual fun",
    },
    {
      id: "3",
      name: "Open for Anything",
      description: "Let's Vibe and see where it goes",
    },
  ];

  useEffect(() => {
    const fetchUser = async () => {
      const token = await AsyncStorage.getItem("auth");
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.userId;
      setUserId(userId);
    };

    fetchUser();
  }, []);

  const fetchUserDescription = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/users/${userId}`);

      const user = response.data;
      setDescription(user?.user?.description);
      setSelectedTurnOns(user?.user?.turnOns);
      setLookingOptns(user?.user?.lookingFor);
      setImages(user?.user?.profileImages);
    } catch (error) {
      console.log("Error fetching user description", error);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchUserDescription();
    }
  }, [userId]);

  const updateUserDescription = async () => {
    try {
      const response = await axios.put(
        `http://localhost:3000/users/${userId}/description`,
        { description }
      );

      if (response.status === 200) {
        Alert.alert("Success", "Description updated succesfully");
      }
    } catch (error) {
      console.log("Error updating user description");
    }
  };

  const randerImageCarousel = ({ item }) => (
    <View
      style={{ width: "100%", justifyContent: "center", alignItems: "center" }}
    >
      <Image
        style={{
          width: "85%",
          resizeMode: "cover",
          height: 290,
          borderRadius: 10,
          transform: [{ rotate: "-5deg" }],
        }}
        source={{ uri: item }}
      />
      <Text
        style={{ position: "absolute", top: 10, right: 10, color: "black" }}
      >
        {activeSlide + 1}/{images.length}
      </Text>
    </View>
  );

  const handleToggleTurnOn = (turnOn) => {
    if (selectedTurnOns.includes(turnOn)) {
      removeTurnOn(turnOn);
    } else {
      addTurnOn(turnOn);
    }
  };

  const handleOption = (lookingFor) => {
    if (lookingOptions.includes(lookingFor)) {
      removeLookingFor(lookingFor);
    } else {
      addLookingFor(lookingFor);
    }
  };

  const addTurnOn = async (turnOn) => {
    try {
      const response = await axios.put(
        `http://localhost:3000/users/${userId}/turn-ons/add`,
        { turnOn }
      );

      if (response.status === 200) {
        setSelectedTurnOns([...selectedTurnOns, turnOn]);
      }
    } catch (error) {
      console.log("Error edding turn on");
    }
  };

  const removeTurnOn = async (turnOn) => {
    try {
      const response = await axios.put(
        `http://localhost:3000/users/${userId}/turn-ons/remove`,
        { turnOn }
      );

      if (response.status === 200) {
        setSelectedTurnOns(selectedTurnOns.filter((item) => item !== turnOn));
      }
    } catch (error) {
      console.log("Error removing turn on");
    }
  };

  const addLookingFor = async (lookingFor) => {
    try {
      const response = await axios.put(
        `http://localhost:3000/users/${userId}/looking-for/add`,
        { lookingFor }
      );

      if (response.status === 200) {
        setLookingOptns([...lookingOptions, lookingFor]);
      }
    } catch (error) {
      console.log("Error edding turn on");
    }
  };

  const removeLookingFor = async (lookingFor) => {
    try {
      const response = await axios.put(
        `http://localhost:3000/users/${userId}/looking-for/remove`,
        { lookingFor }
      );

      if (response.status === 200) {
        setLookingOptns(lookingOptions.filter((item) => item !== lookingFor));
      }
    } catch (error) {
      console.log("Error removing turn on");
    }
  };

  const handleAddImage = async () => {
    try {
      console.log(imageUrl);
      const response = await axios.post(
        `http://localhost:3000/users/${userId}/profile-images`,
        {
          imageUrl,
        }
      );

      console.log(response.data);
      setImageUrl("");

      if (response.status === 200) {
      }
    } catch (error) {
      console.log("Error ");
    }
  };

  const getRandomImage = () => {
    const randomIndex = Math.floor(Math.random() * images.length);
    return images[randomIndex];
  };
  const randomImage = getRandomImage();

  const handleLogout = () => {
    AsyncStorage.removeItem("auth");
    router.replace("/(authenticate)/login");
  };

  return (
    <ScrollView>
      <View>
        <View>
          <Image
            style={{ width: "100%", height: 200, resizeMode: "cover" }}
            source={{
              uri: "https://static.vecteezy.com/system/resources/thumbnails/018/977/074/original/animated-backgrounds-with-liquid-motion-graphic-background-cool-moving-animation-for-your-background-free-video.jpg",
            }}
          />
          <View>
            <Pressable
              style={{
                padding: 10,
                backgroundColor: "#DDA0DD",
                width: 300,
                marginLeft: "auto",
                marginRight: "auto",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 10,
                position: "absolute",
                top: -60,
                left: "50%",
                transform: [{ translateX: -150 }],
              }}
            >
              <Image
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: 30,
                  resizeMode: "cover",
                }}
                source={{
                  uri: randomImage,
                }}
              />
              <Text style={{ fontSize: 16, fontWeight: "600", marginTop: 6 }}>
                Bangle
              </Text>
              <Text style={{ fontSize: 15, marginTop: 4 }}>
                22 Years 110 days
              </Text>
            </Pressable>
          </View>
        </View>
      </View>

      <View
        style={{
          marginTop: 80,
          marginHorizontal: 20,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: 25,
        }}
      >
        <Pressable onPress={() => setOption("AD")}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: "500",
              color: option === "AD" ? "black" : "gray",
            }}
          >
            AD
          </Text>
        </Pressable>
        <Pressable onPress={() => setOption("Photos")}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: "500",
              color: option === "Photos" ? "black" : "gray",
            }}
          >
            Photos
          </Text>
        </Pressable>
        <Pressable onPress={() => setOption("Turn-ons")}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: "500",
              color: option === "Turn-ons" ? "black" : "gray",
            }}
          >
            Turn-ons
          </Text>
        </Pressable>
        <Pressable onPress={() => setOption("Looking For")}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: "500",
              color: option === "Looking For" ? "black" : "gray",
            }}
          >
            Looking For
          </Text>
        </Pressable>
      </View>

      <View style={{ marginHorizontal: 14, marginVertical: 15 }}>
        {option === "AD" && (
          <View
            style={{
              borderColor: "#202020",
              borderWidth: 1,
              padding: 10,
              height: 300,
              borderRadius: 10,
            }}
          >
            <TextInput
              value={description}
              onChangeText={(text) => setDescription(text)}
              multiline
              style={{ fontSize: 17, fontFamily: "Helvetica" }}
              placeholder="Write your AD for people to like you"
            />
            <Pressable
              onPress={updateUserDescription}
              style={{
                flexDirection: "row",
                marginTop: "auto",
                alignItems: "center",
                justifyContent: "center",
                gap: 15,
                backgroundColor: "black",
                borderRadius: 5,
                padding: 10,
              }}
            >
              <Text
                style={{
                  color: "white",
                  textAlign: "center",
                  fontSize: 15,
                  fontWeight: "500",
                }}
              >
                Publish in feed
              </Text>
              <Entypo name="mask" size={24} color="white" />
            </Pressable>
          </View>
        )}
      </View>

      <View style={{ marginHorizontal: 14 }}>
        {option === "Photos" && (
          <View>
            <Carousel
              data={images}
              renderItem={randerImageCarousel}
              sliderWidth={350}
              itemWidth={300}
              onSnapToItem={(index) => setActiveSlide(index)}
            />
            <View style={{ marginTop: 25 }}>
              <Text>Add a picture of yourself</Text>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 5,
                  paddingVertical: 5,
                  borderRadius: 5,
                  marginTop: 10,
                  backgroundColor: "#dcdcdc",
                }}
              >
                <Entypo
                  style={{ marginLeft: 8 }}
                  name="image"
                  size={24}
                  color="black"
                />
                <TextInput
                  value={imageUrl}
                  onChangeText={(text) => setImageUrl(text)}
                  style={{ marginVertical: 10, width: 300, color: "gray" }}
                  placeholder="Enter your image url"
                />
              </View>
              <Button
                onPress={handleAddImage}
                style={{ marginVertical: 5 }}
                title="Add Image"
              />
            </View>
          </View>
        )}
      </View>

      <View style={{ marginHorizontal: 14 }}>
        {option == "Turn-ons" && (
          <View>
            {turnons.map((item, index) => (
              <Pressable
                onPress={() => handleToggleTurnOn(item.name)}
                style={{
                  backgroundColor: "#fffdd0",
                  padding: 10,
                  marginVertical: 10,
                }}
                key={index}
              >
                <View
                  style={{
                    marginTop: 3,
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: 4,
                  }}
                >
                  <Text
                    style={{
                      textAlign: "center",
                      fontSize: 15,
                      fontWeight: "bold",
                    }}
                  >
                    {item.name}
                  </Text>
                  {selectedTurnOns.includes(item?.name) && (
                    <AntDesign name="checkcircle" size={18} color="#17b18c" />
                  )}
                </View>
                <Text
                  style={{
                    marginTop: 4,
                    fontSize: 15,
                    color: "gray",
                    textAlign: "center",
                  }}
                >
                  {item.description}
                </Text>
              </Pressable>
            ))}
          </View>
        )}
      </View>

      <View style={{ marginHorizontal: 14 }}>
        {option === "Looking For" && (
          <>
            <View>
              <FlatList
                columnWrapperStyle={{ justifyContent: "space-between" }}
                numColumns={2}
                data={data}
                renderItem={({ item, index }) => (
                  <Pressable
                    onPress={() => handleOption(item.name)}
                    key={index}
                    style={{
                      backgroundColor: lookingOptions.includes(item?.name)
                        ? "#fd5c63"
                        : "white",
                      padding: 16,
                      justifyContent: "center",
                      alignItems: "center",
                      width: 150,
                      margin: 10,
                      borderRadius: 5,
                      borderColor: "#fd5c63",
                      borderWidth: lookingOptions.includes(item?.name)
                        ? "transparent"
                        : 0.7,
                    }}
                  >
                    <Text
                      style={{
                        textAlign: "center",
                        fontWeight: "500",
                        fontSize: 13,
                        color: lookingOptions.includes(item?.name)
                          ? "white"
                          : "black",
                      }}
                    >
                      {item.name}
                    </Text>
                    <Text
                      style={{
                        color: "gray",
                        marginTop: 10,
                        width: 140,
                        color: lookingOptions.includes(item?.name)
                          ? "white"
                          : "black",
                      }}
                    >
                      {item.description}
                    </Text>
                  </Pressable>
                )}
              ></FlatList>
            </View>
          </>
        )}
      </View>

      <View style={{ marginHorizontal: 14, marginVertical: 18 }}>
        <Pressable
          onPress={handleLogout}
          style={{
            backgroundColor: "#ecf0f1",
            padding: 10,
            borderRadius: 10,
            borderWidth: 1,
            borderColor: "#bdc3c7",
          }}
        >
          <Text
            style={{
              color: "#c0392b",
              textAlign: "center",
              fontSize: 18,
              fontWeight: "bold",
            }}
          >
            Log out
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
};

export default index;

const styles = StyleSheet.create({});
