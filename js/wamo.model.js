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
wamo.model = {
  varEval: function( a ) {
      var b = a;
      try {
          a = eval(a);
          b = a;
      } catch (x) {
/*
          if (console && console.log) {
              console.log("Failed eval for: " + b);
          }
*/
      }
      return parseInt(b,10);
  },
  totalActive: function( a ) {
      a = a + '';
      if (!a || a.length < 3) {
          return a;
      }
      var b = a.split('*');
      var c = 0;
      for (var i = 0; i < b.lenght; i++) {
          c += b[i];
      }
      return parseInt(c,10);
  },
  meatyAdvantage: function( move ) {
      return move.frame_adv_hit + ( wamo.model.totalActive(move.active) - 1 );
  },
  framesNeededToLink: function( move1, move2 ) {
      return move1.frame_adv_hit - wamo.model.varEval(move2.startup);
  },
  framesNeededToMeatyLink: function( move1, move2 ) {
      return wamo.model.meatyAdvantage(move1) - wamo.model.varEval(move2.startup);
  },
  framesNeededToPunish: function( move1, move2 ) {
      return wamo.model.varEval(move2.startup) + parseInt(move1.frame_adv_block,10) - 1;
  },
  framesNeededToCounterPunish: function( move1, move2, his_fast_startup ) {
      return wamo.model.framesNeededToPunish(move1, move2) - his_fast_startup;
  },
  fastest_startup: function( framedata ) {
    var fast_startup = 10;

    Meta.array.$(framedata).forEach( function( move ) {
      if ( move.recovery != '-' && move.stun && wamo.model.varEval(move.startup) < fast_startup ) {
        fast_startup = wamo.model.varEval(move.startup);
      }
    } );

    return fast_startup;
  },

  loadFrameData: function( character, callback ) {
    if ( wamo.framedata[wamo.game] && character in wamo.framedata[wamo.game] ) {
      callback();
      return;
    }

    Meta.ajax( {
      url: wamo.game + '/frame_data/' + character,
      callbacks: function(a) {
        if ( !(wamo.game in wamo.framedata) ) {
	  wamo.framedata[wamo.game] = {};
	}
        wamo.framedata[wamo.game][character] = csv_to_objArray( a.text() );
        callback();
      }
    } );
  },

  getFrameData: function( character ) {
    return wamo.framedata[wamo.game][character];
  },

  loadCharacters: function( callback ) {
    if (wamo.game in wamo.characters) {
      callback();
      return;
    }

    Meta.ajax( {
      url: wamo.game + '/characters.js',
      callbacks: function(a) {
        wamo.characters[wamo.game] = a.json();
        callback();
      }
    } );
  },

  getCharacters: function() {
    return wamo.characters[wamo.game];
  },

  getLinks: function( move ) {
    var links = [];
    var framedata = wamo.controller.getMeFrameData();
    Meta.array.$( framedata ).forEach( function( nextMove ) {
      var normalLink = wamo.model.framesNeededToLink(move,nextMove);
      if ( normalLink >= 0 ) {
        links.push( Meta(nextMove).extend({frames: normalLink + 1}) );
      }
    });
    
    return links;
  },

  getMeatyLinks: function( move ) {
    var links = [];
    var framedata = wamo.controller.getMeFrameData();
    Meta.array.$( framedata ).forEach( function( nextMove ) {
      var normalLink = wamo.model.framesNeededToMeatyLink(move,nextMove);
      if ( normalLink > 0 ) {
        links.push( Meta(nextMove).extend({frames: Math.abs( normalLink )}) );
      }
    });
    
    return links;
  },

  counterhitBonus: function( move ) {
    var moveName = pretty_name( move ) + '';
    if ( moveName.search(/focus/i) != -1 ) {
      return 3;
    }
  
    return moveName.search(/light|lp|lk/i) != -1 ? 1 : 3;
  },

  getCounterhitLinks: function( move ) {
    var links = [];
    var framedata = wamo.controller.getMeFrameData();
    var chBonus = wamo.model.counterhitBonus( move );

    Meta.array.$( framedata ).forEach( function( nextMove ) {
      var normalLink = wamo.model.framesNeededToLink(move,nextMove);
      if ( normalLink > 0 || nextMove.frames > 0 ) {
        links.push( Meta(nextMove).extend({frames: chBonus + normalLink}) );
      }
    });
    
    return links;
  },

  getMeatyCounterhitLinks: function( move ) {
    var links = [];
    var framedata = wamo.controller.getMeFrameData();
    var chBonus = wamo.model.counterhitBonus( move );

    Meta.array.$( framedata ).forEach( function( nextMove ) {
      var normalLink = wamo.model.framesNeededToMeatyLink(move,nextMove);
      nextMove.frames = chBonus + normalLink;
      if ( normalLink > 0 || nextMove.frames > 0 ) {
        links.push( Meta(nextMove).extend({frames: nextMove.frames}) );
      }
    });
    
    return links;
  },

  getPunishments: function( move ) {
    var punishments = [];
    var framedata = wamo.controller.getMeFrameData();

    Meta.array.$( framedata ).forEach( function( punish ) {
      var normalPunish = wamo.model.framesNeededToPunish(move,punish);
      if ( normalPunish < 0 ) {
        punishments.push( Meta(punish).extend({frames: normalPunish * -1}) );
      }
    } );
  
    return punishments;
  },

  getCounterhitPunishments: function( move ) {
    var punishments = [];
    var framedata = wamo.controller.getMeFrameData();
    var his_fast_startup = wamo.model.fastest_startup( wamo.controller.getOpponentFrameData() );

    Meta.array.$( framedata ).forEach( function( punish ) {
      var normalPunish = wamo.model.framesNeededToCounterPunish(move, punish, his_fast_startup);
      if ( normalPunish < 0 ) {
        punishments.push(Meta(punish).extend({frames: normalPunish * -1}));
      }
    } );
  
    return punishments;
  },

  setGame: function( game ) {
    wamo.game = game;
  },

  setMe: function( me ) {
    wamo.me = me;
  },

  setOpponent: function( opponent ) {
    wamo.opponent = opponent;
  },

  setAction: function( action ) {
    wamo.action = action;
  }
};
