module game 
{
    export class GameScene extends uniLib.Scene
    {
        private gameView:GameView;

        awake(): void 
        {
            uniLib.Global.isInGame = true;
        }

        //------------------------------------------------------------------------------
        start(e?: egret.Event): void 
        {
            uniLib.UIMgr.instance.hideLoading();
            this.width = uniLib.Global.screenWidth;
            this.height = uniLib.Global.screenHeight;

            let level:number = this.params;

            let result = this.loadSceneLevel(level);

            if(result)
            {
                this.gameView = new GameView();
                this.uiLayer.addChild(this.gameView);
                this.gameView.initData();
            }
            else
            {
                egret.setTimeout(() => {
                    GX.Tips.showPopup("场景关卡加载失败", () => {
                        uniLib.SceneManager.instance.changeScene(game.MainScene);
                    });
                }, this, 100);
            }

        }

        //------------------------------------------------------------------------------
        destroy()
        {
        }

        //------------------------------------------------------------------------------
        onEnter(): void
        {
            uniLib.EventListener.getInstance().addEventListener(EventConsts.EVENT_GAME_SUCCESS, this.onEventHandle, this);
            uniLib.EventListener.getInstance().addEventListener(EventConsts.EVENT_GAME_OVER, this.onEventHandle, this);
            
            if(GameInfo.instance.sceneLevel >= 3)
            {
                let index = -1;
                let interstitialProbability = parseInt(uniLib.AdConfig.gameConfig["interstitialProbability"]);
                if(!isNaN(interstitialProbability))
                {
                    index = uniLib.MathUtil.randomProbability([interstitialProbability, 100-interstitialProbability]);
                }

                let result = ui.AdMisTouchManager.instance.startMisTouch(new game.MisTouchGifBox, ()=>{
                    if(index == 0)
                    {
                        uniLib.AdPlat.instance.showInterstitial();
                    }
                }, this);

                if(!result)
                {
                    if(index == 0)
                    {
                        uniLib.AdPlat.instance.showInterstitial();
                    }
                }
            }
            
        }

        //------------------------------------------------------------------------------
        onExit(): void
        {
            this.unloadSceneLevel();
        }

        //------------------------------------------------------------------------------
        loadSceneLevel(level:number) : boolean
        {
            let config:table.TableSceneLevelConfig = TableData.getSceneLevelConfig(level);
            if(null == config)
            {
                config = TableData.tableSceneLevelConfig[TableData.tableSceneLevelConfig.length-1];
            }
            GameInfo.instance.sceneLevel = level;
            GameInfo.instance.config = new table.TableSceneLevelConfig();
            GameInfo.instance.config.level = config.level;
            GameInfo.instance.config.step = config.step;
            GameInfo.instance.config.winChips = config.winChips;

            let weight:number = 100 / config.digits.length;
            GameInfo.instance.config.digitalWeights = [weight, weight, weight];
            GameInfo.instance.config.digits = [];
            GameInfo.instance.config.colorWeights = [];
            GameInfo.instance.config.scores = [];

            for(let i = 0; i < config.digits.length; i++)
            {
                let digit:number = config.digits[i];
                GameInfo.instance.config.digits.push(digit);
            }

            for(let i = 0; i < config.colorWeights.length; i++)
            {
                let weight:number = config.colorWeights[i];
                GameInfo.instance.config.colorWeights.push(weight);
            }

            for(let i = 0; i < config.scores.length; i++)
            {
                let score:number = config.scores[i];
                GameInfo.instance.config.scores.push(score);
            }
            
            return true;
        }

        //------------------------------------------------------------------------------
        public existSceneLevel(level:number) : boolean
        {
            return TableData.getSceneLevelConfig(level) ? true : false;
        }

        //------------------------------------------------------------------------------
        public reloadSceneLevel()
        {
            Main.instance.loadGameScene(GameInfo.instance.sceneLevel);
        }

        //------------------------------------------------------------------------------
        public loadNextSceneLevel()
        {
            let level = GameInfo.instance.sceneLevel+1;
            this.loadSceneLevel(level);
            this.gameView.resetInit();

            if(GameInfo.instance.sceneLevel >= 3)
            {
                let index = -1;
                let interstitialProbability = parseInt(uniLib.AdConfig.gameConfig["interstitialProbability"]);
                if(!isNaN(interstitialProbability))
                {
                    index = uniLib.MathUtil.randomProbability([interstitialProbability, 100-interstitialProbability]);
                }

                let result = ui.AdMisTouchManager.instance.startMisTouch(new game.MisTouchGifBox, ()=>{
                    if(index == 0)
                    {
                        uniLib.AdPlat.instance.showInterstitial();
                    }
                }, this);

                if(!result)
                {
                    if(index == 0)
                    {
                        uniLib.AdPlat.instance.showInterstitial();
                    }
                }
            }
        }

        //-----------------------------------------------------------------------------
        unloadSceneLevel()
        {
            uniLib.EventListener.getInstance().removeEventListener(EventConsts.EVENT_GAME_SUCCESS, this.onEventHandle, this);
            uniLib.EventListener.getInstance().removeEventListener(EventConsts.EVENT_GAME_OVER, this.onEventHandle, this);
            
            if(this.gameView && this.gameView.parent)
            {
                this.gameView.parent.removeChild(this.gameView);
            }

            this.gameView = null;
            
        }

        //-----------------------------------------------------------------------------
        private onEventHandle(evt: egret.Event): void 
        {
            let self = this;
            let data = evt.data;

            if(evt.type == EventConsts.EVENT_GAME_SUCCESS)
            {
                GameInfo.instance.clearGameMatchup();
                if(GameInfo.instance.maxSceneLevel < GameInfo.instance.sceneLevel)
                {
                    GameInfo.instance.maxSceneLevel = GameInfo.instance.sceneLevel;
                }

                GameInfo.instance.needGuide = false;
                let addChips = GameInfo.instance.config.winChips;
                GameInfo.instance.winChips += addChips;
                GameInfo.save();
                GX.PopUpManager.addPopUp(new GameSuccessView(), true, 0.8, GX.PopUpEffect.BOTTOM);

            }
            else if(evt.type == EventConsts.EVENT_GAME_OVER)
            {
                GameInfo.instance.clearGameMatchup();
                let sceneLevel = GameInfo.instance.sceneLevel;
                let curScore = GameInfo.instance.curScore;
                let bestScore = GameInfo.instance.maxScore;
                let winChips = GameInfo.instance.winChips;
                winChips += GameInfo.instance.config.winChips;
                GameInfo.instance.curChips = GameInfo.instance.curChips + winChips;
                GameInfo.instance.winChips = 0;
                GameInfo.instance.needGuide = false;
                GameInfo.instance.sceneLevel = 0;
                GameInfo.instance.maxSceneLevel = 0;
                if(GameInfo.instance.maxScore < GameInfo.instance.curScore)
                {
                    GameInfo.instance.maxScore = GameInfo.instance.curScore;
                }
                GameInfo.instance.curScore = 0;
                uniLib.EventListener.getInstance().dispatchEventWith(EventConsts.EVENT_UPDATE_GAME_INFO);
                GameInfo.save();
                GX.PopUpManager.addPopUp(new GameFailView(sceneLevel, winChips, curScore, bestScore), true, 0.8, GX.PopUpEffect.BOTTOM);
            }
            
        }
    }
}