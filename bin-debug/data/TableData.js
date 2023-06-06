var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var game;
(function (game) {
    var TableData = (function () {
        function TableData() {
        }
        //-----------------------------------------------------------------------------------
        TableData.init = function () {
            TableData.tableGameConfig = RES.getRes("TableGameConfig_json")[0];
            TableData.tableSceneLevelConfig = RES.getRes("TableSceneLevelConfig_json");
            TableData.tableBackgroundConfig = RES.getRes("TableBackgroundConfig_json");
            TableData.tableSkinConfig = RES.getRes("TableSkinConfig_json");
        };
        //-----------------------------------------------------------------------------------
        TableData.getSceneLevelConfig = function (level) {
            for (var i = 0; i < TableData.tableSceneLevelConfig.length; i++) {
                var config = TableData.tableSceneLevelConfig[i];
                if (config.level == level) {
                    return config;
                }
            }
            return null;
        };
        TableData.getBackgroundConfig = function (id) {
            for (var i = 0; i < TableData.tableBackgroundConfig.length; i++) {
                var config = TableData.tableBackgroundConfig[i];
                if (config.id == id) {
                    return config;
                }
            }
            return null;
        };
        TableData.getSkinConfig = function (id) {
            for (var i = 0; i < TableData.tableSkinConfig.length; i++) {
                var config = TableData.tableSkinConfig[i];
                if (config.id == id) {
                    return config;
                }
            }
            return null;
        };
        return TableData;
    }());
    game.TableData = TableData;
    __reflect(TableData.prototype, "game.TableData");
})(game || (game = {}));
//# sourceMappingURL=TableData.js.map