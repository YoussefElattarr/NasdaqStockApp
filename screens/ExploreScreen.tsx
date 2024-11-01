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
  Image,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {
  loadStocks,
  loadNextStocks,
  setStatus,
  setError,
} from '../redux/stocksSlice';
import {AppDispatch, RootState} from '../redux/store';
import {fetchLogo} from '../services/api';
import {SvgUri, SvgXml} from 'react-native-svg';
const API_KEY = 'oARPp9W0dsIizpPbqh4YpM9c0oSahtVx';

const ExploreScreen = () => {
  const [query, setQuery] = useState('');
  const [loadingMore, setLoadingMore] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const {stocks, status, error, next_url} = useSelector(
    (state: RootState) => state.stocks,
  );
  const [logos, setLogos] = useState<{[composite_figi: string]: string | null}>(
    {},
  );

  useEffect(() => {
    dispatch(loadStocks(query));
  }, [query]);

  const handlePress = async (ticker: string, composite_figi: string) => {
    try {
      if (!logos[composite_figi]) {
        const logoUri = await fetchLogo(ticker);
        console.log('logo: ' + logoUri);
        setLogos(prevLogos => ({...prevLogos, [composite_figi]: logoUri}));
      }
    } catch (error: any) {
      dispatch(setStatus('failed'));
      dispatch(setError(error.messsage));
    }
  };

  const renderStockItem = ({
    item,
  }: {
    item: {ticker: string; name: string; composite_figi: string; logo: string};
  }) => {
    return (
      <TouchableOpacity
        onPress={() => handlePress(item.ticker, item.composite_figi)}
        style={styles.stockItem}>
        {logos[item.composite_figi] && logos[item.composite_figi] !== 'NA' ? (
          (logos[item.composite_figi] as string).slice(-3) === 'svg' ? (
            <SvgUri
              style={styles.logo}
              uri={logos[item.composite_figi] + `?apiKey=${API_KEY}`}
              width="50%"
              height="50%"
              onError={(error: any) => {
                console.log(error)
              }}
            />
          ) : (
            <Image
              source={{
                uri: (logos[item.composite_figi] +
                  `?apiKey=${API_KEY}`) as string,
              }}
              style={styles.logo}
              onError={() => {
                console.log(error)
              }}
            />
          )
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

  const onEndReachedHandler = () => {
    if (next_url && !loadingMore) {
      setLoadingMore(true); // Set loadingMore to true to prevent duplicate requests
      dispatch(loadNextStocks(next_url as string)).finally(() => {
        setLoadingMore(false); // Reset loadingMore once loadNextStocks completes
      });
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
      {status === 'failed' && (
        <View style={styles.errorBar}>
          <Text style={styles.errorText}>Error: {error}</Text>
        </View>
      )}
      <FlatList
        contentContainerStyle={{
          alignItems: 'center',
          justifyContent: 'space-evenly',
          alignContent: 'space-around',
        }}
        data={stocks}
        renderItem={renderStockItem}
        keyExtractor={item => item.composite_figi}
        numColumns={2}
        onEndReachedThreshold={0.5}
        onEndReached={onEndReachedHandler} // Pagination handling
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
    height: (Dimensions.get('window').height - 50) / 3.5,
  },
  stockSymbol: {fontSize: 18, color: '#fff', fontWeight: 'bold'},
  stockName: {fontSize: 14, color: '#bbb'},
  logo: {
    // width: '10%',
    // height: '10%',
    borderRadius: 2,
    marginBottom: 10,
  },
  logoPng: {
    // width: '10%',
    // height: '10%',
    borderRadius: 2,
    marginBottom: 10,
    width: '50%',
    height: '50%',
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
  errorBar: {
    backgroundColor: '#ff4d4d',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  errorText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default ExploreScreen;
