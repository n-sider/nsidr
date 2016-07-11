"use strict";

angular.module( "App", [
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
        $routeProvider
            .when( "/", {
                templateUrl: "modules/_app/templates/home.html",
                meta: {
                    title: "Web Application | Index Page",
                    description: "Hello World"
                }
            } )
            .otherwise( { redirectTo: "/" } );

        $locationProvider.html5Mode( true );
        $sceDelegateProvider.resourceUrlWhitelist( [ "self" ] );
    }

] )

.constant( "APIRoot", "<< apiroot >>" + "/v1" )
.controller( "Site", require( "./controllers/site" ) )
.service( "AppApi", require( "./services/api" ) );
