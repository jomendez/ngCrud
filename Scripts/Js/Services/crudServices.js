﻿angular.module("ngCrud").

    service("ajaxLoadingService", function () {
        this.showLoadingImg = function () {
            $(".myproyects-ajax-loading-container").show();
        }

        this.hideLoadingImg = function () {
            $(".myproyects-ajax-loading-container").hide();
        }
    }).

    service("crudService", function ($http, $q, $location, ajaxLoadingService) {

        var self = this;
        this.servicesContract = function (servContract) {
           
            if (!servContract || !(servContract.getAllItems || servContract.getItem || servContract.saveItem || servContract.modifyItem || servContract.deleteItem)) {
                throw new Error("You are not implementing all services: getAllItems, getItem, saveItem, modifyItem, deleteItem");
                return;
            }
            self.getAllItems = servContract.getAllItems;
            self.getItem = servContract.getItem;
            self.saveItem = servContract.saveItem;
            self.modifyItem = servContract.modifyItem;
            self.deleteItem = servContract.deleteItem;
            self.refreshView = function () {
                return self.getAllItems();
            }
        }

        this.setDataContract = function (dataContract) {
            self.dataContract = dataContract;
        }

        this.getDataContract = function () {
            return self.dataContract;
        }

        this.getDataContractKeys = function () {
            return _.keys(self.dataContract)
        }

        this.getDataContractValues = function () {
            return _.values(self.dataContract)
        }

        this.formatResponseToDataContract = function (response) {
            var dc = self.dataContract;
            var i = 0;
            var result = {};
            var arr = [];
            _.filter(dc, function (value) {

                //hyperlink implementation
                if (typeof value == "object" && value.link) {
                    return _.each(value.link, function (item) {
                        if (_.has(response, item[0])) {
                            result = {};
                            result[item[0]] = response[item[0]];
                            arr[i] = {
                                "key": item[0],
                                "val": response[item[0]],
                                "included": item[1],
                                "type": item[2]
                            };
                            i++;
                            return true;
                        }
                        return false;
                    });
                }

                //plane values implementation
                if (_.has(response, value[0])) {
                    result = {};
                    result[value[0]] = response[value[0]];
                    arr[i] = {
                        "key": value[0],
                        "val": response[value[0]],
                        "included": value[1],
                        "type": value[2]
                    };
                    i++;
                    return true;
                }
                return false;
            });

            return arr
        }

        this.formatFromDataContractToObj = function (arr) {
            obj = {};
            _.each(arr, function (item) {
                obj[item.key] = item.val;
            });
            return obj;
        }
        
        this.parseDataContractToEmptyEsqueleton = function (obj) {
            var result = {};
            _.each(obj, function (item) {
                if (typeof item == "object" && item["link"]) {
                    _.each(item["link"], function (val) {
                        result[val[0]] = "";
                    })
                } else {
                    result[item[0]] = "";
                }

            });
            return result;
        }

    }).

    service("deleteItemService", function ($location, crudService) {

        this.deleteItem = function (id, scope) {
            var idOfItemToDelete = id ? id : personId;
            crudService.deleteItem(idOfItemToDelete).then(function (data) {
                if (data) {
                    scope.splice(_.indexOf(scope, _.find(scope, function (item) {
                        return item.Id === idOfItemToDelete;
                    })), 1);
                } else {
                    //todo: showMessage("No item was deleted")
                }
            });
        }
    }).

    factory("configCrudService", function () {

         var contracts = function () {
             var servicesContract = {};
             var dataContract = {};
             var panelTitle = {};
             
             var getservicesContract = function (ngCrud) {
                 return servicesContract[ngCrud];
             }

             var getDataContract = function (ngCrud) {
                 return dataContract[ngCrud];
             }

             var getPanelTitle = function (ngCrud) {
                 return panelTitle[ngCrud];
             }

             var setContracts = function (data) {
                 if (!data)
                     return;

                 servicesContract[data.ngCrud] = data.servicesContract;
                 dataContract[data.ngCrud] = data.dataContract;
                 panelTitle[data.ngCrud] = data.panelTitle;
             }

             return {
                 getservicesContract: getservicesContract,
                 getDataContract: getDataContract,
                 setContracts: setContracts,
                 getPanelTitle: getPanelTitle
             }

         }();

         return contracts;
    }).

    service("editOrInsertService", function () {

        this.getKeyFromObj = function (obj) {
            if (!obj)
                return null;

            var key = _.keys(obj)[0];
            return key;
        };

        this.getValFromObj = function (obj) {
            if (!obj)
                return null;

            var val = _.values(obj)[0];
            return val;
        }

    });