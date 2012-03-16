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
wamo.type.blocked = {
  isValidMove: function( move ) {
    return move.active && (move.block + '').match(/[HLM]/);
  },
  getObj: function() {
    return wamo.controller.getOpponent();
  },
  getFrameData: function() {
    return wamo.controller.getOpponentFrameData();
  },
  details: function() {
    var content = [];
    content.push('<h3>Punishments available</h3>');
    Meta.array.$( wamo.controller.getPunishments() ).forEach( function( move ) {
      content.push('<div>' + pretty_name( move ) + '(' + move.frames + ')</div>');
    } );

    content.push('<h3>Counterhit Punishments available</h3>');
    Meta.array.$( wamo.controller.getCounterhitPunishments() ).forEach( function( move ) {
      content.push('<div>' + pretty_name( move ) + '(' + move.frames + ')</div>');
    } );
    return content;
  }
};
