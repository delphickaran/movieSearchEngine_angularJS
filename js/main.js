//******************* App Module **********************************//
var myApp = angular.module('myApp',['ui.router','ngResource']);

//************************ States *********************************//
myApp.config(function($stateProvider, $urlRouterProvider){
    $urlRouterProvider.otherwise('/home');
    $stateProvider
    
//************************** Home State Starts *************************//
    .state('home',{
        url:'/home',
        templateUrl:'home.html',
        controller:'homeController'
    })
//************************** Home State Ends *************************//

//************************** Search List State starts *************************//
    .state('searchList',{
        url: '/searchList/:id',
        templateUrl: 'searchList.html',
        controller: 'searchListController'
    })
//************************** Search List State Ends *************************//
    
//************************** Final Search State Starts *************************//
    .state('search',{
        url:'/search',
         params: {
            id: NaN,
            name: "empty"
          },
        templateUrl:'searchResult.html',
        controller:'searchController'
    })
//************************** Final Search State Ends *************************//

});

//************************** HomeController Starts *************************//
myApp.controller('homeController',['$scope','myFactory','$resource','$state','myService',function($scope,myFactory,$resource,$state,myService){
    console.log('home controller');
    $scope.selected = "";
    $scope.name = myService.name;
     $scope.list = myFactory.list;
    $scope.result = function(){
        myService.name = $scope.name;
        $state.go("searchList",{id: $scope.selected});
    }

}]);
//************************** Home Controller Ends *************************//

//************************** searchListController Starts *************************//
myApp.controller('searchListController',['$scope','myFactory','$resource','$stateParams','$state','myService',function($scope,myFactory,$resource,$stateParams,$state,myService){
     console.log("1st search");
    $scope.selected = $stateParams.id;
    $scope.name = myService.name;
    console.log(myService.name);
    $scope.back = function(){
        $state.go("home");
    }
     
    $scope.api = $resource("http://netflixroulette.net/api/api.php");
    
    //IIFE
     (function(){    
        if( $scope.selected === "1"){
            $scope.api.get({title:$scope.name},function(data){
                $scope.data1 = data;
                $scope.indexed = function(index){ 
                    $scope.arrayResult = data.show_cast.split(', ');
                }
                $scope.data = [];
                $scope.data.push($scope.data1);   
            }, function(error){
                 $scope.error = error;
             });
            
        };
        if( $scope.selected === "2"){
            $scope.api.query({director:$scope.name , isArray: true},function(data){
                $scope.data = data;
                
                $scope.indexed = function(index){ 
                    $scope.arrayResult = data[index].show_cast.split(', ');
                        }
            }, function(error){
                 $scope.error = error;
             });  
        };
        if( $scope.selected === "3"){
             $scope.api.query({actor:$scope.name , isArray: true},function(data){
                $scope.data = data;
                 $scope.indexed = function(index){ 
                    $scope.arrayResult = data[index].show_cast.split(', ');
                        }
            }, function(error){
                 $scope.error = error;
             });
        };
    }());
    
    // For Searching Director
    $scope.toGo = function(val){
        $state.go('search',{id:1, name:val});
    }
    
    // For Searching Actor
    $scope.toGoActor = function(val){
        $state.go('search',{id:2,name:val});
    }
}])
//************************** searchListController Ends *************************//

//************************** searchController Starts *************************//
myApp.controller('searchController',['$scope','myFactory','$resource','$stateParams','$state',function($scope,myFactory,$resource,$stateParams,$state){
    
    $scope.name1 = $stateParams.name;
    var id = $stateParams.id;
    // for searching director
    $scope.toGo = function(val){
       $state.go('search',{id:1,name:val});
    };
    // for searching actor
   $scope.toGoActor = function(val){
        $state.go('search',{id:2,name:val});
    };
     $scope.api = $resource("http://netflixroulette.net/api/api.php");
    
    //IIFE
    (function(){
    if(id === 1){
     $scope.data2 = $scope.api.query({director:$scope.name1 , isArray: true},function(data){
         $scope.indexed = function(index){ 
                $scope.arrayResult = data[index].show_cast.split(', ');
                }
            });
        }
    if(id=== 2){
     $scope.data2 = $scope.api.query({actor:$scope.name1 , isArray: true},function(data){
         $scope.indexed = function(index){ 
                $scope.arrayResult = data[index].show_cast.split(', ');
                }
            });
        }
    }());
    
    // back to home
   $scope.back = function(){
        $state.go("home");
    };     
    
}])
//************************** searchController Ends *************************//

//************************** My Factory Starts *************************//
myApp.factory("myFactory",function($http){
    return {                                                              
        list : [
            {
                value : '1',
                label : 'Title'
            },
            {
                value : '2',
                label : 'Director'
            },
            {
                value : '3',
                label : 'Actor'
            }
                       
          ]
    }
});

//************************** My Factory Ends *************************//

//************************** My Service Starts *************************//

myApp.service('myService', function(){
    this.name = "" ;
})

//************************** Service Ends *************************//
