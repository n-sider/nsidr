/* Site controller */

angular.module( "Nstitute" )

.controller( "Site", [

    function ()
    {
        "use strict";
        var ctrl = this;

        ctrl.currYear = new Date().getFullYear();

    }

] );
