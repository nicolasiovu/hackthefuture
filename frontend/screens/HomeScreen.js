import React from "react";
import { StyleSheet, Text, View, SafeAreaView, Image } from "react-native";
import tw from "twrnc";

const HomeScreen = () => {
    return (
        <SafeAreaView style={tw`bg-sky-200 h-full`}>
            <View style={tw`p-5`}>
                <Text>Welcome to Returns app!</Text>
            </View>
        </SafeAreaView>
    );
}

export default HomeScreen;
