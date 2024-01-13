import 'package:get/get.dart';

import '../../../utils/event_utils.dart';

class NewsController extends GetxController {
  AutoController autoController = AutoController();

  final count = 0.obs;
  @override
  void onInit() {
    super.onInit();
  }

  @override
  void onReady() {
    super.onReady();
  }

  @override
  void onClose() {
    super.onClose();
  }

  void back() {
    autoController.eventTrigger("return", null);
  }
}
