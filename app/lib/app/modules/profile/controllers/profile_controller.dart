import 'package:get/get.dart';

import '../../../utils/event_utils.dart';

class ProfileController extends GetxController {
  AutoController autoController = AutoController();


  void back() {
    autoController.eventTrigger("return", null);  
  }

  void logout() {
    autoController.eventTrigger("logout", null);
  }
}
