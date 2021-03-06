package com.animationexample;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.jamesisaac.rnbackgroundtask.BackgroundTaskPackage;
import com.react.rnspinkit.RNSpinkitPackage;
import com.ocetnik.timer.BackgroundTimerPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import java.util.Arrays;
import java.util.List;

import com.reactnativenavigation.NavigationApplication;
import com.reactnativenavigation.react.NavigationReactNativeHost;
import com.reactnativenavigation.react.ReactGateway;


import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.ReactRootView;

public class MainApplication extends NavigationApplication   implements ReactApplication{
    
    @Override
      protected ReactGateway createReactGateway() {
         ReactNativeHost host = new NavigationReactNativeHost(this, isDebug(), createAdditionalReactPackages()) {
            @Override
            protected String getJSMainModuleName() {
                return "index";
            }
         };
        return new ReactGateway(this, isDebug(), host);
      }

     @Override
      public boolean isDebug() {
         return BuildConfig.DEBUG;
      }

    
    protected List<ReactPackage> getPackages() {
           // Add additional packages you require here
          // No need to add RnnPackage and MainReactPackage
          return Arrays.<ReactPackage>asList(
              new BackgroundTimerPackage(),
              new RNSpinkitPackage(),
              new BackgroundTaskPackage(),
                  new RNDeviceInfo()

          );
      }
  
    @Override
      public void onCreate() {
        super.onCreate();
        SoLoader.init(this, /* native exopackage */ false);
        BackgroundTaskPackage.useContext(this);
      }

      @Override
      public List<ReactPackage> createAdditionalReactPackages() {
                return getPackages();
      }

      

}
