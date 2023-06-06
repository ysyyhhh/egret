module game 
{
    export class GameFailView extends ui.BaseUI
    {
        private levelLabel:eui.Label;
        private scoreLabel:eui.Label;
        private bestScoreLabel:eui.Label;
        private chipsLabel:eui.Label;

        private shareBtn:eui.Button;
        private homeBtn:eui.Button;
        private restartBtn:eui.Button;
        private doubleReceiveBtn:eui.Button;

        private isVideoShowed:boolean = false;
        private showVideoTimeout:number;

        private sceneLevel:number = 0;
        private winChips:number = 0;
        private curScore:number = 0;
        private bestScore:number = 0;

        constructor(sceneLevel:number, winChips:number, curScore:number, bestScore:number)
        {
            super();
            this.skinName = new GameFailViewSkin();
            this.adaptationWidth();
            this.adaptationHeight();
            this.sceneLevel = sceneLevel;
            this.winChips = winChips;
            this.curScore = curScore;
            this.bestScore = bestScore;
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
            // uniLib.SoundMgr.instance.playSound("game_success_mp3");

            if(uniLib.Global.isVivogame) this.shareBtn.visible = false;

            this.levelLabel.text = "关卡" + this.sceneLevel.toString();
            this.scoreLabel.text = this.curScore.toString();
            this.bestScoreLabel.text = this.bestScore.toString();
            this.chipsLabel.text = "+" + this.winChips.toString();

            egret.Tween.get(this.doubleReceiveBtn).to({rotation:20}, 100, egret.Ease.sineIn).to({rotation:-20},100, egret.Ease.sineOut).to({rotation:0},80);
            egret.Tween.get(this.doubleReceiveBtn).to({scaleX:1.5, scaleY:1.5}, 200, egret.Ease.sineIn).to({scaleX:1, scaleY:1}, 250, egret.Ease.sineOut);
        }

        //-----------------------------------------------------------------------------
        public destroy()
        {
            uniLib.AdPlat.instance.hideBanner();
            egret.Tween.removeTweens(this.doubleReceiveBtn);
            super.destroy();
        }

        //-----------------------------------------------------------------------------
        private onClickTap(e: egret.TouchEvent)
        {
            if(e.target == this.doubleReceiveBtn)
            {
                let self = this;
                if (!this.isVideoShowed) {
                    this.isVideoShowed = true;
                    uniLib.SoundMgr.instance.pauseBgMusic();
                    if(uniLib.Global.isVivogame) window.platform.showVideoAdvertisement(null, this.onVideoAdCallback, this);
                    else uniLib.AdPlat.instance.showRewardedVideo(this.onVideoAdCallback, this);
                    this.showVideoTimeout = egret.setTimeout(() => {
                        self.isVideoShowed = false;
                        if (self.showVideoTimeout) {
                            egret.clearTimeout(self.showVideoTimeout);
                            self.showVideoTimeout = null;
                        }
                    }, this, 3000);
                }
            }
            else if(e.target == this.restartBtn)
            {
                GX.PopUpManager.removePopUp(this);
                Main.instance.loadGameScene(1);
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

        //-----------------------------------------------------------------------------
        private onVideoAdCallback(status:number)
        {
            uniLib.SoundMgr.instance.resumeBgMusic();
            if(this.showVideoTimeout)
            {
                egret.clearTimeout(this.showVideoTimeout);
                this.showVideoTimeout = null;
            }
            this.isVideoShowed = false;
            if(status == 1)
            {
                this.doubleReceiveBtn.enabled = false;
                let addChips:number = this.winChips * 2;
                GameInfo.instance.curChips += addChips;
                GameInfo.save();
                this.winChips += addChips;
                this.chipsLabel.text = "+" + this.winChips.toString();
                uniLib.EventListener.getInstance().dispatchEventWith(EventConsts.EVENT_UPDATE_GAME_INFO);
                GX.PopUpManager.addPopUp(new game.RewardView(this.winChips), true, 0.6, GX.PopUpEffect.CENTER_S);
            }
            else if(status == 0)
            {
                // 视频未看完
                GX.Tips.showTips("获取奖励失败");
            }
            else
            {
                GX.Tips.showTips("获取视频广告失败:" + status);
            }
        }

    }
}