/* Site controller */

angular.module( "nstitute" )

.controller( "Site", [ "$rootScope",

    function ( $rootScope )
    {
        "use strict";
        var ctrl = this;

        ctrl.currYear = new Date().getFullYear();

    }

] );
