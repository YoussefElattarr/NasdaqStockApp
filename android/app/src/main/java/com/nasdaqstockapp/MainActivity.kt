package com.nasdaqstockapp

//import com.facebook.react.ReactActivity
//import com.facebook.react.ReactActivityDelegate
//import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
//import com.facebook.react.defaults.DefaultReactActivityDelegate
//
//class MainActivity : ReactActivity() {
//
//  /**
//   * Returns the name of the main component registered from JavaScript. This is used to schedule
//   * rendering of the component.
//   */
//  override fun getMainComponentName(): String = "NasdaqStockApp"
//
//  /**
//   * Returns the instance of the [ReactActivityDelegate]. We use [DefaultReactActivityDelegate]
//   * which allows you to enable New Architecture with a single boolean flags [fabricEnabled]
//   */
//  override fun createReactActivityDelegate(): ReactActivityDelegate =
//      DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)
//}

import android.os.Bundle;
import com.facebook.react.ReactActivity
//import com.facebook.react.ReactActivityDelegate
//import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
//import com.facebook.react.defaults.DefaultReactActivityDelegate
//import org.devio.rn.splashscreen.SplashScreen;

class MainActivity : ReactActivity() {

    override fun onCreate(savedInstance: Bundle?) {
        setTheme(R.style.SplashScreenTheme);
//        setContentView(R.drawable.launch_screen);

        super.onCreate(savedInstance)

    }
    override fun getMainComponentName(): String {
        return "NasdaqStockApp"
    }
}
