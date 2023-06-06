var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var game;
(function (game) {
    var GameMatchup = (function () {
        function GameMatchup() {
        }
        return GameMatchup;
    }());
    game.GameMatchup = GameMatchup;
    __reflect(GameMatchup.prototype, "game.GameMatchup");
    var GameInfo = (function () {
        function GameInfo() {
            this.config = null;
            this.sceneLevel = 0;
            this.maxSceneLevel = 0;
            this.maxScore = 0;
            this.curScore = 0;
            this.curChips = 0; // 玩家当前的金币
            this.winChips = 0; // 玩家当前赢得的金币
            this.sharedFristTimeInDay = 0;
            this.sharedTimesInDay = 0; // 今日分享成功多少次?
            this.canShared = false; // 临时变量
            this.videoFristTimeInDay = 0;
            this.videoTimesInDay = 0; // 今日任务视频看成功多少次?
            this.canVideo = false; // 临时变量
            this.soundEnabled = true;
            this.musicEnabled = true;
            this.needGuide = true;
            this.gameTimestamp = 0; // 游戏时间戳
            this.gameDays = 0; // 连续游戏天数
            this.signinDays = 0; // 签到天数
            this.totalSigninDays = 0; // 累计签到天数
            this.signTimestamp = 0; // 签到时间戳
            this.signinRewards = []; // 签到的奖励列表 [类型，值] 类型1：提示 类型2:钥匙  值：奖励数量
            this.signinCycle = 0; // 签到的周期,即（过了几圈）
            this.backgroundId = 0; // 背景皮肤ID
            this.skinId = 0; // 皮肤ID
        }
        GameInfo.prototype.init = function () {
            this.openId = uniLib.Utils.getLocalStorage("MAGICDIGIT_openId", "");
            this.signinDays = parseInt(uniLib.Utils.getLocalStorage("MAGICDIGIT_signinDays", "0"));
            this.totalSigninDays = parseInt(uniLib.Utils.getLocalStorage("MAGICDIGIT_totalSigninDays", "0"));
            this.signTimestamp = parseInt(uniLib.Utils.getLocalStorage("MAGICDIGIT_signTimestamp", "0"));
            this.signinCycle = parseInt(uniLib.Utils.getLocalStorage("MAGICDIGIT_signinCycle", "0"));
            this.gameDays = parseInt(uniLib.Utils.getLocalStorage("MAGICDIGIT_gameDays", "0"));
            this.gameTimestamp = parseInt(uniLib.Utils.getLocalStorage("MAGICDIGIT_gameTimestamp", "0"));
            this.curChips = parseInt(uniLib.Utils.getLocalStorage("MAGICDIGIT_chips", "0"));
            var soundState = parseInt(uniLib.Utils.getLocalStorage("MAGICDIGIT_soundState", "1"));
            var musicState = parseInt(uniLib.Utils.getLocalStorage("MAGICDIGIT_musicState", "1"));
            var guideState = parseInt(uniLib.Utils.getLocalStorage("MAGICDIGIT_guideState", "1"));
            this.maxSceneLevel = parseInt(uniLib.Utils.getLocalStorage("MAGICDIGIT_sceneLevel", "0"));
            this.maxScore = parseInt(uniLib.Utils.getLocalStorage("MAGICDIGIT_maxScore", "0"));
            this.curScore = parseInt(uniLib.Utils.getLocalStorage("MAGICDIGIT_curScore", "0"));
            this.winChips = parseInt(uniLib.Utils.getLocalStorage("MAGICDIGIT_winChips", "0"));
            this.backgroundId = parseInt(uniLib.Utils.getLocalStorage("MAGICDIGIT_backgroundId", "0"));
            this.skinId = parseInt(uniLib.Utils.getLocalStorage("MAGICDIGIT_skinId", "0"));
            this.sharedTimesInDay = parseInt(uniLib.Utils.getLocalStorage("MAGICDIGIT_sharedTimesInDay", "0"));
            this.sharedFristTimeInDay = parseInt(uniLib.Utils.getLocalStorage("MAGICDIGIT_sharedFristTimeInDay", "0"));
            this.videoTimesInDay = parseInt(uniLib.Utils.getLocalStorage("MAGICDIGIT_videoTimesInDay", "0"));
            this.videoFristTimeInDay = parseInt(uniLib.Utils.getLocalStorage("MAGICDIGIT_videoFristTimeInDay", "0"));
            this.soundEnabled = soundState == 1 ? true : false;
            this.musicEnabled = musicState == 1 ? true : false;
            this.needGuide = guideState == 1 ? true : false;
            uniLib.SoundMgr.instance.musicOpen = this.musicEnabled;
            uniLib.SoundMgr.instance.soundOpen = this.soundEnabled;
            var strJson = uniLib.Utils.getLocalStorage("MAGICDIGIT_signinRewards", "");
            if (strJson.length > 0) {
                this.signinRewards = JSON.parse(strJson);
            }
            else {
                this.signinRewards = [];
            }
            strJson = uniLib.Utils.getLocalStorage("MAGICDIGIT_openBackgroundIdList", "");
            if (strJson.length > 0) {
                this.openBackgroundIdList = JSON.parse(strJson);
            }
            else {
                this.openBackgroundIdList = [];
            }
            strJson = uniLib.Utils.getLocalStorage("MAGICDIGIT_openSkinIdList", "");
            if (strJson.length > 0) {
                this.openSkinIdList = JSON.parse(strJson);
            }
            else {
                this.openSkinIdList = [];
            }
            this.updateGameTimestamp();
            if (this.signinRewards.length <= 0) {
                this.buildSigninRewards();
            }
            if (this.backgroundId <= 0) {
                for (var i = 0; i < game.TableData.tableBackgroundConfig.length; i++) {
                    var config = game.TableData.tableBackgroundConfig[i];
                    if (config.unlockType == 0) {
                        this.backgroundId = config.id;
                        this.unlockBackgroundId(this.backgroundId);
                        break;
                    }
                }
            }
            if (this.skinId <= 0) {
                for (var i = 0; i < game.TableData.tableSkinConfig.length; i++) {
                    var config = game.TableData.tableSkinConfig[i];
                    if (config.unlockType == 0) {
                        this.skinId = config.id;
                        this.unlockSkinId(this.skinId);
                        break;
                    }
                }
            }
            this.loadGameMatchup();
        };
        Object.defineProperty(GameInfo, "instance", {
            get: function () {
                if (!this._instance) {
                    this._instance = new GameInfo();
                }
                return this._instance;
            },
            enumerable: true,
            configurable: true
        });
        //-----------------------------------------------------------------------------
        GameInfo.prototype.loadGameMatchup = function () {
            var strJson = uniLib.Utils.getLocalStorage("MAGICDIGIT_gameMatchup", "");
            if (strJson.length > 0) {
                this.gameMatchup = JSON.parse(strJson);
            }
            else {
                this.gameMatchup = null;
            }
        };
        //-----------------------------------------------------------------------------
        GameInfo.prototype.saveGameMatchup = function (step, balls, roundItems) {
            var gameMatchup = new GameMatchup();
            gameMatchup.step = step;
            gameMatchup.matchup = [];
            gameMatchup.scoreMap = [];
            for (var i = 0; i < balls.length; i++) {
                var data = new game.MatchupData();
                var ball = balls[i];
                data.row = ball.row;
                data.col = ball.col;
                data.colorValue = ball.colorValue;
                data.digitValue = ball.digitValue;
                gameMatchup.matchup.push(data);
            }
            for (var i = 0; i < roundItems.length; i++) {
                var item = roundItems[i];
                var score = item.score;
                gameMatchup.scoreMap.push(score);
            }
            if (gameMatchup) {
                var strJson = JSON.stringify(gameMatchup);
                uniLib.Utils.setLocalStorage("MAGICDIGIT_gameMatchup", strJson);
            }
            GameInfo.instance.gameMatchup = gameMatchup;
        };
        //-----------------------------------------------------------------------------
        GameInfo.prototype.clearGameMatchup = function () {
            uniLib.Utils.clearLocalStorage("MAGICDIGIT_gameMatchup");
            GameInfo.instance.gameMatchup = null;
        };
        //-----------------------------------------------------------------------------
        GameInfo.prototype.buildSigninRewards = function () {
            this.signinRewards = [];
            var reward1 = [1, 5];
            var reward2 = [1, 10];
            var reward3 = [1, 20];
            var reward4 = [1, 30];
            var reward5 = [1, 40];
            var reward6 = [1, 50];
            var reward7 = [3, 100, 0];
            this.signinRewards.push(reward1);
            this.signinRewards.push(reward2);
            this.signinRewards.push(reward3);
            this.signinRewards.push(reward4);
            this.signinRewards.push(reward5);
            this.signinRewards.push(reward6);
            this.signinRewards.push(reward7);
            var strJson = JSON.stringify(this.signinRewards);
            uniLib.Utils.setLocalStorage("MAGICDIGIT_signinRewards", strJson);
        };
        GameInfo.prototype.unlockBackgroundId = function (id, isSave) {
            console.log("unlockBackgroundId", id, this.openBackgroundIdList);
            for (var i = 0; i < this.openBackgroundIdList.length; i++) {
                if (this.openBackgroundIdList[i] == id) {
                    return;
                }
            }
            this.openBackgroundIdList.push(id);
            if (isSave) {
                GameInfo.save();
            }
        };
        GameInfo.prototype.unlockSkinId = function (id, isSave) {
            console.log("unlockSkinId", id, this.openSkinIdList);
            for (var i = 0; i < this.openSkinIdList.length; i++) {
                if (this.openSkinIdList[i] == id) {
                    return;
                }
            }
            this.openSkinIdList.push(id);
            if (isSave) {
                GameInfo.save();
            }
        };
        GameInfo.prototype.getLockBackgroundList = function () {
            var lockList = [];
            for (var i = 0; i < game.TableData.tableBackgroundConfig.length; i++) {
                var config = game.TableData.tableBackgroundConfig[i];
                var isLocked = true;
                for (var j = 0; j < this.openBackgroundIdList.length; j++) {
                    if (config.id == this.openBackgroundIdList[j]) {
                        isLocked = false;
                        break;
                    }
                }
                if (isLocked) {
                    lockList.push(config.id);
                }
            }
            return lockList;
        };
        GameInfo.prototype.getLockSkinList = function () {
            var lockList = [];
            for (var i = 0; i < game.TableData.tableSkinConfig.length; i++) {
                var config = game.TableData.tableSkinConfig[i];
                var isLocked = true;
                for (var j = 0; j < this.openSkinIdList.length; j++) {
                    if (config.id == this.openSkinIdList[j]) {
                        isLocked = false;
                        break;
                    }
                }
                if (isLocked) {
                    lockList.push(config.id);
                }
            }
            return lockList;
        };
        GameInfo.prototype.querySigninTime = function () {
            var lastTimestamp = this.signTimestamp;
            var curTimestamp = (new Date()).valueOf();
            var lastStrTime = GX.timestampToString(lastTimestamp);
            var curStrTime = GX.timestampToString(curTimestamp);
            var lastTimeValues = lastStrTime.split(" ");
            var curTimeValues = curStrTime.split(" ");
            lastTimeValues = lastTimeValues[0].split("-");
            curTimeValues = curTimeValues[0].split("-");
            if (parseInt(curTimeValues[0]) - parseInt(lastTimeValues[0]) == 0 && parseInt(curTimeValues[1]) - parseInt(lastTimeValues[1]) == 0) {
                var day = parseInt(curTimeValues[2]) - parseInt(lastTimeValues[2]);
                if (day >= 1) {
                    return true;
                }
            }
            else {
                return true;
            }
            return false;
        };
        GameInfo.prototype.updateSigninTime = function () {
            var days = this.signinDays;
            this.signTimestamp = (new Date()).valueOf();
            this.signinDays = this.signinDays + 1;
            this.totalSigninDays = this.totalSigninDays + 1;
            if (this.signinDays >= 7) {
                this.signinDays = 0;
                this.signinCycle++;
                this.buildSigninRewards();
            }
            GameInfo.save();
        };
        GameInfo.prototype.updateGameTimestamp = function (isSave) {
            var days = this.gameDays;
            var lastTimestamp = this.gameTimestamp;
            this.gameTimestamp = (new Date()).valueOf();
            var lastStrTime = GX.timestampToString(lastTimestamp);
            var curStrTime = GX.timestampToString(this.gameTimestamp);
            var lastTimeValues = lastStrTime.split(" ");
            var curTimeValues = curStrTime.split(" ");
            lastTimeValues = lastTimeValues[0].split("-");
            curTimeValues = curTimeValues[0].split("-");
            if (parseInt(curTimeValues[0]) - parseInt(lastTimeValues[0]) == 0 && parseInt(curTimeValues[1]) - parseInt(lastTimeValues[1]) == 0) {
                var day = parseInt(curTimeValues[2]) - parseInt(lastTimeValues[2]);
                if (day == 1) {
                    ++days;
                }
                else if (day > 1) {
                    days = 1;
                }
            }
            else {
                days = 1;
            }
            this.gameDays = days;
            if (isSave) {
                GameInfo.save();
            }
        };
        GameInfo.save = function () {
            uniLib.Utils.setLocalStorage("MAGICDIGIT_openId", GameInfo.instance.openId);
            uniLib.Utils.setLocalStorage("MAGICDIGIT_signinDays", GameInfo.instance.signinDays.toString());
            uniLib.Utils.setLocalStorage("MAGICDIGIT_totalSigninDays", GameInfo.instance.totalSigninDays.toString());
            uniLib.Utils.setLocalStorage("MAGICDIGIT_signTimestamp", GameInfo.instance.signTimestamp.toString());
            uniLib.Utils.setLocalStorage("MAGICDIGIT_signinCycle", GameInfo.instance.signinCycle.toString());
            uniLib.Utils.setLocalStorage("MAGICDIGIT_gameDays", GameInfo.instance.gameDays.toString());
            uniLib.Utils.setLocalStorage("MAGICDIGIT_gameTimestamp", GameInfo.instance.gameTimestamp.toString());
            uniLib.Utils.setLocalStorage("MAGICDIGIT_chips", GameInfo.instance.curChips.toString());
            uniLib.Utils.setLocalStorage("MAGICDIGIT_sceneLevel", GameInfo.instance.maxSceneLevel.toString());
            uniLib.Utils.setLocalStorage("MAGICDIGIT_maxScore", GameInfo.instance.maxScore.toString());
            uniLib.Utils.setLocalStorage("MAGICDIGIT_curScore", GameInfo.instance.curScore.toString());
            uniLib.Utils.setLocalStorage("MAGICDIGIT_winChips", GameInfo.instance.winChips.toString());
            uniLib.Utils.setLocalStorage("MAGICDIGIT_sharedTimesInDay", GameInfo.instance.sharedTimesInDay.toString());
            uniLib.Utils.setLocalStorage("MAGICDIGIT_sharedFristTimeInDay", GameInfo.instance.sharedFristTimeInDay.toString());
            uniLib.Utils.setLocalStorage("MAGICDIGIT_videoTimesInDay", GameInfo.instance.videoTimesInDay.toString());
            uniLib.Utils.setLocalStorage("MAGICDIGIT_videoFristTimeInDay", GameInfo.instance.videoFristTimeInDay.toString());
            uniLib.Utils.setLocalStorage("MAGICDIGIT_backgroundId", GameInfo.instance.backgroundId.toString());
            uniLib.Utils.setLocalStorage("MAGICDIGIT_skinId", GameInfo.instance.skinId.toString());
            var soundState = GameInfo.instance.soundEnabled ? 1 : 0;
            var musicState = GameInfo.instance.musicEnabled ? 1 : 0;
            var guideState = GameInfo.instance.needGuide ? 1 : 0;
            uniLib.Utils.setLocalStorage("MAGICDIGIT_soundState", soundState.toString());
            uniLib.Utils.setLocalStorage("MAGICDIGIT_musicState", musicState.toString());
            uniLib.Utils.setLocalStorage("MAGICDIGIT_guideState", guideState.toString());
            var openBackgroundIdList = GameInfo.instance.openBackgroundIdList;
            if (openBackgroundIdList && openBackgroundIdList.length > 0) {
                var strJson = JSON.stringify(openBackgroundIdList);
                uniLib.Utils.setLocalStorage("MAGICDIGIT_openBackgroundIdList", strJson);
            }
            var openSkinIdList = GameInfo.instance.openSkinIdList;
            if (openSkinIdList && openSkinIdList.length > 0) {
                var strJson = JSON.stringify(openSkinIdList);
                uniLib.Utils.setLocalStorage("MAGICDIGIT_openSkinIdList", strJson);
            }
        };
        GameInfo.clearStorage = function () {
            uniLib.Utils.clearLocalStorage("MAGICDIGIT_openId");
            uniLib.Utils.clearLocalStorage("MAGICDIGIT_signinDays");
            uniLib.Utils.clearLocalStorage("MAGICDIGIT_totalSigninDays");
            uniLib.Utils.clearLocalStorage("MAGICDIGIT_signTimestamp");
            uniLib.Utils.clearLocalStorage("MAGICDIGIT_signinCycle");
            uniLib.Utils.clearLocalStorage("MAGICDIGIT_signinRewards");
            uniLib.Utils.clearLocalStorage("MAGICDIGIT_gameDays");
            uniLib.Utils.clearLocalStorage("MAGICDIGIT_gameTimestamp");
            uniLib.Utils.clearLocalStorage("MAGICDIGIT_sceneLevel");
            uniLib.Utils.clearLocalStorage("MAGICDIGIT_maxScore");
            uniLib.Utils.clearLocalStorage("MAGICDIGIT_curScore");
            uniLib.Utils.clearLocalStorage("MAGICDIGIT_winChips");
            uniLib.Utils.clearLocalStorage("MAGICDIGIT_chips");
            uniLib.Utils.clearLocalStorage("MAGICDIGIT_soundState");
            uniLib.Utils.clearLocalStorage("MAGICDIGIT_musicState");
            uniLib.Utils.clearLocalStorage("MAGICDIGIT_guideState");
            uniLib.Utils.clearLocalStorage("MAGICDIGIT_sharedTimesInDay");
            uniLib.Utils.clearLocalStorage("MAGICDIGIT_sharedFristTimeInDay");
            uniLib.Utils.clearLocalStorage("MAGICDIGIT_videoTimesInDay");
            uniLib.Utils.clearLocalStorage("MAGICDIGIT_videoFristTimeInDay");
            uniLib.Utils.clearLocalStorage("MAGICDIGIT_openBackgroundIdList");
            uniLib.Utils.clearLocalStorage("MAGICDIGIT_openSkinIdList");
            uniLib.Utils.clearLocalStorage("MAGICDIGIT_backgroundId");
            uniLib.Utils.clearLocalStorage("MAGICDIGIT_skinId");
            uniLib.Utils.clearLocalStorage("MAGICDIGIT_gameMatchup");
        };
        return GameInfo;
    }());
    game.GameInfo = GameInfo;
    __reflect(GameInfo.prototype, "game.GameInfo");
})(game || (game = {}));
//# sourceMappingURL=GameInfo.js.map