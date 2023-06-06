module game 
{
    /**
    * 公共加载
    */
    export class PublicLoadingView extends ui.BaseUI 
    {
        private thumb: eui.Image;
        private labelDisplay: eui.Label;
        private maskRect: eui.Rect;
        private progressBarGroup: eui.Group;
        private descLabel:eui.Label;

        public constructor() 
        {
            super();
            this.skinName = new PublicLoadingSkin();
            this.init();
            this.adaptationHeight();
            this.adaptationWidth();
        }
        destroy(): void 
        {
            super.destroy();
        }
        public addUIListener(): void 
        {
            egret.MainContext.instance.stage.addEventListener(egret.Event.RESIZE, this.onResize, this);
        }
        public removeUIListener(): void 
        {
            egret.MainContext.instance.stage.removeEventListener(egret.Event.RESIZE, this.onResize, this);
        }
        public onResize() 
        {
            this.adaptationHeight();
            this.adaptationWidth();
        }
        
        public init(): void 
        {
            this.thumb.mask = this.maskRect;
            this.maskRect.width = 0;
            this.labelDisplay.text = "";
        }

        public setProgress(loaded: number, total: number, desc?: string, resourceName?: string, force: boolean = false): void 
        {
            let cur = loaded * (force == false ? 93 : 100) / total;
            cur = cur < 1 ? 1 : cur;
            cur = Math.floor(cur);
            if (resourceName == null && total == 100) {
                cur = loaded;
            }
            this.descLabel.text = desc ? desc : "";
            this.labelDisplay.text = cur + "%";
            this.maskRect.width = this.progressBarGroup.width / 100 * cur;
            
        }
    }
}