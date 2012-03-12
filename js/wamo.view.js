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
    wamo.ui.meParent.inner( '<select name="myChar">' + rows + '</select>' );
    wamo.ui.resetMe();

    wamo.ui.opponentParent.inner( '<select name="opponentChar">' + rows + '</select>' );
    wamo.ui.resetOpponent();
  },
  resetMoves: function() {
    var type = wamo.type.get();
    var framedata = wamo.model.getFrameData(type.getObj());
    
    var rows = ['<select name="move">'];
    for( var i in framedata ) {
      if ( type.isValidMove( framedata[i] ) ) {
        rows.push('<option value="' + i + '">' + pretty_name( framedata[i] ) + '</option>');
      }
    }
    rows.push('</select>');

    wamo.ui.moveParent.inner(rows.join(''));
    wamo.ui.resetMove();
  },
  resetDetails: function() {
    wamo.ui.details.inner(wamo.type.get().details().join(''));
  },
  resetAction: function() {
    wamo.ui.opponent.attr('disabled', wamo.controller.getAction() != 'blocked' ? 'disabled' : null);
  }
};
