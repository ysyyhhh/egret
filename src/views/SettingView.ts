module game 
{
    export class SettingView extends ui.BaseUI
    {
        private mainGroup:eui.Group;
        private gameGroup:eui.Group;

        private homeBtn:eui.Button;
        private restartBtn:eui.Button;

		private soundCheckBox: eui.CheckBox;
		private musicCheckBox: eui.CheckBox;

        constructor()
        {
            super();
            this.skinName = new SettingViewSkin();
            this.adaptationWidth();
            this.adaptationHeight();
            uniLib.AdPlat.instance.showBanner();
            if(uniLib.Global.isVivogame) window.platform.showBannerAdvertisement();
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

        public destroy()
        {
            if(uniLib.Global.isVivogame)  window.platform.showNativeAdvertisement();
            
            uniLib.AdPlat.instance.hideBanner();
            super.destroy();
        }

        private init()
        {
            if(uniLib.Global.isInGame)
            {
                this.mainGroup.visible = false;
                this.gameGroup.visible = true;
            }
            else
            {
                this.mainGroup.visible = true;
                this.gameGroup.visible = false;
                this.musicControl();
            }
        }

        private musicControl() 
		{
			if (GameInfo.instance.musicEnabled) 
            {
				this.musicCheckBox.currentState = "up";
			}
			else 
            {
				this.musicCheckBox.currentState = "down";
			}
			if (GameInfo.instance.soundEnabled) 
            {
				this.soundCheckBox.currentState = "up";
			}
			else 
            {
				this.soundCheckBox.currentState = "down";
			}
		}

        private onClickTap(e: egret.TouchEvent)
        {
            if(e.target == this.skin["closeLayer"] || e.target == this.skin["closeBtn"])
            {
                if(!uniLib.Global.isInGame)
                {
                    let soundState:number = GameInfo.instance.soundEnabled ? 1 : 0;
                    let musicState:number = GameInfo.instance.musicEnabled ? 1 : 0;
                    uniLib.Utils.setLocalStorage("MAGICDIGIT_soundState", soundState.toString());
                    uniLib.Utils.setLocalStorage("MAGICDIGIT_musicState", musicState.toString());
                }
                
                GX.PopUpManager.removePopUp(this, GX.PopUpEffect.CENTER);
            }
            else if (e.target == this.soundCheckBox) 
            {
				if (this.soundCheckBox.currentState == "up") 
                {
					this.soundCheckBox.currentState = "down"
					uniLib.SoundMgr.instance.soundOpen = false;
                    GameInfo.instance.soundEnabled = false;
				}
				else 
                {
					uniLib.SoundMgr.instance.soundOpen = true;
                    GameInfo.instance.soundEnabled = true;
					this.soundCheckBox.currentState = "up";
				}

			}
			else if (e.target == this.musicCheckBox) 
            {
				if (this.musicCheckBox.currentState == "up") 
                {
					uniLib.SoundMgr.instance.musicOpen = false;
                    GameInfo.instance.musicEnabled = false;
					this.musicCheckBox.currentState = "down";
                    uniLib.SoundMgr.instance.stopBgMusic();
				}
				else 
                {
					uniLib.SoundMgr.instance.musicOpen = true;
                    GameInfo.instance.musicEnabled = true;
					this.musicCheckBox.currentState = "up";
                    uniLib.SoundMgr.instance.playBgMusic(uniLib.SoundMgr.instance.bgMusics);
				}
			}
            else if(e.target == this.homeBtn)
            {
                if(uniLib.Global.isVivogame) window.platform.showNativeAdvertisement();
                GX.PopUpManager.removePopUp(this, GX.PopUpEffect.CENTER);
                Main.instance.changeToMainScene();
            }
            else if(e.target == this.restartBtn)
            {
                GX.PopUpManager.removePopUp(this, GX.PopUpEffect.CENTER);
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
                GameInfo.instance.clearGameMatchup();
                GameInfo.instance.curScore = 0;
                uniLib.EventListener.getInstance().dispatchEventWith(EventConsts.EVENT_UPDATE_GAME_INFO);
                GameInfo.save();
                Main.instance.loadGameScene(1);
            }
        }

    }
}