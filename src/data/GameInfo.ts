module game 
{
    export class GameMatchup
    {
        step:number;
        matchup:MatchupData[];
        scoreMap:number[];
    }
    export class GameInfo
    {
        config:table.TableSceneLevelConfig = null;
        sceneLevel:number = 0;
        maxSceneLevel:number = 0;
        maxScore:number = 0;
        curScore:number = 0;
        curChips:number = 0;    // 玩家当前的金币
        winChips:number = 0;    // 玩家当前赢得的金币

        sharedFristTimeInDay:number = 0;
        sharedTimesInDay:number = 0; // 今日分享成功多少次?
        canShared:boolean = false; // 临时变量

        videoFristTimeInDay:number = 0;
        videoTimesInDay:number = 0; // 今日任务视频看成功多少次?
        canVideo:boolean = false; // 临时变量

        soundEnabled:boolean = true;
        musicEnabled:boolean = true;

        needGuide:boolean = true;

        gameTimestamp:number = 0; // 游戏时间戳
        gameDays:number = 0; // 连续游戏天数

        signinDays:number = 0; // 签到天数
        totalSigninDays:number = 0; // 累计签到天数
        signTimestamp:number = 0; // 签到时间戳
        signinRewards:any[] = []; // 签到的奖励列表 [类型，值] 类型1：提示 类型2:钥匙  值：奖励数量
        signinCycle:number = 0; // 签到的周期,即（过了几圈）

        //-----------------------------------------
        // 用户信息相关
        openId:string;
        userInfo:any;

        backgroundId:number = 0; // 背景皮肤ID
        openBackgroundIdList:number[]; // 已经解锁的背景皮肤ID列表

        skinId:number = 0; // 皮肤ID
        openSkinIdList:number[]; // 已经解锁的皮肤ID列表

        gameMatchup:GameMatchup;

        private static _instance: GameInfo;

		public constructor() 
		{
		}

        public init()
        {
            this.openId = uniLib.Utils.getLocalStorage("MAGICDIGIT_openId", "");
            this.signinDays = parseInt(uniLib.Utils.getLocalStorage("MAGICDIGIT_signinDays", "0"));
            this.totalSigninDays = parseInt(uniLib.Utils.getLocalStorage("MAGICDIGIT_totalSigninDays", "0"));
            this.signTimestamp = parseInt(uniLib.Utils.getLocalStorage("MAGICDIGIT_signTimestamp", "0"));
            this.signinCycle = parseInt(uniLib.Utils.getLocalStorage("MAGICDIGIT_signinCycle", "0"));
            this.gameDays = parseInt(uniLib.Utils.getLocalStorage("MAGICDIGIT_gameDays", "0"));
            this.gameTimestamp = parseInt(uniLib.Utils.getLocalStorage("MAGICDIGIT_gameTimestamp", "0"));
            this.curChips = parseInt(uniLib.Utils.getLocalStorage("MAGICDIGIT_chips", "0"));
            let soundState = parseInt(uniLib.Utils.getLocalStorage("MAGICDIGIT_soundState", "1"));
            let musicState = parseInt(uniLib.Utils.getLocalStorage("MAGICDIGIT_musicState", "1"));
            let guideState = parseInt(uniLib.Utils.getLocalStorage("MAGICDIGIT_guideState", "1"));

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

            let strJson = uniLib.Utils.getLocalStorage("MAGICDIGIT_signinRewards", "");
            if(strJson.length > 0)
            {
                this.signinRewards = JSON.parse(strJson);
            }
            else
            {
                this.signinRewards = [];
            }

            strJson = uniLib.Utils.getLocalStorage("MAGICDIGIT_openBackgroundIdList", "");
            if(strJson.length > 0)
            {
                this.openBackgroundIdList = JSON.parse(strJson);
            }
            else
            {
                this.openBackgroundIdList = [];
            }

            strJson = uniLib.Utils.getLocalStorage("MAGICDIGIT_openSkinIdList", "");
            if(strJson.length > 0)
            {
                this.openSkinIdList = JSON.parse(strJson);
            }
            else
            {
                this.openSkinIdList = [];
            }

            this.updateGameTimestamp();

            if(this.signinRewards.length <= 0)
            {
                this.buildSigninRewards();
            }

            if(this.backgroundId <= 0)
            {
                for(let i = 0; i < TableData.tableBackgroundConfig.length; i++)
                {
                    let config:table.TableBackgroundConfig = TableData.tableBackgroundConfig[i];
                    if(config.unlockType == 0)
                    {
                        this.backgroundId = config.id;
                        this.unlockBackgroundId(this.backgroundId);
                        break;
                    }
                }
            }

            if(this.skinId <= 0)
            {
                for(let i = 0; i < TableData.tableSkinConfig.length; i++)
                {
                    let config:table.TableSkinConfig = TableData.tableSkinConfig[i];
                    if(config.unlockType == 0)
                    {
                        this.skinId = config.id;
                        this.unlockSkinId(this.skinId);
                        break;
                    }
                }
            }

            this.loadGameMatchup();
        }
		public static get instance() : GameInfo
		{
			if (!this._instance) 
			{
				this._instance = new GameInfo();
			}
			return this._instance;
        }
        
        //-----------------------------------------------------------------------------
        public loadGameMatchup()
        {
            let strJson = uniLib.Utils.getLocalStorage("MAGICDIGIT_gameMatchup", "");
            if(strJson.length > 0)
            {
                this.gameMatchup = JSON.parse(strJson);
            }
            else
            {
                this.gameMatchup = null;
            }
        }

        //-----------------------------------------------------------------------------
        public saveGameMatchup(step:number, balls:Ball[], roundItems:RoundItem[])
        {
            let gameMatchup:GameMatchup = new GameMatchup();
            gameMatchup.step = step;
            gameMatchup.matchup = [];
            gameMatchup.scoreMap = [];

            for(let i = 0; i < balls.length; i++)
            {
                let data:MatchupData = new MatchupData();
                let ball:Ball = balls[i];
                data.row = ball.row;
                data.col = ball.col;
                data.colorValue = ball.colorValue;
                data.digitValue = ball.digitValue;
                gameMatchup.matchup.push(data);
            }

            for(let i = 0; i < roundItems.length; i++)
            {
                let item:RoundItem = roundItems[i];
                let score:number = item.score;
                gameMatchup.scoreMap.push(score);
            }

            if(gameMatchup)
            {
                let strJson = JSON.stringify(gameMatchup);
                uniLib.Utils.setLocalStorage("MAGICDIGIT_gameMatchup", strJson);
            }

            GameInfo.instance.gameMatchup = gameMatchup;
        }

        //-----------------------------------------------------------------------------
        public clearGameMatchup()
        {
            uniLib.Utils.clearLocalStorage("MAGICDIGIT_gameMatchup");
            GameInfo.instance.gameMatchup = null;
        }

        //-----------------------------------------------------------------------------
        private buildSigninRewards()
        {
            this.signinRewards = [];

            let reward1:number[] = [1, 5];
            let reward2:number[] = [1, 10];
            let reward3:number[] = [1, 20];
            let reward4:number[] = [1, 30];
            let reward5:number[] = [1, 40];
            let reward6:number[] = [1, 50];
            let reward7:number[] = [3, 100, 0];

            this.signinRewards.push(reward1);
            this.signinRewards.push(reward2);
            this.signinRewards.push(reward3);
            this.signinRewards.push(reward4);
            this.signinRewards.push(reward5);
            this.signinRewards.push(reward6);
            this.signinRewards.push(reward7);

            let strJson = JSON.stringify(this.signinRewards);
            uniLib.Utils.setLocalStorage("MAGICDIGIT_signinRewards", strJson);
        }

        public unlockBackgroundId(id:number, isSave?:boolean)
        {
            console.log("unlockBackgroundId", id, this.openBackgroundIdList);
            for(let i = 0; i < this.openBackgroundIdList.length; i++)
            {
                if(this.openBackgroundIdList[i] == id)
                {
                    return;
                }
            }

            this.openBackgroundIdList.push(id);

            if(isSave)
            {
                GameInfo.save();
            }
        }

        public unlockSkinId(id:number, isSave?:boolean)
        {
            console.log("unlockSkinId", id, this.openSkinIdList);
            for(let i = 0; i < this.openSkinIdList.length; i++)
            {
                if(this.openSkinIdList[i] == id)
                {
                    return;
                }
            }

            this.openSkinIdList.push(id);

            if(isSave)
            {
                GameInfo.save();
            }
        }

        public getLockBackgroundList() : number[]
        {
            let lockList:number[] = [];
            for(let i = 0; i < TableData.tableBackgroundConfig.length; i++)
            {
                let config:table.TableBackgroundConfig = TableData.tableBackgroundConfig[i];
                let isLocked = true;
                for(let j = 0; j < this.openBackgroundIdList.length; j++)
                {
                    if(config.id == this.openBackgroundIdList[j])
                    {
                        isLocked = false;
                        break;
                    }
                }

                if(isLocked)
                {
                    lockList.push(config.id);
                }
            }

            return lockList;
        }

        public getLockSkinList() : number[]
        {
            let lockList:number[] = [];
            for(let i = 0; i < TableData.tableSkinConfig.length; i++)
            {
                let config:table.TableSkinConfig = TableData.tableSkinConfig[i];
                let isLocked = true;
                for(let j = 0; j < this.openSkinIdList.length; j++)
                {
                    if(config.id == this.openSkinIdList[j])
                    {
                        isLocked = false;
                        break;
                    }
                }

                if(isLocked)
                {
                    lockList.push(config.id);
                }
            }

            return lockList;
        }

        public querySigninTime() : boolean
        {
            let lastTimestamp = this.signTimestamp;
            let curTimestamp = (new Date()).valueOf();

            let lastStrTime = GX.timestampToString(lastTimestamp);
            let curStrTime = GX.timestampToString(curTimestamp);

            let lastTimeValues = lastStrTime.split(" ");
            let curTimeValues = curStrTime.split(" ");

            lastTimeValues = lastTimeValues[0].split("-");
            curTimeValues = curTimeValues[0].split("-");

            if(parseInt(curTimeValues[0]) - parseInt(lastTimeValues[0]) == 0 && parseInt(curTimeValues[1]) - parseInt(lastTimeValues[1]) == 0)
            {
                let day = parseInt(curTimeValues[2]) - parseInt(lastTimeValues[2]);
                if(day >= 1)
                {
                    return true;
                }
            }
            else
            {
                return true;
            }

            return false;
        }

        public updateSigninTime()
        {
            let days = this.signinDays;
            this.signTimestamp = (new Date()).valueOf();
            this.signinDays = this.signinDays + 1;
            this.totalSigninDays = this.totalSigninDays + 1;
            if(this.signinDays >= 7) 
            {
                this.signinDays = 0;
                this.signinCycle++;
                this.buildSigninRewards();
            }
            GameInfo.save();
        }

        public updateGameTimestamp(isSave?:boolean)
        {
            let days = this.gameDays;
            let lastTimestamp = this.gameTimestamp;
            this.gameTimestamp = (new Date()).valueOf();

            let lastStrTime = GX.timestampToString(lastTimestamp);
            let curStrTime = GX.timestampToString(this.gameTimestamp);

            let lastTimeValues = lastStrTime.split(" ");
            let curTimeValues = curStrTime.split(" ");

            lastTimeValues = lastTimeValues[0].split("-");
            curTimeValues = curTimeValues[0].split("-");

            if(parseInt(curTimeValues[0]) - parseInt(lastTimeValues[0]) == 0 && parseInt(curTimeValues[1]) - parseInt(lastTimeValues[1]) == 0)
            {
                let day = parseInt(curTimeValues[2]) - parseInt(lastTimeValues[2]);

                if(day == 1)
                {
                    ++days;
                }
                else if(day > 1)
                {
                    days = 1;
                }
            }
            else
            {
                days = 1;
            }

            this.gameDays = days;

            if(isSave)
            {
                GameInfo.save();
            }
        }

        public static save()
        {
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

            let soundState:number = GameInfo.instance.soundEnabled ? 1 : 0;
            let musicState:number = GameInfo.instance.musicEnabled ? 1 : 0;
            let guideState:number = GameInfo.instance.needGuide ? 1 : 0;
            uniLib.Utils.setLocalStorage("MAGICDIGIT_soundState", soundState.toString());
            uniLib.Utils.setLocalStorage("MAGICDIGIT_musicState", musicState.toString());
            uniLib.Utils.setLocalStorage("MAGICDIGIT_guideState", guideState.toString());

            let openBackgroundIdList:number[] = GameInfo.instance.openBackgroundIdList;
            if(openBackgroundIdList && openBackgroundIdList.length > 0)
            {
                let strJson = JSON.stringify(openBackgroundIdList);
                uniLib.Utils.setLocalStorage("MAGICDIGIT_openBackgroundIdList", strJson);
            }

            let openSkinIdList:number[] = GameInfo.instance.openSkinIdList;
            if(openSkinIdList && openSkinIdList.length > 0)
            {
                let strJson = JSON.stringify(openSkinIdList);
                uniLib.Utils.setLocalStorage("MAGICDIGIT_openSkinIdList", strJson);
            }
            
        }

        public static clearStorage()
        {
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
        }

    }
}