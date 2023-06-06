
module game 
{
    /**
     * 消息提示 显示在屏幕中央，没有操作，显示3秒后移除
     */
    export class TipsPanel extends eui.Component
    {
        private msgLabel: eui.Label;
        constructor(msg: string) 
        {
            super();
            this.skinName = new TipsSkin();
            this.msgLabel.text = msg;
            this.touchChildren = false;
            this.touchEnabled = false;
        }
    }
}
