import 'package:app/app/models/node_response.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:get/get_connect/connect.dart';
import 'package:get/get_core/src/get_main.dart';

import '../data/app_preferences.dart';
import '../services/api_endpoints.dart';
import '../services/provider/base_provider.dart';

class ServerSideError implements Exception {
  ServerSideError(this.errorMessage);

  String errorMessage;

  @override
  String toString() => errorMessage;
}


class AutoController extends BaseProvider {

  Future<Map<String, dynamic>?> eventTrigger(String eventKey, Map<String, dynamic>? body) async {
    try {
      final token = await AppPreferences.getToken();

      final response = await post(
          ApiEndPoints.index(eventKey),
          body,
          headers: {"authorization": "Bearer $token"}
      );

      if (response.status.hasError) {
        if(response.body?['error'] != null){
          throw ServerSideError(response.body?['errorMessage']);
        }else{
          return Future.error(response.statusText!);
        }
      }

      final nodeResponse = NodeResponse.fromJson(response.body["result"]);

      if(nodeResponse?.type != Get.currentRoute){
        _routeEvent(nodeResponse);
        return null;
      }

      return nodeResponse.executionData;
    } on ServerSideError catch (exception) {
      Get.snackbar("Error", exception.toString(),
          snackPosition: SnackPosition.TOP,
          duration: const Duration(seconds: 5),
          backgroundColor: Colors.red,
          margin: const EdgeInsets.all(10),
          colorText: Colors.white);
    }catch (exception) {
      return Future.error(exception);
    }
  }


  void _routeEvent(NodeResponse node) {
    final body = node.executionData;
    print(node.toJson());
    switch (node.routingType) {
      case "pop": {
        Get.back();
      }
      break;
      case "insert": {

        Get.toNamed(node!.type!, arguments: body);
      }
      break;
      case "pop_n_insert": {
        Get.offNamed(node!.type!, arguments: body);
      }
      break;
      case "pop_all_n_insert": {
        Get.offAllNamed(node!.type!, arguments: body);
      }
      break;
    }
  }
}

