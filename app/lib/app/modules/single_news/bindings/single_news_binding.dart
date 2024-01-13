import 'package:get/get.dart';

import '../controllers/single_news_controller.dart';

class SingleNewsBinding extends Bindings {
  @override
  void dependencies() {
    Get.lazyPut<SingleNewsController>(
      () => SingleNewsController(),
    );
  }
}
