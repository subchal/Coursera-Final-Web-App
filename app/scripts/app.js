

angular.module('app1', ['ui.router', 'ngResource', 'ngDialog'])

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
  // route for the home page
  .state('app', {
    url:'/',
    views: {
      'header' : {
        templateUrl : 'views/header.html',
        controller  : 'HeaderCtrl'
      },
      'content': {
        templateUrl : 'views/play.html',
        controller  : 'InstrumentCtrl'
      },
      'footer': {
          //templateUrl : 'views/footer.html',
      }
    }

  })
  // route for the aboutus page
  .state('app.aboutus', {
    url:'aboutus',
    views: {
      'content@': {
          templateUrl : 'views/aboutus.html',
          //controller  : 'AboutController'
      }
    }
  })
  // route for the dishdetail page
  .state('app.account', {
    url: 'account',
    views: {
      'content@': {
        templateUrl : 'views/account.html',
        controller  : 'AccountPageController'
     }
    }
  });

  $urlRouterProvider.otherwise('/');
})
;
