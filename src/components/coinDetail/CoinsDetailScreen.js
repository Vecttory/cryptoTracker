import React, { Component } from "react";
import { View, Text, Image, StyleSheet, SectionList, FlatList } from 'react-native';
import Colors from '../../res/colors'
import Http from '../../libs/http'
import CoinMarketItem from "./CoinMarketItem";

class CoinDetailScreen extends Component {

    state = {
        coin: {},
        markets: []
    }

    componentDidMount() {
        const { coin } = this.props.route.params;
        const { setOptions } = this.props.navigation;

        setOptions({ title: coin.symbol });

        this.getMarkets(coin.id);

        this.setState({ coin })
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

    render() {

        const { coin, markets } = this.state;

        return (
            <View style={styles.container}>
                <View style={styles.subHeader}>
                    <Image style={styles.iconImg} source={{ uri: this.getSymbolIcon(coin.name)}} />
                    <Text style={styles.titleText}>{coin.name}</Text>
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
    }
})

export default CoinDetailScreen;