angular.module("default")


.value('fbURL', 'https://angularjs-projects.firebaseio.com/')

    .service('parceIdFirebase', function () {
        this.parse  = function (obj) {
            if (obj == null || obj.length == 0)
                return;
            var aux = [];
            _.each(obj, function (item) {
                if (item != null && !item.Id) {
                    item.Id = item.$id;
                    aux.push(item);
                } else {
                    aux.push(item);
                }
            });
            return aux;
        }
    })

.factory('FirebaseObj', function ($firebase, fbURL) {
    return $firebase(new Firebase(fbURL)).$asArray();
    // return null
})

.service("crudServiceApi", function ($http, $q, $location, ajaxLoadingService, FirebaseObj, parceIdFirebase) {
    var data = {
        id: 0
    }

    this.getAllItems = function () {
        var dfr = $q.defer();
        dfr.resolve(parceIdFirebase.parse(FirebaseObj));
        return dfr.promise;
    };

    this.getItem = function (id) {
        var dfr = $q.defer();

        var fbid = FirebaseObj.$indexFor(id);
        dfr.resolve(FirebaseObj[fbid]);
        return dfr.promise;
    };

    this.saveItem = function (dataTodoData) {
        var dfr = $q.defer();
        delete dataTodoData['$id'];
        dfr.resolve(FirebaseObj.$add(dataTodoData));
        return dfr.promise;
        
    };

    this.modifyItem = function (dataTodoData) {
        return FirebaseObj.$save(dataTodoData);
    };

    this.deleteItem = function (id) {
        var dfr = $q.defer();
        dfr.resolve(FirebaseObj.$remove(id));
        return dfr.promise;
    };

    this.refreshView = function () {
        return this.getAllItems();
    }

})
