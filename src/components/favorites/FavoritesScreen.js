import React, { Component } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import Colors from "../../res/colors";
import FavoritesEmptyState from "./FavoritesEmptyState";
import Storage from "../../libs/storage";
import CoinsItem from "../coins/CoinsItem"

class FavoritesScreen extends Component {

    state = {
        favorites: []
    }

    componentDidMount() {
        const { addListener } = this.props.navigation;

        this.getFavorites();
        
        addListener("focus", this.getFavorites);
    }

    componentWillUnmount() {
        const { removeListener } = this.props.navigation;
        removeListener("focus", this.getFavorites);
    }

    getFavorites = async () => {
        try {
            const allKeys = await Storage.instance.getAllKeys();

            const keys = allKeys.filter(key => key.includes("favorite-coin-"));

            const favs = await Storage.instance.multiGet(keys);

            const favorites = favs.map(fav => JSON.parse(fav[1]));

            console.log("favs:", favorites);

            this.setState({ favorites })

        } catch (error) {
            console.log("Error in get all keys:", error);
        }
    }

    handlePress = coin => {
        const { navigate } = this.props.navigation;

        navigate("CoinDetail", { coin });
    }

    render() {

        const { favorites } = this.state;

        return (
            <View style={styles.container}>
                {
                    !favorites.length ?
                        <FavoritesEmptyState/>
                    :
                        <FlatList 
                            data={favorites}
                            renderItem={({ item }) => (
                                <CoinsItem item={item} onPress={() => this.handlePress(item)}/>
                            )}
                        />
                }

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