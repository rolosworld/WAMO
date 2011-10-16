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
  getObj: function() {
    return wamo.controller.getMe();
  },
  getFrameData: function() {
    return wamo.controller.getMeFrameData();
  },
  details: function() {
    var content = ['<h3>Frame Data</h3><table>'];
    var data = wamo.controller.getMoveObject();
    Meta.array.$( data ).forEach( function( move ) {
      for ( var i in move ) {
        content.push('<tr><th style="text-align:right;">' + i + ':</th><td>' + move[i] + '</td></tr>');
      }
    } );
    content.push('</table>');
    return content;
  }
};
