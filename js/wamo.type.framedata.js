/*
 Copyright (c) 2011 Rolando González Chévere <rolosworld@gmail.com>

 This file is part of "WAMO".

 "WAMO" is free software: you can redistribute it and/or modify
 it under the terms of the GNU General Public License version 3
 as published by the Free Software Foundation.

 "WAMO" is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU General Public License for more details.

 You should have received a copy of the GNU General Public License
 along with "WAMO".  If not, see <http://www.gnu.org/licenses/>.
*/
wamo.type.framedata = {
  enabled: function(){return {};},
  isValidMove: function( move ) {
    return 1;
  },
  getObj: function() {
    return wamo.controller.getMe();
  },
  getFrameData: function() {
    return wamo.controller.getMeFrameData();
  },
  details: function() {
    var content = ['<h3>Frame Data</h3><table class="framedata" border="1" cellpadding="0" cellspacing="0">'];
    var data = wamo.type.framedata.getFrameData();

    var subTotal = function( s ) {
      var sub = 0;
      Meta.array.$( (s + '').match(/(\d+)/g) || [] ).forEach( function( v ) {
        sub += Meta.string.$( v ).toInt();
      } );
      return sub;
    };

    content.push('<tr>');
    for ( var i in data[0] ) {
      content.push('<th style="text-align:center;padding:2px;">' + i + '</th>');
    }
    content.push('<th style="text-align:center;padding:2px;">Total Frames</th>');
    content.push('</tr>');

    Meta.array.$( data ).forEach( function( move ) {
      content.push('<tr>');
      for ( var i in move ) {
        content.push('<td style="text-align:right;padding:2px;">' + move[i] + '</td>');
      }

      var total = subTotal( move.startup ) + subTotal( move.active ) + subTotal( move.recovery );

      content.push('<td style="text-align:right;padding:2px;">' + total + '</td>');
      content.push('</tr>');
    } );

    content.push('</table>');
    return content;
  }
};
