import 'package:get/get.dart';
import '../api_config.dart';

class BaseProvider extends GetConnect {
  BaseProvider() {
    httpClient.baseUrl = ApiConfig.baseUrl;
    httpClient.timeout = const Duration(seconds: ApiConfig.timeout);
  }
}
