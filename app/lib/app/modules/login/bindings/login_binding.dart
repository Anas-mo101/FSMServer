import 'package:get/get.dart';

import '../../../services/provider/auth_provider.dart';
import '../controllers/login_controller.dart';

class LoginBinding extends Bindings {
  @override
  void dependencies() {
    Get.lazyPut<LoginController>(
      () => LoginController(AuthProvider()),
    );
  }
}
