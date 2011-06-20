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

function csv_to_array( csv, sep ) {
  for (var foo = csv.split(sep = sep || ","), x = foo.length - 1, tl; x >= 0; x--) {
    if (foo[x].replace(/"\s+$/, '"').charAt(foo[x].length - 1) == '"') {
      if ((tl = foo[x].replace(/^\s+"/, '"')).length > 1 && tl.charAt(0) == '"') {
        foo[x] = foo[x].replace(/^\s*"|"\s*$/g, '').replace(/""/g, '"');
      } else if (x) {
        foo.splice(x - 1, 2, [foo[x - 1], foo[x]].join(sep));
      } else foo = foo.shift().split(sep).concat(foo);
    } else foo[x].replace(/""/g, '"');
  } return foo;
};

function csv_to_objArray( csv ) {
  var columns = Meta.array.$(),
  objArray = [],
  csv_arr = Meta.array.
    $( csv.split( "\n" ) ).
    forEach( function( row, index ) {
      row = csv_to_array( row );//row.split( ',' );

      if ( row.length < 2 ) {
        return;
      }

      if ( ! index ) {
        columns.
          set( row ).
          forEach( function( item, index ) {
            this.set( item, index );
          } );
        return;
      }

      var obj = {};
      columns.forEach( function( column, index ) {
        //console.log(row[index]);
        obj[column] = isFinite( row[index] ) ? eval( row[index] ) : row[index];
      } );

     objArray.push( obj );
    });

  return objArray;
};

var wamo = {
  framedata: {},
  characters: {},

  game: null,
  me: null,
  opponent: null,
  action: null,

  init: function() {
    var controller = wamo.controller;
    var model = wamo.model;
    var ui = wamo.ui;

    model.setGame(controller.getGame());
    model.setMe(controller.getMe());
    model.setOpponent(controller.getOpponent());
    model.setAction(controller.getAction());

    // Set UI callbacks
    ui.game.on('change',controller.onGameChange);
    ui.me.on('change',controller.onMeChange);
    ui.opponent.on('change',controller.onOpponentChange);
    ui.action.on('change',controller.onActionChange);
    ui.move.on('change',controller.onMoveChange);

    // Init defaults
    controller.onGameChange();
  }};
