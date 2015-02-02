angular.module('app')

.factory("Favorites", function($q) {
    var db = null;

    // db = $cordovaSQLite.openDB({name:'contacts'});
    db = window.openDatabase("my.db", '1', 'my database', 5 * 1024 * 1024);
    db.transaction(function(tx) {
        tx.executeSql('create table if not exists favorites(id integer primary key, name text, phone text, email text)');
    });

    return {
        addFavorite: function(contact) {
            db.transaction(function(tx) {
                console.log('inserting..');
                tx.executeSql('insert into favorites (id, name, phone, email) values (?, ?, ?, ?)',
                    [contact.id, contact.name, contact.phone, contact.email],
                    function(tx, result) {
                        console.log('success');
                    },
                    function(tx, result) {
                        console.error('error');
                    });
            });
        },
        deleteFavorite: function(contact) {
            console.log('deleting..');
            db.transaction(function(tx) {
                tx.executeSql('delete from favorites where id = ?', [contact.id]);
            });
        },
        isFavorite: function(contact) {
            var deferred = $q.defer();
            db.transaction(function(tx) {
                tx.executeSql('select * from favorites where id = ?',
                    [contact.id],
                    function(tx, result) {
                        var isFavorite = result.rows.length > 0;
                        deferred.resolve(isFavorite);
                    });
            });
            return deferred.promise;
        },
        getFavorites: function() {
            var deferred = $q.defer();
            db.transaction(function(tx) {
                tx.executeSql('select * from favorites', [], function(tx, result) {
                    var len = result.rows.length;

                    var favorites = [];
                    for(var i = 0; i < len; i++){
                        var row = result.rows.item(i);
                        favorites.push(row);
                    }
                    deferred.resolve(favorites);
                });
            });
            return deferred.promise;
        }
    };
});
