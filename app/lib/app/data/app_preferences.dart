import 'dart:convert';
import 'package:get_storage/get_storage.dart';

class AppPreferences {
  static final AppPreferences _instance = AppPreferences._internal();

  AppPreferences._internal();

  factory AppPreferences() => _instance;

  init() async {}

  static void storeToken(String token) async {
    GetStorage().write("appToken", token);
  }

  static void storeTheme(bool id) async {
    GetStorage().write("appTheme", id);
  }


  static Future<dynamic> getToken() async {
    return GetStorage().read("appToken");
  }

  static Future<bool?> getTheme() async {
    return GetStorage().read("appTheme") as bool?;
  }

}
