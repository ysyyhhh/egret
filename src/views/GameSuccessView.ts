module game 
{
    export class GameSuccessView extends ui.BaseUI
    {
        private levelLabel:eui.Label;
        private scoreLabel:eui.Label;
        private bestScoreLabel:eui.Label;

        private shareBtn:eui.Button;
        private homeBtn:eui.Button;
        private continueBtn:eui.Button;

        private autoCloseTimeout:number;

        constructor()
        {
            super();
            this.skinName = new GameSuccessViewSkin();
            this.adaptationWidth();
            this.adaptationHeight();
            uniLib.AdPlat.instance.showBanner();
            if(uniLib.Global.isVivogame) window.platform.showBannerAdvertisement();
            if(uniLib.Global.isVivogame) window.platform.showNativeAdvertisement();
            this.init();
        }

        addUIListener(): void
        {
            this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickTap, this);
        }

        removeUIListener(): void
        {
            this.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickTap, this);
        }

        //-----------------------------------------------------------------------------
        private init()
        {
            this.levelLabel.text = "关卡" + GameInfo.instance.sceneLevel.toString();
            this.scoreLabel.text = GameInfo.instance.curScore.toString();
            this.bestScoreLabel.text = GameInfo.instance.maxScore.toString();

            if(uniLib.Global.isWxgame) this.autoCloseTimeout = egret.setTimeout(this.autoEnterNextSceneLevel, this, 2000);
            
        }

        //-----------------------------------------------------------------------------
        public destroy()
        {
            if(this.autoCloseTimeout)
            {
                egret.clearTimeout(this.autoCloseTimeout);
                this.autoCloseTimeout = null;
            }
            uniLib.AdPlat.instance.hideBanner();
            super.destroy();
        }

        //-----------------------------------------------------------------------------
        private autoEnterNextSceneLevel()
        {
            if(this.autoCloseTimeout)
            {
                egret.clearTimeout(this.autoCloseTimeout);
                this.autoCloseTimeout = null;
            }

            GX.PopUpManager.removePopUp(this);
            let gameScene:GameScene = uniLib.SceneManager.instance.currentScene as GameScene;
            gameScene.loadNextSceneLevel();
        }

        //-----------------------------------------------------------------------------
        private onClickTap(e: egret.TouchEvent)
        {
            if(e.target == this.continueBtn)
            {
                GX.PopUpManager.removePopUp(this);
                let gameScene:GameScene = uniLib.SceneManager.instance.currentScene as GameScene;
                gameScene.loadNextSceneLevel();
            }
            else if(e.target == this.homeBtn)
            {
                GX.PopUpManager.removePopUp(this);
                Main.instance.changeToMainScene();
            }
            else if(e.target == this.shareBtn)
            {
                uniLib.AdPlat.instance.share();
            }
        }

    }
}