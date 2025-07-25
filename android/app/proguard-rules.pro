# Add project specific ProGuard rules here.
# By default, the flags in this file are appended to flags specified
# in /usr/local/Cellar/android-sdk/24.3.3/tools/proguard/proguard-android.txt
# You can edit the include path and order by changing the proguardFiles
# directive in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# react-native-reanimated
-keep class com.swmansion.reanimated.** { *; }
-keep class com.facebook.react.turbomodule.** { *; }

#Razor pay
-keepattributes *Annotation*
-dontwarn com.razorpay.**
-keep class com.razorpay.** {*;}
-optimizations !method/inlining/
-keepclasseswithmembers class * {
  public void onPayment*(...);
}

-keep class * implements com.ryanharter.auto.value.gson.GsonTypeAdapterFactory { *; }
-dontwarn com.ryanharter.auto.value.gson.GsonTypeAdapterFactory

# Add any project specific keep options here:

# Add these rules to your proguard-rules.pro file
-keep class com.mappls.sdk.maps.** { *; }
-keep class com.mappls.sdk.maps.rctmgl.**{ *; }
-keep class com.mappls.sdk.services.** { *; }
-keep class com.mappls.** { *; }
-keep class com.mmi.** { *; }
-keep class okhttp3.** { *; }
-keep class com.mappls.sdk.** { *; }
-keep interface com.mappls.sdk.** { *; }

-keep class com.google.android.gms.auth.api.credentials.** { *; }
-keep class me.furtado.smsretriever.** { *; }
-dontwarn com.google.android.gms.auth.api.credentials.Credential
-dontwarn com.google.android.gms.auth.api.credentials.CredentialsApi
-dontwarn com.google.android.gms.auth.api.credentials.HintRequest$Builder
-dontwarn com.google.android.gms.auth.api.credentials.HintRequest