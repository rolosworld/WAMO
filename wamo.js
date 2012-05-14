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

var frmdata = {};

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
};

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

function fastest_startup( attacks ) {
  var fast_startup = 10;

  Meta.array.$( attacks ).forEach( function( attack ) {
    if ( attack.stun && attack.startup < fast_startup ) {
      fast_startup = attack.startup;
    }
  } );

  return fast_startup;
};

function drawLi( type, a, diff, diff2 ) {
  return '<li class="' + type + '">' + ( a.move || a.input ) + '(' + diff2 + ',<span class="worst">' + diff + '</span>)</li>';
};

function drawTr( punish, review ) {
  return '<tr><td>' + moveReview( punish.ataque ) + '</td><td><ul>' + review.join('') + '</li></td></tr>';
};

function dothis( callback ) {
  var p1 = Meta.dom.$().select('#p1_select').val(),
  p2 = Meta.dom.$().select('#p2_select').val(),
  done = 0,
  dataSrc = 'frame_data/';
  
  function getData( indx ) {
    if ( ! ( indx in frmdata ) )  {
      done++;
      Meta.ajax( {
        url: dataSrc + indx,
        callbacks: function(a) {
          frmdata[indx] = csv_to_objArray( a.text() );
          --done;
          if ( ! done ) {
            callback( p1, p2 );
          }
        }
      } );
    }
  }
  
  getData( p2 );
  getData( p1 );

  if ( ! done ) {
    callback( p1, p2 );
  }
};

function _sort( a, b ) {
  return a.startup - b.startup;
};

function preferenceType( adv, a ) {
  if ( adv > a.startup ) {
    return 'best';
  } else if ( adv == a.startup ) {
    return 'medium';
  }
  
  return 'worst';
};

function onhitDrawLi( ataque, fast_startup, a, counterhitAdv ) {
  var adv = ataque.ataque.frame_adv_hit + counterhitAdv;
  var diff = adv + fast_startup - a.startup + 1;
  var diff2 = adv - a.startup + 1;
  
  if ( diff2 < 1 ) {
    return null;
  }

  var preference = preferenceType( adv, a );
  if ( preference == 'best' &&
       "block" in a &&
       isFinite( a.block ) ) {
    preference = 'medium';
  }
  
  return drawLi( preference, a, diff, diff2 );
};

function getPossibleLinks( atacante ) {
  var links_lista = [];
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
  
  return links_lista;
};

function getPossiblePunishments( atacante, bloqueante ) {
  var castigos_lista = [];
  var fast_startup = fastest_startup( atacante );

  Meta.array.$( atacante ).forEach( function( ataque ) {
    var castigos = [];
    Meta.array.$( bloqueante ).forEach(function( castigo ) {
      if ( fast_startup - ataque.frame_adv_block >= castigo.startup ) {
        castigos.push( castigo );
      }
    } );
    castigos_lista.push( { ataque: ataque, castigos: castigos } );
  } );
  
  return castigos_lista;
};

function onblockDrawLi( hit_adv, a, adv ) {
  var diff = hit_adv - a.startup;
  var diff2 = adv - a.startup;
  
  return drawLi( preferenceType( adv, a ), a, diff, diff2 );
};

function counterhitAdv( focusPassed, ataque ) {
  if ( focusPassed ) {
    return 3;
  }
  
  return (ataque.move + '').search(/light/i) != -1 ? 1 : 3;
};

function onblock() {
  dothis( process );

  function process( p1, p2 ) {
    var atacante = frmdata[p1];
    var bloqueante = frmdata[p2];

    var fast_startup = 100;

    // Fastest startup
    fast_startup = fastest_startup( atacante );

    var rows = ['<tr><th>Blocked Move</th><th>Available Options</th></tr>'];

    Meta.array.$( getPossiblePunishments( atacante, bloqueante ) ).forEach( function( castigos ) {
      var review = [],
      adv = castigos.ataque.frame_adv_block * -1,
      hit_adv = fast_startup + adv;

      Meta.array.$( castigos.castigos ).
        sort( _sort ).
        forEach( function( a ) {
	  review.push( onblockDrawLi( hit_adv, a, adv ) );
        } );

      rows.push( drawTr( castigos, review ) );
    } );

    Meta.dom.$().select('#box').inner('<table>' + rows.join('') + '</table>');
  };
};

function onhit() {
  dothis( process );

  function process( p1, p2 ) {
    var atacante = frmdata[p1];
    var victima = frmdata[p2];
    
    var fast_startup = 100;

    // Fastest startup
    fast_startup = fastest_startup( victima );

    var rows = ['<tr><th>Connected Move</th><th>Available Options</th></tr>'];

    Meta.array.$( getPossibleLinks( atacante ) ).forEach( function( ataque ) {
      var review = [];

      Meta.array.$( ataque.contra_ataque ).
        sort( _sort ).
        forEach( function( a ) {
	  var li = onhitDrawLi( ataque, fast_startup, a, 0 );
	  if ( li ) {
	    review.push( li );
	  }
        });

      review.push('<h2>On Counterhit:</h2>');

      var focusPassed = false;
      Meta.array.$( ataque.contra_ataque ).
        sort( _sort ).
        forEach( function( a ) {
          if ( ! focusPassed && (ataque.ataque.move + '').search(/focus/i) != -1 ) {
            focusPassed = true;
          }
	  
	  var li = onhitDrawLi( ataque, fast_startup, a, counterhitAdv( focusPassed, ataque.ataque ) );
	  if ( li ) {
	    review.push( li );
	  }
	});

      rows.push( drawTr( ataque, review ) );
    } );

    Meta.dom.$().select('#box').inner('<table>' + rows.join('') + '</table>');
  };
};
