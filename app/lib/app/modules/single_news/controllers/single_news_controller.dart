import 'package:get/get.dart';
import 'package:flutter/material.dart';
import '../../../utils/event_utils.dart';

class SingleNewsController extends GetxController {
  //TODO: Implement SingleNewsController

  AutoController autoController = AutoController();

  final scaffoldKey = GlobalKey<ScaffoldState>();

  void back() {
    autoController.eventTrigger("return", null);
  }
}
