/* Home Module Configuration */

angular.module( "nstitute.home", [] )

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

angular.module( "nstitute" ).requires.push( "nstitute.home" );
