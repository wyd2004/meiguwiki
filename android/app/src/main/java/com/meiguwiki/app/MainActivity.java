package com.meiguwiki.app;

import android.os.Bundle;

import com.facebook.react.ReactActivity;
import com.tencent.android.tpush.XGBasicPushNotificationBuilder;
import com.tencent.android.tpush.XGCustomPushNotificationBuilder;
import com.tencent.android.tpush.XGPushManager;
import com.tencent.android.tpush.XGPushNotificationBuilder;

import org.devio.rn.splashscreen.SplashScreen;

public class MainActivity extends ReactActivity {

  /**
   * Returns the name of the main component registered from JavaScript.
   * This is used to schedule rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "meiguwiki";
  }

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    SplashScreen.show(this);
    XGPushNotificationBuilder builder = new XGBasicPushNotificationBuilder();
    builder.setSmallIcon(R.drawable.ic_notification);
    XGPushManager.setDefaultNotificationBuilder(getApplicationContext(), builder);
    super.onCreate(savedInstanceState);
  }
}
