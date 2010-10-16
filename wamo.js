/*
 Copyright (c) 2010 Rolando González Chévere <rolosworld@gmail.com>

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

function load_dropdown( select, id, onchange ) {
  var data = frame_data, rows = [];
  for( var i in data ) {
    rows.push('<option value="' + data[i] + '">' + i + '</option>');
  }

  select.inner('<select id="' + id + '" onchange="' + onchange + '">' + rows.join('') + '</select>');
};

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
}

function moveReview( move ) {
  var arr = [];
  for( var i in move ) {
    if ( move.hasOwnProperty(i) ) {
      if ( i == 'move' || i == 'input' ) {
        if ( move[i] ) {
          arr.push( '<caption>' + move[i] + '</caption>' );
        }
      } else {
        arr.push( '<tr><th>' + i + '</th><td>' + move[i] + '</td></tr>' );
      }
    }
  }

  return '<table class="move-review">' + arr.join('') + '</table>';
};

function onblock() {
  var atacante = Meta.dom.$().select('#atacante_select').val(),
  bloqueante = Meta.dom.$().select('#bloqueante_select').val(),
  done = 0,
  dataSrc = 'frame_data/';
  Meta.ajax( {
    url: dataSrc + bloqueante,
    callbacks: function(a) {
      bloqueante = csv_to_objArray( a.text() );
      process();
    }
  } );

  Meta.ajax( {
    url: dataSrc + atacante,
    callbacks: function(a) {
      atacante = csv_to_objArray( a.text() );
      process();
    }
  } );

  function process() {
    if ( ! done++ ) {
      return;
    }

    var fast_startup = 100,castigos_lista = [];

    Meta.array.$( atacante ).forEach( function( ataque ) {
      if ( ataque.stun && ataque.startup < fast_startup ) {
        fast_startup = ataque.startup;
      }
    } );

    Meta.array.$( atacante ).forEach( function( ataque ) {
      var castigos = [];
      Meta.array.$( bloqueante ).forEach(function( castigo ) {
        if ( fast_startup - ataque.frame_adv_block >= castigo.startup ) {
          castigos.push( castigo );
        }
      } );
      castigos_lista.push( { ataque: ataque, castigos: castigos } );
    } );

    var rows = ['<tr><th>Blocked Move</th><th>Available Options</th></tr>'];

    Meta.array.$( castigos_lista ).forEach( function( castigos ) {
      var review = [],
      adv = castigos.ataque.frame_adv_block * -1,
      hit_adv = fast_startup + adv;

      Meta.array.$( castigos.castigos ).
        sort( function( a, b ) {
          return (hit_adv - b.startup) - (hit_adv - a.startup);
        } ).
        forEach( function( a ) {
          var diff = hit_adv - a.startup;
          var diff2 = adv - a.startup;

          if ( adv > a.startup ) {
            review.push( '<li class="best">' + ( a.move || a.input ) + '(' + diff2 + ',<span class="worst">' + diff + '</span>)</li>' );
          } else if ( adv == a.startup ) {
            review.push( '<li class="medium">' + ( a.move || a.input ) + '(' + diff2 + ',<span class="worst">' + diff + '</span>)</li>' );
          } else {
            review.push( '<li class="worst">' + ( a.move || a.input ) +'(' + diff2 + ', ' + diff + ')</li>' );
          }
        } );

      //rows.push( '<tr><td>' + ( castigos.ataque.move || castigos.ataque.input ) + '</td><td><ul>' + review.join('') + '</li></td></tr>' );
      rows.push( '<tr><td>' + moveReview( castigos.ataque ) + '</td><td><ul>' + review.join('') + '</li></td></tr>' );
    } );

    Meta.dom.$().select('#box').inner('<table>' + rows.join('') + '</table>');
  };
};

function counterhitAdv( focusPassed, ataque ) {
  if ( focusPassed ) {
    return 3;
  }
  
  return ataque.move.search(/light/i) != -1 ? 1 : 3;
};

function onhit() {
  var atacante = Meta.dom.$().select('#atacante_select').val(),
  victima = Meta.dom.$().select('#victima_select').val(),
  done = 0,
  dataSrc = 'frame_data/';
  Meta.ajax( {
    url: dataSrc + victima,
    callbacks: function(a) {
      victima = csv_to_objArray( a.text() );
      process();
    }
  } );

  Meta.ajax( {
    url: dataSrc + atacante,
    callbacks: function(a) {
      atacante = csv_to_objArray( a.text() );
      process();
    }
  } );

  function process() {
    if ( ! done++ ) {
      return;
    }

    var fast_startup = 100, links_lista = [];

    Meta.array.$( victima ).forEach( function( ataque ) {
      if ( ataque.stun && ataque.startup < fast_startup ) {
        fast_startup = ataque.startup;
      }
    } );

    Meta.array.$( atacante ).forEach( function( ataque ) {
      var links = [];
      Meta.array.$( atacante ).forEach(function( segundo_ataque ) {
        var counter_frames = segundo_ataque.startup - ataque.frame_adv_hit;
        if ( isNaN( counter_frames ) ) {
          return;
        }

        //if ( counter_frames < fast_startup ) {
          links.push( segundo_ataque );
        //}
      });

      links_lista.push( { ataque: ataque, contra_ataque: links } );
    } );

    var rows = ['<tr><th>Connected Move</th><th>Available Options</th></tr>'];

    Meta.array.$( links_lista ).forEach( function( ataque ) {
      var review = [];

      Meta.array.$( ataque.contra_ataque ).
        sort( function( a, b ) {
          return a.startup - b.startup;
        } ).
        forEach( function( a ) {
          var adv = ataque.ataque.frame_adv_hit;
          var diff = adv + fast_startup - a.startup + 1;
          var diff2 = adv - a.startup + 1;

          if ( diff2 < 1 ) {
            return;
          }
                   
          if ( adv > a.startup ) {
            if ( "block" in a && isFinite( a.block ) ) {
              review.push( '<li class="medium">' + ( a.move || a.input ) + '(' + diff2 + ',<span class="worst">' + diff + '</span>)</li>' );
            } else {
              review.push( '<li class="best">' + ( a.move || a.input ) + '(' + diff2 + ',<span class="worst">' + diff + '</span>)</li>' );
            }
          } else if ( adv == a.startup ) {
            review.push( '<li class="medium">' + ( a.move || a.input ) + '(' + diff2 + ',<span class="worst">' + diff + '</span>)</li>' );
          } else {
            review.push( '<li class="worst">' + ( a.move || a.input ) +'(' + diff2 + ', ' + diff + ')</li>' );
          }
        });

      review.push('<h2>On Counterhit:</h2>');

      var focusPassed = false;
      Meta.array.$( ataque.contra_ataque ).
        sort( function( a, b ) {
          return a.startup - b.startup;
        } ).
        forEach( function( a ) {
          if ( ! focusPassed && ataque.ataque.move.search(/focus/i) != -1 ) {
            focusPassed = true;
          }
          var adv = ataque.ataque.frame_adv_hit + counterhitAdv( focusPassed, ataque.ataque );
          var diff = adv + fast_startup - a.startup + 1;
          var diff2 = adv - a.startup + 1;

          if ( diff2 < 1 ) {
            return;
          }

          if ( adv > a.startup ) {
            if ( "block" in a && isFinite( a.block ) ) {
              review.push( '<li class="medium">' + ( a.move || a.input ) + '(' + diff2 + ',<span class="worst">' + diff + '</span>)</li>' );
            } else {
              review.push( '<li class="best">' + ( a.move || a.input ) + '(' + diff2 + ',<span class="worst">' + diff + '</span>)</li>' );
            }
          } else if ( adv == a.startup ) {
            review.push( '<li class="medium">' + ( a.move || a.input ) + '(' + diff2 + ',<span class="worst">' + diff + '</span>)</li>' );
          } else {
            review.push( '<li class="worst">' + ( a.move || a.input ) +'(' + diff2 + ', ' + diff + ')</li>' );
          }
        });
                                           
      //rows.push( '<tr><td>' + ( ataque.ataque.move || ataque.ataque.input ) + '</td><td><ul>' + review.join('') + '</ul></td></tr>' );
      rows.push( '<tr><td>' + moveReview( ataque.ataque ) + '</td><td><ul>' + review.join('') + '</ul></td></tr>' );
    } );

    Meta.dom.$().select('#box').inner('<table>' + rows.join('') + '</table>');
  };
};
