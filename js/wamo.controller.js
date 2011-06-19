wamo.controller = {
  getGame: function() {
    return wamo.ui.game.val();
  },
  getMe: function() {
    return wamo.ui.me.val();
  },
  getOpponent: function() {
    return wamo.ui.opponent.val();
  },
  getAction: function() {
    return wamo.ui.action.val();
  },
  getMove: function() {
    return wamo.ui.move.val();
  },

  getMeFrameData: function() {
    var me = wamo.controller.getMe();
    return wamo.model.getFrameData(me);
  },

  getOpponentFrameData: function() {
    var opponent = wamo.controller.getOpponent();
    return wamo.model.getFrameData(opponent);
  },

  getMoveObject: function() {
    var meFrameData = wamo.controller.getMeFrameData();
    return meFrameData[wamo.controller.getMove()];      
  },

  getLinks: function() {
    return wamo.model.getLinks(wamo.controller.getMoveObject());
  },

  getPunishments: function() {
    return wamo.model.getPunishments(wamo.controller.getMoveObject());
  },

  onGameChange: function() {
    wamo.model.setGame(wamo.controller.getGame());
    wamo.model.loadCharacters(function(){
      wamo.view.resetCharacters();
      wamo.controller.onMeChange();
    });
  },

  onMeChange: function() {
    var me = wamo.controller.getMe();
    wamo.model.setMe(me);
    wamo.model.loadFrameData(me,function(){
      wamo.view.resetMoves();
      wamo.controller.onMoveChange();
    });
  },

  onOpponentChange: function() {
    var opponent = wamo.controller.getOpponent();
    wamo.model.setOpponent(opponent);
    wamo.model.loadFrameData(opponent,function(){
      wamo.view.resetMoves();
      wamo.controller.onMoveChange();
    });
  },

  onActionChange: function() {
    wamo.model.setAction(wamo.controller.getAction());
    wamo.view.resetAction();
    wamo.view.resetMoves();
    wamo.controller.onMoveChange();
  },

  onMoveChange: function() {
    wamo.view.resetDetails();
  }
};
