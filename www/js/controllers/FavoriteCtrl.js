angular.module('app')

.controller('favoriteCtrl', function($scope, Favorites) {

    $scope.loadFavorites = function() {
        console.log("reloading..");
        Favorites.getFavorites().then(function(result) {
            $scope.favorites = result;
        });
    };

    $scope.loadFavorites();
})
