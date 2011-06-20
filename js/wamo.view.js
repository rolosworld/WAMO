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
wamo.view = {
  resetCharacters: function() {
    var chars = wamo.model.getCharacters();
    
    var rows = [];
    for( var i in chars ) {
      rows.push('<option value="' + chars[i] + '">' + i + '</option>');
    }

    rows = rows.join('');
    wamo.ui.me.inner(rows);
    wamo.ui.opponent.inner(rows);
  },
  resetMoves: function() {
    var who;
    if ( wamo.controller.getAction() == 'hit' ) {
      who = wamo.controller.getMe();
    } else {
      who = wamo.controller.getOpponent();
    }
    var framedata = wamo.model.getFrameData(who);
    
    var rows = [];
    for( var i in framedata ) {
      rows.push('<option value="' + i + '">' + framedata[i].move + '</option>');
    }

    wamo.ui.move.inner(rows.join(''));
  },
  resetDetails: function() {
    var content = [];
    var usedMove = wamo.controller.getMoveObject();

    if ( wamo.controller.getAction() == 'hit' ) {
      content.push('<h3>Links available</h3>');
      Meta.array.$( wamo.controller.getLinks() ).forEach( function( move ) {
        content.push('<div>' + move.move + '(' + move.frames + ')</div>');
      } );

      content.push('<h3>Counterhit Links available</h3>');
      Meta.array.$( wamo.controller.getCounterhitLinks() ).forEach( function( move ) {
        content.push('<div>' + move.move + '(' + move.frames + ')</div>');
      } );
    } else {
      content.push('<h3>Punishments available</h3>');
      Meta.array.$( wamo.controller.getPunishments() ).forEach( function( move ) {
        content.push('<div>' + move.move + '(' + move.frames + ')</div>');
      } );

      content.push('<h3>Counterhit Punishments available</h3>');
      Meta.array.$( wamo.controller.getCounterhitPunishments() ).forEach( function( move ) {
        content.push('<div>' + move.move + '(' + move.frames + ')</div>');
      } );
    }

    wamo.ui.details.inner(content.join(''));
  },
  resetAction: function() {
    wamo.ui.opponent.attr('disabled', wamo.controller.getAction() == 'hit' ? 'disabled' : null);
  }
};
