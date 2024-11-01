import React, {useEffect, useState} from 'react';
import {
  View,
  TextInput,
  FlatList,
  Text,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {loadStocks, loadNextStocks} from '../redux/stocksSlice';
import {AppDispatch, RootState} from '../redux/store';
import {fetchLogo} from '../services/api';
import {SvgUri} from 'react-native-svg';

const ExploreScreen = () => {
  const [query, setQuery] = useState('');
  const dispatch = useDispatch<AppDispatch>();
  const {stocks, status, error, next_url} = useSelector(
    (state: RootState) => state.stocks,
  );
  const [logos, setLogos] = useState<{[ticker: string]: string | null}>({});

  useEffect(() => {
    dispatch(loadStocks(query));
  }, [query]);

  const handlePress = async (ticker: string) => {
    if (!logos[ticker]) {
      const logoUrl = await fetchLogo(ticker);
      console.log('logo: ' + logoUrl);
      setLogos(prevLogos => ({...prevLogos, [ticker]: logoUrl}));
    }
  };

  const renderStockItem = ({item}: {item: {ticker: string; name: string}}) => {
    // loadLogo(item.ticker);

    // console.log('logooo: ' + logos[item.ticker]);
    return (
      <TouchableOpacity
        onPress={() => handlePress(item.ticker)}
        style={styles.stockItem}>
        {logos[item.ticker] && logos[item.ticker] !== 'NA' ? (
          // <Image
          //   source={{uri: logos[item.ticker] as string}}
          //   style={styles.logo}
          // />
          <SvgUri
            style={styles.logo}
            uri={logos[item.ticker]}
            width="50%"
            height="50%"
          />
        ) : (
          <View style={styles.placeholderLogo}>
            <Text style={styles.placeholderText}>{item.ticker[0]}</Text>
          </View>
        )}
        <Text style={styles.stockSymbol}>{item.ticker}</Text>
        <Text style={styles.stockName}>{item.name.slice(0, 15)}</Text>
      </TouchableOpacity>
    );
  };

  const loadLogo = async (ticker: string) => {
    if (!logos[ticker]) {
      const logoUrl = await fetchLogo(ticker);
      console.log('logo: ' + logoUrl);
      setLogos(prevLogos => ({...prevLogos, [ticker]: logoUrl}));
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search for stocks"
        placeholderTextColor="#53566a"
        value={query}
        onChangeText={setQuery}
      />
      {status === 'loading' && (
        <ActivityIndicator size="large" color="#0000ff" />
      )}
      {status === 'failed' && <Text>Error: {error}</Text>}
      <FlatList
        contentContainerStyle={{
          alignItems: 'center',
          justifyContent: 'space-evenly',
          alignContent: 'space-around',
        }}
        data={stocks}
        renderItem={renderStockItem}
        keyExtractor={item => item.cik}
        numColumns={2}
        onEndReachedThreshold={0.9}
        onEndReached={() => {
          if (next_url) dispatch(loadNextStocks(next_url as string));
        }} // Pagination handling
        // style={styles.flatList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1f2130',
    padding: 16,
  },
  searchInput: {
    backgroundColor: '#23263a',
    borderRadius: 20,
    // borderColor: "#c7c8d4",
    // borderWidth: 1,
    padding: 10,
    color: '#fff',
    marginBottom: 16,
  },
  flatList: {
    padding: 10,
    // flex:1,  // Flatlist column
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  stockItem: {
    backgroundColor: '#23263a',
    // borderRadius: 8,
    // padding: 16,
    // marginVertical: 8,
    // marginRight: 8,
    // alignItems: 'center',
    // justifyContent: 'center',
    // flex: 1,
    // margin: 1,
    // width: Dimensions.get('window').width / 2.3
    // flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    margin: 5,
    borderRadius: 15,
    // borderColor: '#c7c8d4',
    // borderWidth:0.5,
    width: (Dimensions.get('window').width - 50) / 2,
    height: (Dimensions.get('window').height - 50) / 3,
  },
  stockSymbol: {fontSize: 18, color: '#fff', fontWeight: 'bold'},
  stockName: {fontSize: 14, color: '#bbb'},
  logo: {
    // width: '10%',
    // height: '10%',
    borderRadius: 2,
    marginBottom: 10,
  },
  placeholderLogo: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#333',
    alignItems: 'center',
    justifyContent: 'center',
    // marginRight: 12,
  },
  placeholderText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default ExploreScreen;
