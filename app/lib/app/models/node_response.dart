import '../routes/app_pages.dart';

class NodeResponse {
  String? id;
  String? type;
  String? routingType;
  Map<String, dynamic>? executionData;

  NodeResponse({this.id, this.type,this.routingType, this.executionData});

  NodeResponse.fromJson(Map<String, dynamic> json) {
    id = json['id'];
    routingType = json['routingType'];
    type =  mapTypeToRoute(json['type']);
    if(json['executionData'] != null){
      executionData = json['executionData'];
    }
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['id'] = this.id;
    data['type'] = this.type;
    data['routingType'] = this.routingType;
    if (this.executionData != null) {
      data['executionData'] = this.executionData;
    }
    return data;
  }

  mapTypeToRoute(String? route){
    switch (route) {
      case "home": {
        return Routes.HOME;
      }

      case "profile": {
        return Routes.PROFILE;
      }

      case "news": {
        return Routes.NEWS;
      }

      case "singleNews": {
        return Routes.SINGLE_NEWS;
      }

      default: {
        return Routes.LOGIN;
      }
    }
  }
}