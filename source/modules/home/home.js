/* Home Module Configuration */

angular.module( "Home", [] )

.config( [ "$routeProvider", "$locationProvider", "$sceDelegateProvider",

    function ( $routeProvider, $locationProvider, $sceDelegateProvider )
    {
        "use strict";

        var moduleRoot = "modules/home/templates/";

        $routeProvider.when( "/", {
            templateUrl: moduleRoot + "home.html",
            controller: "Home",
            controllerAs: "home"
        } );

        $locationProvider.html5Mode( true ).hashPrefix( "!" );

        $sceDelegateProvider.resourceUrlWhitelist(
            [ "self" ]
        );

    }

] );

angular.module( "Nstitute" ).requires.push( "Home" );
