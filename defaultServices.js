angular.module("default")

.value('fbURL', 'https://angularjs-projects.firebaseio.com/')

.factory('firebaseObj', function ($firebase, fbURL) {
    //return $firebase(new Firebase(fbURL)).$asArray();
    return null
})

.service("crudServiceApi", [ '$http', '$q', '$location', 'firebaseObj', 'ajaxLoadingService', function ($http, $q, $location, firebaseObj, ajaxLoadingService) {
        var data = {
            id: 0
        }

        this.getAllItems = function () {
            var dfr = $q.defer();
            $http.get("api/data/getAllItems").success(function (response) {
                dfr.resolve(response);
            });

            return dfr.promise;
        };

        this.getItem = function (id) {
            var dfr = $q.defer();
            $http.get("api/data/getItem/" + id).success(function (response) {
                dfr.resolve(response);
            });

            return dfr.promise;
        };

        this.saveItem = function (dataTodoData) {
            var dfr = $q.defer();
            $http.post("api/data/saveItem", dataTodoData).success(function (response) {
                dfr.resolve(response);
            });

            return dfr.promise;
        };

        this.modifyItem = function (dataTodoData) {
            var dfr = $q.defer();
            $http.post("api/data/modifyItem", dataTodoData).success(function (response) {
                dfr.resolve(response);
            });

            return dfr.promise;
        };

        this.deleteItem = function (id) {
            var dfr = $q.defer();
            $http.delete("api/data/deleteItem/"+ id).success(function (response) {
                dfr.resolve(response);
            });

            return dfr.promise;
        };

        this.refreshView = function () {
           return this.getAllItems();
        }

    }]);