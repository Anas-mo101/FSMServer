import 'package:flutter/material.dart';

import 'package:get/get.dart';

import '../../../theme/flutter_flow_theme.dart';
import '../controllers/single_news_controller.dart';

class SingleNewsView extends GetView<SingleNewsController> {
  const SingleNewsView({Key? key}) : super(key: key);
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: FlutterFlowTheme.of(context).primaryBackground,
      appBar: AppBar(
        backgroundColor: FlutterFlowTheme.of(context).primary,
        automaticallyImplyLeading: false,
        title: Text(
          'News',
          style: FlutterFlowTheme.of(context).displaySmall.override(
            fontFamily: 'Outfit',
            color: FlutterFlowTheme.of(context).white,
          ),
        ),
        leading: InkWell(
          onTap: () {
            controller.back();
          },
          child: Icon(
            Icons.chevron_left,
            color: FlutterFlowTheme.of(context).white,
            size: 28,
          ),
        ),
        centerTitle: false,
        elevation: 0,
      ),
      body: SafeArea(
        top: true,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.center,
          mainAxisSize: MainAxisSize.max,
          children: [
            Text(
              'Headline',
              style: FlutterFlowTheme.of(context).titleLarge,
            ),
            const Expanded(
              child: Padding(
                padding: EdgeInsetsDirectional.fromSTEB(0, 8, 0, 0),
                child: Column(
                  children: [

                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
