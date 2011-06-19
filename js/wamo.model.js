wamo.model = {
  fastest_startup: function( framedata ) {
    var fast_startup = 10;

    Meta.array.$(framedata).forEach( function( move ) {
      if ( move.stun && move.startup < fast_startup ) {
        fast_startup = move.startup;
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
    var framedata = wamo.framedata[wamo.game][wamo.me];
    Meta.array.$( framedata ).forEach( function( nextMove ) {
      if ( nextMove.startup - move.frame_adv_hit <= 0 ) {
        links.push( nextMove );
      }
    });
    
    return links;
  },

  getCounterhitLinks: function() {
  },

  getPunishments: function( move ) {
    var punishments = [];
    var framedata = wamo.framedata[wamo.game][wamo.me];

    Meta.array.$( framedata ).forEach( function( punish ) {
      if ( punish.startup + move.frame_adv_block <= 0 ) {
        punishments.push( punish );
      }
    } );
  
    return punishments;
  },

  getCounterhitPunishments: function( move ) {
    var punishments = [];
    var framedata = wamo.framedata[wamo.game][wamo.me];
    var fast_startup = wamo.model.fastest_startup( framedata );

    Meta.array.$( framedata ).forEach( function( punish ) {
      if ( fast_startup - move.frame_adv_block >= punish.startup ) {
        punishments.push( punish );
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
