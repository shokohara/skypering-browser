angular.module("app")
.factory("SharedService",
  ["$rootScope", ($rootScope)->
    signUp =
      name: ""
      text: ""
      skypeId: ""
      sex: ""
      prefecture: ""
    signUp:
      get: ()-> signUp
      set: (s)-> signUp = s
    text = ""
    text:
      get: ()-> text
      set: (t)->
        text = t
        $rootScope.$broadcast("post")
]).factory("Users", ["$resource", "URL", ($resource, URL) ->
  $resource "//#{URL.HOST_NAME}:#{URL.PORT}/users", null,
    "post":
      method: "POST"
    "update":
      method: "PUT"
]).factory("Notes", ["$resource", "URL", ($resource, URL) ->
  $resource "//#{URL.HOST_NAME}:#{URL.PORT}/posts", null
]).factory("History", ["$resource", "URL", ($resource, URL) ->
  $resource "//#{URL.HOST_NAME}:#{URL.PORT}/users/posts", null
]).factory("Session", ["$resource", "URL", ($resource, URL) ->
  $resource "//#{URL.HOST_NAME}:#{URL.PORT}/session", null,
    "create":
      method: "POST"
    "delete":
      method: "DELETE"
])
