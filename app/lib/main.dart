import 'package:flutter/material.dart';
import 'package:get/get_navigation/src/root/get_material_app.dart';

import 'app/routes/app_pages.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();

  runApp( MyApp(initialRoute: AppPages.INITIAL) );
}


class MyApp extends StatelessWidget {
  MyApp({Key? key, required this.initialRoute}) : super(key: key);
  String initialRoute;

  @override
  Widget build(BuildContext context) {
    return GetMaterialApp(
      title: 'MyApp',
      initialRoute: initialRoute,
      getPages: AppPages.routes,
      debugShowCheckedModeBanner: false,
    );
  }
}
