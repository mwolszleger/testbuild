angular.module('elaborantUserManagerCtrl', []).controller('UserManagerCtrl', function ($rootScope, $scope, $http, $sce, $filter, $stateParams, $modalInstance, param, UserService, NotificationService) {
    $scope.user = {};
    if (param.id) {
        $scope.user.id = param.id;
    }
	
	$scope.showPassword = param.id ? false : true;
	$scope.firstStep = true;
	$scope.next = function(){$scope.firstStep = false;};
	$scope.back = function(){$scope.firstStep = true;};
    $scope.init = function () {		
        $scope.windowTitle = "Dodaj nowego użytkownika";
        $scope.errorMessage = "Błąd przy dodawaniu użytkownika";
        $scope.user = {};
        $scope.buttonName = "Dodaj";

        if (param.id) { // get details if task exsists
            $scope.user.id = param.id;
            $scope.windowTitle = "Edycja użytkownika";
			$scope.errorMessage = "Błąd przy edycji użytkownika";
            UserService.getDataEntity(param.id, createObject);
            $scope.buttonName = "Edytuj";
        }
    }
   
 function createObject(dataEntityJSON) {
        $scope.user = dataEntityJSON;
        $scope.user.idRole = $scope.user.role.id.toString();
        //$scope.lab.owner = {};		
    }

    $scope.rolesList = function () {
        $http.get(apiUrl + 'roles')
        .success(function (serverResponse) {
            $scope.rolesListData = serverResponse.response;
            $scope.dataLoaded = true;
			
        })
        .error(function (data, status) {
            $scope.responseError = true;
            $scope.errorMessage = $sce.trustAsHtml(errorMessage);
        });
    };

    $scope.rolesList();


    $scope.save = function () {
        var dataAddTask = jQuery.extend({}, $scope.task);
        $http({
            method: ($scope.user.id) ? 'PUT' : 'POST',
            url: apiUrl + "users/",
            data: JSON.parse(JSON.stringify($scope.user))
        })
        .then(function (success) {
            ($scope.user.id) ? NotificationService.success("Użytkownik został zmieniony!") : NotificationService.success("Użytkownik zostało dodany!");
            $rootScope.$emit("RefreshList", {});
            $scope.cancel();

            $scope.user = {};
            //$scope.lab.building = "MS";
        }, function (response) {
            $scope.IsResponseError = true;
            $scope.ResponseErrorMessage = $sce.trustAsHtml(ParseResponseErrorMessages(response));
        });

    };
    $scope.deleteEntity = function () {
        var json = { id: parseInt($scope.user.id) };
        $http({
            method: 'DELETE',
            url: apiUrl + "users/" + $scope.user.id,
            data: JSON.parse(JSON.stringify(json))
        })
        .then(function (response) {
            $rootScope.$emit("RefreshList", {});
            $scope.cancel();
			NotificationService.success("Użytkownik został usunięty!");
        }, function (response) {
            alert("Wystąpił błąd!");
        });
    }


    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
    
});