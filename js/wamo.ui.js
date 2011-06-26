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
wamo.ui = {
  game: Meta.dom.$().select('#game'),
  meParent: Meta.dom.$().select('#myChar'),
  opponentParent: Meta.dom.$().select('#opponentChar'),
  action: Meta.dom.$().select('#action'),
  moveParent: Meta.dom.$().select('#move'),
  details: Meta.dom.$().select('#details'),
  me: null,
  opponent: null,
  move: null,
  resetMe: function() {
    wamo.ui.me = Meta.dom.$(wamo.ui.meParent.first());
    wamo.ui.me.on('change',wamo.controller.onMeChange);
  },
  resetOpponent: function() {
    wamo.ui.opponent = Meta.dom.$(wamo.ui.opponentParent.first());
    wamo.ui.opponent.on('change',wamo.controller.onOpponentChange);
  },
  resetMove: function() {
    wamo.ui.move = Meta.dom.$(wamo.ui.moveParent.first());
    wamo.ui.move.on('change',wamo.controller.onMoveChange);
  }
};
