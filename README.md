
# NasdaqStockApp

A React Native app to explore stocks listed on the Nasdaq exchange. The app fetches stock data from the Polygon.io API, displays stock information on the explore screen, and allows users to search for specific stocks.


## My Environment

- node 22.11.0
- npm 10.9.0
- jdk 17.0.2
- gradle 8.8
- react-native 0.76.1
- Android Studio Ladybug

## Getting Started
- Clone the repository
```
git clone https://github.com/YoussefElattarr/NasdaqStockApp.git
cd nasdaq-stock-market-app
```
- Install Dependencies
```
npm install
```
- Set Up Environment Variables
    - Create a secrets.js file
    - Copy content of secrets.js.example into the newly created file
    - Add your API_KEY for Polygon.into
- Set Up Android
    - Open Android Studio and ensure you have an Android Virtual Device (AVD) set up.
    - Open AVD Manager and create a new virtual device if none exists.
    - Select the target SDK version: Preferable SDK 34 or higher
    - Start the emulator from AVD Manager.
- Running the app
```
 npm run android 
```
- Running test
```
npm test
```

## Limitations
The api has a limit of 5 requests/min. In order to accommodate that, logos for tickers (if available) are shown only when the user presses on the ticker to limit api calls. If it has an image, the image will display, if not nothing will happen. Also due to the limit, logos might disappear after they have been fetched since it is displaying from a remote url.

## Improvements
- Add more unit testing
- Cache the images on the device to limit api calls
- Show the user feedback if they press on a stock and the stock doesn't have a logo

    