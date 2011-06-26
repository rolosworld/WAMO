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
    var framedata;
    var controller = wamo.controller;
    if ( controller.getAction() == 'hit' ) {
      framedata = wamo.controller.getMeFrameData();
    } else {
      framedata = wamo.controller.getOpponentFrameData();
    }
    return framedata[wamo.controller.getMove()];      
  },

  getLinks: function() {
    return wamo.model.getLinks(wamo.controller.getMoveObject());
  },

  getCounterhitLinks: function() {
    return wamo.model.getCounterhitLinks(wamo.controller.getMoveObject());
  },

  getPunishments: function() {
    return wamo.model.getPunishments(wamo.controller.getMoveObject());
  },

  getCounterhitPunishments: function() {
    return wamo.model.getCounterhitPunishments(wamo.controller.getMoveObject());
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
      wamo.controller.onActionChange();
    });
  },

  onOpponentChange: function() {
    var opponent = wamo.controller.getOpponent();
    wamo.model.setOpponent(opponent);
    wamo.model.loadFrameData(opponent,function(){
      wamo.controller.onActionChange();
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
