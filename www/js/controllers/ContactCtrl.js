angular.module('app')

.controller('contactCtrl', function($scope, $ionicModal, $ionicPopup, $http,
    Contacts, Favorites) {

    $ionicModal.fromTemplateUrl('modals/add-contact.html', function(modal) {
        $scope.modal = modal;
    }, {
        scope: $scope,
        animation: 'slide-in-up'
    });

    $ionicModal.fromTemplateUrl('modals/contact-detail.html', function(modal) {
        $scope.detailModal = modal;
    }, {
        scope: $scope,
        animation: 'slide-in-up'
    });

    $scope.loadContacts = function() {
        Contacts.getContacts().then(function(resp) {
            $scope.contacts = resp.data.list;
        }, function(err) {
            console.error('GET ERR', err);
        });
    }

    $scope.loadContacts();

    $scope.showAddDialog = function() {
        $scope.newContact = {'name' : '', 'email': '', 'phone': ''};
        $scope.modal.show();
    }

    $scope.createContact = function() {
        Contacts.addContact($scope.newContact)
        .then(function(response) {
            $scope.loadContacts();
            $scope.modal.hide();
        }, function(response) {
            console.error('ERR POST', JSON.stringify(response));
        });
    }

    $scope.showDetailDialog = function(contact) {
        $scope.selected = contact;
        // $scope.selected.isFavorite = Favorites.isFavorite(contact);
        Favorites.isFavorite(contact)
        .then(function(response) {
            $scope.selected.isFavorite = response;
        }, function(response) {
            $scope.selected.isFavorite = false;
            }
        );
        $scope.detailModal.show();
    }

    $scope.deleteContact = function() {
        $ionicPopup.confirm({
            title: 'Delete?',
        }).then(function(response) {
            Contacts.deleteContact($scope.selected)
            .then(function() {
                $scope.detailModal.hide();
                $scope.loadContacts();

                Favorites.deleteFavorite($scope.selected);
            }, function(response) {
                console.error('DELETE ERR', JSON.stringify(response));
            });

        });
    }

    $scope.editContact = function() {
        Contacts.editContact($scope.selected)
        .then(function(response) {
            $scope.detailModal.hide();
            $scope.loadContacts();
        }, function(response) {
            console.error('ERR PUT', JSON.stringify(response));
        });

    }

    $scope.toggleFavorite = function() {
        if($scope.selected.isFavorite) {
            console.log('adding favorite');
            Favorites.addFavorite($scope.selected);
        } else {
            console.log('removing favorite');
            Favorites.deleteFavorite($scope.selected);
        }
    }

    $scope.loadFavorites = function() {
        console.log("reloading..");
        Favorites.getFavorites().then(function(result) {
            $scope.favorites = result;
        });
    };

    $scope.loadFavorites();
})
