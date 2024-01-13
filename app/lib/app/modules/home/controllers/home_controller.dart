import 'package:get/get.dart';

import '../../../utils/event_utils.dart';

class HomeController extends GetxController {
  //TODO: Implement HomeController

  AutoController autoController = AutoController();


  void goToNew() {}

  void goToProfile() {
    autoController.eventTrigger("select_profile", null);
  }
}
