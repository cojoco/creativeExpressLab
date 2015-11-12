var app = window.angular.module('app', []).config(function($sceDelegateProvider) {
  $sceDelegateProvider.resourceUrlWhitelist([
    'self',
    'https://www.youtube.com/**'
  ]);
});

app.factory('movieFetcher', movieFetcher)
app.factory('userFetcher', userFetcher)
app.controller('mainCtrl', mainCtrl)

function movieFetcher ($http) {
  var API_ROOT = 'movies'
  return {
    get: function () {
      return $http
        .get(API_ROOT)
        .then(function (resp) {
          return resp.data
        })
    }
  }
}

function userFetcher ($http) {
  var API_ROOT = 'user'
  return {
    get: function () {
      return $http
        .get(API_ROOT)
        .then(function (resp) {
          return resp.data
        })
    }
  }
}

function mainCtrl ($scope, $http, movieFetcher, userFetcher) {
  $scope.movies = [];
  $scope.user = null;

  userFetcher.get().then(function (data) {
    $scope.user = data.username
  })

  movieFetcher.get().then(function (data) {
    $scope.movies = data;
    console.log(data);
  })

  $scope.addComment = function(index, comment) {
    var newComment = {text:comment, user:$scope.user};
    $scope.movies[index].comments.push(newComment);
    console.log($scope.movies[index].comments);
    var respObj = {'movieTitle':$scope.movies[index].name, 'commentText':comment, 'user':$scope.user};
    console.log(JSON.stringify(respObj));
    $http({
      method: 'POST',
      url: 'addComment',
      data: JSON.stringify(respObj),
      headers: {'Content-Type': 'application/json'}
    });
  }
}
