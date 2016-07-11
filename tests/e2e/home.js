"use strict";

describe( "The homepage", function ()
{
    it( "should exist", function ()
    {
        browser.get( "/" );

        expect( $( "main" ).isPresent() ).toBe( true );
    } );
} );
