var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var game;
(function (game) {
    var EventConsts = (function () {
        function EventConsts() {
        }
        /**
         * 广告数据已加载完成
         */
        EventConsts.EVENT_ADDATA_LOADED = "ADDATA_LOADED";
        /**
        * GAME_OVER
         */
        EventConsts.EVENT_GAME_OVER = "GAME_OVER";
        /**
        * 闯关成功
        */
        EventConsts.EVENT_GAME_SUCCESS = "GAME_SUCCESS";
        /**
         * 更新游戏信息
         */
        EventConsts.EVENT_UPDATE_GAME_INFO = "UPDATE_GAME_INFO";
        /**
         * 更新游戏信息
         */
        EventConsts.EVENT_ADD_SCORE = "ADD_SCORE";
        /**
         * 步数不足
         */
        EventConsts.EVENT_STEP_NOTENOUGH = "STEP_NOTENOUGH";
        /**
         * 通告概率已经发生调整
         */
        EventConsts.EVENT_PROBABILITY_CHANGED = "PROBABILITY_CHANGED";
        EventConsts.EVENT_UPDATE_SKIN = "UPDATE_SKIN";
        return EventConsts;
    }());
    game.EventConsts = EventConsts;
    __reflect(EventConsts.prototype, "game.EventConsts");
})(game || (game = {}));
//# sourceMappingURL=EventConsts.js.map