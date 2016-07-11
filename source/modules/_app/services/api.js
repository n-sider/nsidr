"use strict";

module.exports = [ "API", "APIRoot",

    function ( API, APIRoot )
    {
        return new API( {
            rootPath: APIRoot
        } );
    }

];
