/* App Configuration */

angular.module( "Nstitute", [
    "ngRoute",
    "ngTouch",
    "ngSanitize",
    "ngMessages",
    "ngAnimate",
    "vokal.API"
] )

.config( [ "$routeProvider", "$locationProvider", "$sceDelegateProvider",

    function ( $routeProvider, $locationProvider, $sceDelegateProvider )
    {
        "use strict";

        var moduleRoot = "modules/_nstitute/templates/";

        $routeProvider.when( "/not-found", {
            templateUrl: moduleRoot + "not-found.html",
            controller: "NotFound",
            controllerAs: "notfound"
        } );
        $routeProvider.otherwise( {
            redirectTo: "/"
        } );

        $locationProvider.html5Mode( true ).hashPrefix( "!" );

        $sceDelegateProvider.resourceUrlWhitelist(
            [ "self" ]
        );

    }

] );
