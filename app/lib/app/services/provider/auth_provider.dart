import 'package:app/app/services/provider/base_provider.dart';

import '../../data/app_preferences.dart';
import '../../models/login_response.dart';
import '../api_endpoints.dart';

class AuthProvider extends BaseProvider {
  Future<LoginResponse> login(String email, String password) async {
    try {
      final response = await post(
          ApiEndPoints.login,
          {"email": email, "password": password},
      );

      if (response.status.hasError) {
        return Future.error(response.statusText!);
      }

      return LoginResponse.fromJson(response.body);
    } catch (exception) {
      return Future.error(exception);
    }
  }

  Future<void> checkAuth() async {
    try {
      final token = await AppPreferences.getToken();

      final response = await get(
        ApiEndPoints.auth,
        headers: {"authorization": "Bearer $token"}
      );

      if (response.status.hasError) {
        return Future.error(response.statusText!);
      }

    } catch (exception) {
      return Future.error(exception);
    }
  }
}