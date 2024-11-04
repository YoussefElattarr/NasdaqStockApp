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
import {SvgUri} from 'react-native-svg';
import secrets from '../secrets';

const API_KEY = secrets.API_KEY;

const ExploreScreen = () => {
  const [query, setQuery] = useState('');
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const {stocks, status, error, next_url} = useSelector(
    (state: RootState) => state.stocks,
  );
  const [logos, setLogos] = useState<{[composite_figi: string]: string | null}>(
    {},
  );

  //Update stocks when refreshing or when query is inputed
  useEffect(() => {
    dispatch(loadStocks(query));
    setRefreshing(false);
  }, [query, refreshing]);

  //Handle press on stock item to show logo
  const handlePress = async (ticker: string, composite_figi: string) => {
    try {
      //If we don't already have a link to the logo
      if (!logos[composite_figi]) {
        const logoUri = await fetchLogo(ticker);
        setLogos(prevLogos => ({...prevLogos, [composite_figi]: logoUri}));
      }
    } catch (error: any) {
      dispatch(setStatus('failed'));
      dispatch(setError(error.messsage));
    }
  };

  //Stock Item
  const renderStockItem = ({
    item,
  }: {
    item: {ticker: string; name: string; composite_figi: string; logo: string};
  }) => {
    return (
      // Touchable to be able to touch to display logo
      <TouchableOpacity
        accessibilityLabel="stockItem"
        onPress={() => handlePress(item.ticker, item.composite_figi)}
        style={[
          styles.stockItem,
          {
            width: (Dimensions.get('window').width - 50) / 2,
            height: (Dimensions.get('window').width - 50) / 2,
          },
        ]}>
        {/* If Logo exists and not "NA", display it*/}
        {logos[item.composite_figi] && logos[item.composite_figi] !== 'NA' ? (
          // Check either the image is svg or png
          (logos[item.composite_figi] as string).slice(-3) === 'svg' ? (
            // If svg
            <SvgUri
              style={styles.logo}
              uri={logos[item.composite_figi] + `?apiKey=${API_KEY}`}
              width="50%"
              height="50%"
              onError={(error: any) => {
                console.log(error);
              }}
            />
          ) : (
            // If png
            <Image
              source={{
                uri: (logos[item.composite_figi] +
                  `?apiKey=${API_KEY}`) as string,
              }}
              style={styles.logo}
              onError={() => {
                console.log(error);
              }}
            />
          )
        ) : (
          // If logo is not available, show initials
          <View style={styles.placeholderLogo}>
            <Text
              accessibilityLabel="stockItemlogoInitials"
              style={styles.placeholderText}>
              {item.ticker[0]}
            </Text>
          </View>
        )}
        <Text accessibilityLabel="stockItemTicker" style={styles.stockSymbol}>
          {item.ticker}
        </Text>
        <Text accessibilityLabel="stockItemName" style={styles.stockName}>
          {item.name.slice(0, 15)}
        </Text>
      </TouchableOpacity>
    );
  };

  // Handle fetching next stocks batch
  const onEndReachedHandler = () => {
    if (next_url && !loadingMore) {
      setLoadingMore(true); // Set loadingMore to true to prevent duplicate requests
      dispatch(loadNextStocks(next_url as string)).finally(() => {
        setLoadingMore(false);
      });
    }
  };

  return (
    <View style={styles.container}>
      {/* Search box */}
      <TextInput
        accessibilityLabel="searchInput"
        style={styles.searchInput}
        placeholder="Search for stocks"
        placeholderTextColor="#53566a"
        value={query}
        onChangeText={setQuery}
      />
      {/* Show loading indicator if loading stocks */}
      {status === 'loading' && (
        <ActivityIndicator
          accessibilityLabel="loading"
          size="large"
          color="#0000ff"
        />
      )}
      {/* Show error message if failure */}
      {status === 'failed' && (
        <View style={styles.errorBar}>
          <Text accessibilityLabel="errorMessage" style={styles.errorText}>
            Error: {error && error !== ''? error: "Something went wrong"}
          </Text>
        </View>
      )}
      {/* Flatlist to display all stocks */}
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
        onRefresh={() => {
          setRefreshing(true);
        }}
        refreshing={refreshing}
        accessibilityLabel="flatlist"
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
    padding: 10,
    color: '#fff',
    marginBottom: 16,
  },
  flatList: {
    padding: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  stockItem: {
    backgroundColor: '#23263a',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    margin: 5,
    borderRadius: 15,
  },
  stockSymbol: {fontSize: 18, color: '#fff', fontWeight: 'bold'},
  stockName: {fontSize: 14, color: '#bbb'},
  logo: {
    borderRadius: 2,
    marginBottom: 10,
  },
  logoPng: {
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
