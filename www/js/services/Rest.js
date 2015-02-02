angular.module('app')

.value('serverUrl', 'http://localhost:8000/api/')

.factory('Contacts', function($http, serverUrl) {
    return {
        getContacts: function() {
            return $http.get(serverUrl + 'contact');
        },
        addContact: function(newContact) {
            return $http.post(serverUrl + 'contact', newContact);
        },
        editContact: function(contact) {
            return $http.put(serverUrl + 'contact/' + contact.id, contact);
        },
        deleteContact: function(contact) {
            return $http.delete(serverUrl + 'contact/' + contact.id );
        }
    }
})
