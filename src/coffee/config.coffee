angular.module("app")
.config(["$stateProvider", "$urlRouterProvider", "$compileProvider", "$httpProvider", "$locationProvider", ($stateProvider, $urlRouterProvider, $compileProvider, $httpProvider, $locationProvider) ->
  $locationProvider.html5Mode(true)
  $httpProvider.defaults.withCredentials = true
  $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|skype):/)
  $urlRouterProvider.otherwise("/")
  $stateProvider
  .state "top",
    url: "/"
    templateUrl: "template/list.html"
    controller: "SearchController"
  .state "profile",
    url: "/profile"
    templateUrl: "template/profile.html"
    controller: "ProfileController"
  .state "sign-up",
    url: "/sign-up"
    templateUrl: "template/sign-up.html"
    controller: "SignUpController"
  .state "history",
    url: "/history"
    templateUrl: "template/history.html"
    controller: "HistoryController"
  .state "filter",
    url: "/filter"
    templateUrl: "template/filter.html"
    controller: "SearchController"
  .state "search",
    url: "/search"
    templateUrl: "template/search.html"
    controller: "SearchController"
])
