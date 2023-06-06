var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var game;
(function (game) {
    var MatchupData = (function () {
        function MatchupData() {
        }
        return MatchupData;
    }());
    game.MatchupData = MatchupData;
    __reflect(MatchupData.prototype, "game.MatchupData");
    var GameConsts = (function () {
        function GameConsts() {
        }
        GameConsts.is_iPhoneX = false;
        GameConsts.LineSize = 16;
        GameConsts.LineColors = [
            0xff7a68,
            0xffb61c,
            0x53f1ff,
            0xd7ff32,
        ];
        GameConsts.GuideInitDataList = [
            { row: 0, col: 0, colorValue: 3, digitValue: 1 },
            { row: 0, col: 1, colorValue: 1, digitValue: 1 },
            { row: 0, col: 2, colorValue: 3, digitValue: 2 },
            { row: 0, col: 3, colorValue: 1, digitValue: 2 },
            { row: 0, col: 4, colorValue: 2, digitValue: 2 },
            { row: 0, col: 5, colorValue: 1, digitValue: 3 },
            { row: 1, col: 0, colorValue: 1, digitValue: 2 },
            { row: 1, col: 1, colorValue: 4, digitValue: 3 },
            { row: 1, col: 2, colorValue: 1, digitValue: 2 },
            { row: 1, col: 3, colorValue: 3, digitValue: 3 },
            { row: 1, col: 4, colorValue: 1, digitValue: 2 },
            { row: 1, col: 5, colorValue: 3, digitValue: 1 },
            { row: 2, col: 0, colorValue: 3, digitValue: 3 },
            { row: 2, col: 1, colorValue: 3, digitValue: 3 },
            { row: 2, col: 2, colorValue: 3, digitValue: 2 },
            { row: 2, col: 3, colorValue: 3, digitValue: 1 },
            { row: 2, col: 4, colorValue: 1, digitValue: 1 },
            { row: 2, col: 5, colorValue: 3, digitValue: 1 },
            { row: 3, col: 0, colorValue: 1, digitValue: 1 },
            { row: 3, col: 1, colorValue: 4, digitValue: 1 },
            { row: 3, col: 2, colorValue: 3, digitValue: 3 },
            { row: 3, col: 3, colorValue: 1, digitValue: 1 },
            { row: 3, col: 4, colorValue: 3, digitValue: 2 },
            { row: 3, col: 5, colorValue: 2, digitValue: 3 },
            { row: 4, col: 0, colorValue: 1, digitValue: 3 },
            { row: 4, col: 1, colorValue: 1, digitValue: 2 },
            { row: 4, col: 2, colorValue: 1, digitValue: 3 },
            { row: 4, col: 3, colorValue: 3, digitValue: 1 },
            { row: 4, col: 4, colorValue: 2, digitValue: 3 },
            { row: 4, col: 5, colorValue: 1, digitValue: 1 },
            { row: 5, col: 0, colorValue: 1, digitValue: 3 },
            { row: 5, col: 1, colorValue: 3, digitValue: 2 },
            { row: 5, col: 2, colorValue: 3, digitValue: 1 },
            { row: 5, col: 3, colorValue: 4, digitValue: 3 },
            { row: 5, col: 4, colorValue: 3, digitValue: 1 },
            { row: 5, col: 5, colorValue: 3, digitValue: 3 }
        ];
        GameConsts.GuideDropDataList = [
            { row: 0, col: 0, colorValue: 3, digitValue: 1 },
            { row: 0, col: 1, colorValue: 1, digitValue: 1 },
            { row: 0, col: 2, colorValue: 3, digitValue: 2 },
            { row: 0, col: 3, colorValue: 1, digitValue: 2 },
            { row: 0, col: 4, colorValue: 3, digitValue: 1 },
            { row: 0, col: 5, colorValue: 1, digitValue: 3 },
            { row: 1, col: 0, colorValue: 1, digitValue: 2 },
            { row: 1, col: 1, colorValue: 4, digitValue: 3 },
            { row: 1, col: 2, colorValue: 1, digitValue: 2 },
            { row: 1, col: 3, colorValue: 1, digitValue: 2 },
            { row: 1, col: 4, colorValue: 2, digitValue: 2 },
            { row: 1, col: 5, colorValue: 1, digitValue: 3 },
            { row: 2, col: 0, colorValue: 3, digitValue: 3 },
            { row: 2, col: 1, colorValue: 3, digitValue: 3 },
            { row: 2, col: 2, colorValue: 3, digitValue: 2 },
            { row: 2, col: 3, colorValue: 3, digitValue: 3 },
            { row: 2, col: 4, colorValue: 1, digitValue: 2 },
            { row: 2, col: 5, colorValue: 3, digitValue: 1 },
            { row: 3, col: 0, colorValue: 1, digitValue: 1 },
            { row: 3, col: 1, colorValue: 4, digitValue: 1 },
            { row: 3, col: 2, colorValue: 3, digitValue: 3 },
            { row: 3, col: 3, colorValue: 3, digitValue: 1 },
            { row: 3, col: 4, colorValue: 1, digitValue: 1 },
            { row: 3, col: 5, colorValue: 3, digitValue: 1 },
            { row: 4, col: 0, colorValue: 1, digitValue: 3 },
            { row: 4, col: 1, colorValue: 1, digitValue: 2 },
            { row: 4, col: 2, colorValue: 1, digitValue: 3 },
            { row: 4, col: 3, colorValue: 1, digitValue: 1 },
            { row: 4, col: 4, colorValue: 3, digitValue: 2 },
            { row: 4, col: 5, colorValue: 2, digitValue: 3 },
            { row: 5, col: 0, colorValue: 1, digitValue: 3 },
            { row: 5, col: 1, colorValue: 3, digitValue: 2 },
            { row: 5, col: 2, colorValue: 3, digitValue: 1 },
            { row: 5, col: 3, colorValue: 4, digitValue: 3 },
            { row: 5, col: 4, colorValue: 2, digitValue: 3 },
            { row: 5, col: 5, colorValue: 1, digitValue: 1 }
        ];
        return GameConsts;
    }());
    game.GameConsts = GameConsts;
    __reflect(GameConsts.prototype, "game.GameConsts");
})(game || (game = {}));
//# sourceMappingURL=GameConsts.js.map