import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";
import Colors from "../../res/colors";
import FavoritesEmptyState from "./FavoritesEmptyState";

class FavoritesScreen extends Component {
    render() {
        return (
            <View style={styles.container}>
                <FavoritesEmptyState/>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.charade
    }
})

export default FavoritesScreen;