import { BaseWindow } from "./BaseWindow";
import { FGUIManager } from "./FGUIManager";

/**
 * 基础视图(页面)类
 */
export abstract class BaseView extends BaseWindow {

    protected pkgName: string = "";
    protected resName: string = "";
    protected closeButtonName: string = "background/closeButton";
    protected showEnterAndLeaveAnim: boolean = false;

    protected modal: boolean = true;

    protected onInit(): void {
        this.contentPane = fgui.UIPackage.createObject(`${this.pkgName}`, `${this.resName}`).asCom;
        (!this.closeButton) && (this.closeButton = this.contentPane.getChild("closeButton"));
        (!this.closeButton) && (this.closeButton = this.findGObj(this.closeButtonName));
        this.modal = true;
        this.contentPane.makeFullScreen();
        this.onCreate(this.contentPane);
        // 下一帧显示
        this.contentPane.alpha = 0;
        this.scheduleOnce(() => {
            this.contentPane.alpha = 1;
        });
    }


    doShowAnimation() {
        if (this.showEnterAndLeaveAnim) {
            const width = this.rootView.node.width;
            this.rootView.node.position = this.rootView.node.position.sub(cc.v2(width, 0));
            this.rootView.node.runAction(cc.sequence([
                cc.moveBy(0.2, cc.v2(width, 0)),
                cc.callFunc(() => {
                })
            ]));
        }
        this.onShown();
    }


    doHideAnimation() {
        if (this.showEnterAndLeaveAnim) {
            const width = this.rootView.node.width;
            this.rootView.node.runAction(cc.sequence([
                cc.moveBy(0.15, cc.v2(-width, 0)),
                cc.callFunc(() => {
                    this.hideImmediately();
                    this.rootView.node.position = this.rootView.node.position.add(cc.v2(width, 0));
                })
            ]));
        } else {
            this.hideImmediately();
        }
    }


    openPage(baseViewClass: new () => BaseView) {
        FGUIManager.getUI(baseViewClass).show();
    }


    showDialog(baseWindowClass: new () => BaseWindow) {
        FGUIManager.getUI(baseWindowClass).show();
    }


    protected onShown() {
        this.bringToFront();
    }


    protected onHide() {
    }

}
