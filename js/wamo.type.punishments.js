/*
 Copyright (c) 2014 Rolando González Chévere <rolosworld@gmail.com>

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
wamo.type.punishments = {
  enabled: function(){
    return {
      opponent: 1
    };
  },
  isValidMove: function( move ) {
    return 1;
  },
  getObj: function() {
    return wamo.controller.getOpponent();
  },
  getFrameData: function() {
    return wamo.controller.getOpponentFrameData();
  },
  details: function() {
    var content = [];
    var punishments = wamo.controller.getAllPunishments();
    Meta.each(punishments, function(val, key) {
      if ((val.normal && val.normal.length) || (val.counterhit && val.counterhit.length)) {
        content.push('<form><fieldset><legend>' + key + '</legend>');

        if (val.normal.length) {
          content.push('<dl><dt>Normal</dt><dd><ul>');
          Meta.array.$( val.normal ).forEach( function( move ) {
            content.push('<li>' + pretty_name( move ) + '(' + move.frames + ')</li>');
          } );
          content.push('</ul></dd></dl>');
        }

        if (val.counterhit.length) {
          content.push('<dl><dt>Counterhit</dt><dd><ul>');
          Meta.array.$( val.counterhit ).forEach( function( move ) {
            content.push('<li>' + pretty_name( move ) + '(' + move.frames + ')</li>');
          } );
          content.push('</ul></dd></dl>');
        }

        content.push('</fieldset></form>');
      }
    }, 1);
    return content;
  }
};
