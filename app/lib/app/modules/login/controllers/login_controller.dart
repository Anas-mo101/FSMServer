import 'package:app/app/data/app_preferences.dart';
import 'package:app/app/services/provider/auth_provider.dart';
import 'package:flutter_form_builder/flutter_form_builder.dart';
import 'package:get/get.dart';
import 'package:flutter/material.dart';

import '../../../routes/app_pages.dart';
import '../../../utils/event_utils.dart';

class LoginController extends GetxController {

  LoginController(this.authProvider);

  TextEditingController? emailTextController;
  TextEditingController? passwordTextController;

  final formKey = GlobalKey<FormBuilderState>();

  AutoController autoController = AutoController();

  AuthProvider authProvider;

  RxBool isLoading = false.obs;

  @override
  void onInit() {
    super.onInit();

    emailTextController ??= TextEditingController();
    passwordTextController ??= TextEditingController();
  }

  @override
  void onReady() {
    super.onReady();

    checkAuth();
  }


  Future<void> checkAuth() async {
    isLoading.value = true;
    try {
      await authProvider.checkAuth().then((value) => {
        Get.offAll(Routes.HOME)
      });
    }  catch (e) {}
    isLoading.value = false;
  }

  Future<void> login() async {
    isLoading.value = true;
    if (!formKey.currentState!.saveAndValidate()) {
      Get.snackbar("error".tr, "Invalid Credentials",
          snackPosition: SnackPosition.TOP,
          duration: const Duration(seconds: 5),
          backgroundColor: Colors.red,
          margin: const EdgeInsets.all(10),
          colorText: Colors.white);
      isLoading.value = false;
      return;
    }
    try {
      final body = formKey.currentState!.value;
      await authProvider.login(body["email"] ?? "", body["password"] ?? "").then((value) => {
        if(value?.token != null){
          AppPreferences.storeToken(value?.token ?? ""),
          autoController.eventTrigger("eventKey", {})
        }
      });
    } on ServerSideError catch (exception) {
      Get.snackbar("Error", exception.toString(),
          snackPosition: SnackPosition.TOP,
          duration: const Duration(seconds: 5),
          backgroundColor: Colors.red,
          margin: const EdgeInsets.all(10),
          colorText: Colors.white);
    } catch (e) {
      print(e);
      Get.snackbar("Error", "Login Failed, Try Again Later",
          snackPosition: SnackPosition.TOP,
          duration: const Duration(seconds: 5),
          backgroundColor: Colors.red,
          margin: const EdgeInsets.all(10),
          colorText: Colors.white);
    }
    isLoading.value = false;
  }
}
