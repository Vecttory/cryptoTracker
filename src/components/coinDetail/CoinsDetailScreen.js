import React, { Component } from "react";
import { View, Text, Image, StyleSheet, SectionList, FlatList, Pressable, Alert } from 'react-native';
import Colors from '../../res/colors'
import Http from '../../libs/http'
import CoinMarketItem from "./CoinMarketItem";
import Storage from "../../libs/storage";

class CoinDetailScreen extends Component {

    state = {
        coin: {},
        markets: [],
        isFavorite: false
    }

    componentDidMount() {
        const { coin } = this.props.route.params;
        const { setOptions } = this.props.navigation;

        setOptions({ title: coin.symbol });

        this.getMarkets(coin.id);

        this.setState({ coin }, () => {
            this.getFavorite();
        })
    }

    getSymbolIcon = nameStr => {

        if (nameStr) {
            const symbol = nameStr.toLowerCase().replace(" ", "-");
            return `https://c1.coinlore.com/img/25x25/${symbol}.png`;
        }

    }

    getSections = coin => {

        const sections = [
            {
                title: "Market cap",
                data: [coin.market_cap_usd]
            },
            {
                title: "Volume 24h",
                data: [coin.volume24, "hello Vetto"]
            },
            {
                title: "Change 24h",
                data: [coin.percent_change_24h]
            }
        ];

        return sections;
    }

    getMarkets = async coinId => {
        const url = `https://api.coinlore.net/api/coin/markets/?id=${coinId}`;

        const markets = await Http.instance.get(url);

        this.setState({ markets });
    }

    toggleFavorite = () => {
        if (this.state.isFavorite) {
            this.removeFavorite();
        } else {
            this.addFavorite();
        }
    }

    addFavorite = async () => {
        const coin = JSON.stringify(this.state.coin);
        const key = `favorite-coin-${this.state.coin.id}`;

        const stored = await Storage.instance.store(key, coin);

        if (stored) {
            this.setState({ isFavorite: true });
        }
    }

    getFavorite = async () => {

        try {
            const key = `favorite-coin-${this.state.coin.id}`;

            const favStr = await Storage.instance.get(key);

            if (favStr != null) {
                this.setState({ isFavorite: true })
            }

        } catch (error) {
            console.log("get favorites error: ", error);
        }

    }

    removeFavorite = async () => {

        Alert.alert("Remove favorite", "Are you sure?", [
            {
                text: "Cancel",
                style: "cancel",
                onPress: () => {}
            },
            {
                text: "Remove",
                style: "destructive",
                onPress: async () => {
                    const key = `favorite-coin-${this.state.coin.id}`;

                    await Storage.instance.remove(key);

                    this.setState({ isFavorite: false });
                }
            }
        ])
        
    }

    render() {

        const { coin, markets, isFavorite } = this.state;

        return (
            <View style={styles.container}>
                <View style={styles.subHeader}>
                    <View style={[styles.row, styles.coinBaseWrapper]}>
                        <Image style={styles.iconImg} source={{ uri: this.getSymbolIcon(coin.name)}} />
                        <Text style={styles.titleText}>{coin.name}</Text>
                    </View>

                    <Pressable
                        onPress={this.toggleFavorite}
                        style={[
                            styles.btnFavorite,
                            isFavorite ?
                            styles.btnFavoriteRemove :
                            styles.btnFavoriteAdd,
                        ]
                    }>
                        <Text style={styles.btnFavoriteText}>{isFavorite ? "Remove favorite" : "Add favorite"}</Text>
                    </Pressable>
                </View>
                <SectionList
                    style={styles.section}
                    keyExtractor={(item) => item}
                    sections={this.getSections(coin)}
                    renderItem={({ item }) => 
                        <View style={styles.sectionItem}>
                            <Text style={styles.itemText}>{item}</Text>
                        </View>
                    }
                    renderSectionHeader={({ section }) => 
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionText}>{section.title}</Text>
                        </View>
                    }
                />

                <Text style={styles.marketTitle}>Markets</Text>
                <FlatList
                    style={styles.list}
                    data={markets}
                    horizontal={true}
                    renderItem={({ item }) => <CoinMarketItem item={item} />}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.charade
    },
    subHeader: {
        backgroundColor: "rgba(0,0,0,0.1)",
        padding: 16,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    },
    row: {
        flexDirection: "row"
    },
    coinBaseWrapper:{
        alignItems: "center"
    },
    titleText: {
        fontSize: 16,
        fontWeight: "bold",
        color: Colors.white,
        marginLeft: 8
    },
    iconImg: {
        width: 25,
        height: 25
    },
    section: {
        maxHeight: 230
    },
    marketTitle: {
        color: Colors.white,
        fontSize: 16,
        marginLeft: 16,
        marginTop: 10,
        marginBottom: 16,
        fontWeight: "bold"
    },
    list: {
        maxHeight: 100,
        paddingLeft: 16
    },
    sectionHeader: {
        backgroundColor: "rgba(0,0,0,0.2)",
        padding: 8
    },
    sectionItem: {
        padding: 8
    },
    itemText: {
        color: Colors.white,
        fontSize: 14
    },
    sectionText: {
        color: Colors.white,
        fontSize: 14,
        fontWeight: "bold"
    },
    btnFavoriteText: {
        color: Colors.white
    },
    btnFavorite: {
        padding: 8,
        borderRadius: 8,
    },
    btnFavoriteAdd: {
        backgroundColor: Colors.picton,
    },
    btnFavoriteRemove: {
        backgroundColor: Colors.carmine,
    }
})

export default CoinDetailScreen;