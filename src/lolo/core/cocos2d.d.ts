/**
 * cocos2dx 相关定义
 * @author LOLO
 */


declare namespace cc {

    class Class {
        static extend(props: any): void;

        ctor(...args: any[]): void;
    }


    class Node extends Class {

        anchorX: number;
        anchorY: number;
        x: number;
        y: number;
        width: number;
        height: number;
        scaleX: number;
        scaleY: number;
        rotation: number;
        opacity: number;
        visible: boolean;
        cascadeOpacity: boolean;
        zIndex: number;
        parent: Node;
        children: Node[];
        childrenCount: number;


        setAnchorPoint(point: number|Point, y?: number): void;

        setPosition(newPosOrxValue: number|Point, yValue?: number): void;

        setPositionX(X: number): void;

        getPositionX(): number;

        setPositionY(y: number): void;

        getPositionY(): number;

        setContentSize(size: number|Size, height?: number): void;

        getContentSize(): Size;

        setScale(scale: number, scaleY?: number): void;

        setScaleX(newScaleX: number): void;

        getScaleX(): number;

        setScaleY(newScaleY: number): void;

        getScaleY(): number;

        setOpacity(opacity: number): void;

        getOpacity(): number;

        setVisible(visivle: boolean): void;

        isVisible(): boolean;

        addChild(child: Node, localZOrder?: number, tagOrName?: number|string): void;

        removeChild(child: Node, cleanup: boolean = true): void;

        removeFromParent(cleanup: boolean = true): void;

        removeAllChildren(cleanup: boolean = true): void;

        getChildByName(name: string): Node;

        setParent(parent: Node): void;

        getParent(): Node;

        setLocalZOrder(localZOrder: number): void;

        getLocalZOrder(): number;

        convertToNodeSpace(worldPoint: Point): Point;

        attr(props: any): void;

        setName(name: string): void;

        getName(): string;

        scheduleUpdate(): void;

        unscheduleUpdate(): void;

        runAction(action: Action): Action;

        stopAllActions(): void;

        cleanup(): void;

        onEnter(): void;

        onExit(): void;

        retain(): void;

        release(): void;


        /////////////////////////////////
        //
        //   以下均由 lolo.cc_support() 实现
        //
        /////////////////////////////////
        // 私有属性和方法
        _original_ctor: (...args: any[]) => void;
        _original_onEnter: () => void;
        _original_setPositionX: (value: number) => void;
        _original_getPositionX: () => number;
        _original_setPositionY: (value: number) => void;
        _original_getPositionY: () => number;
        _original_setPosition: (newPosOrxValue: Point|number, yValue: number) => void;
        _original_destroy: () => void;
        _x: number;
        _y: number;
        _ed: lolo.IEventDispatcher;
        _touchEnabled: boolean;

        // 属性
        alpha: number;
        name: string;

        // 未实现，子类有需要时自行实现
        _xChanged(): void;// x 坐标有改变时，注意子类 this._xChanged() 调用 super.setPositionX() 死循环
        _yChanged(): void;// y 坐标有改变时
        destroy();// 由 cc_extendDisplayObject() 实现

        /** @see lolo.inStageVisibled */
        inStageVisibled(): boolean;


        /** @see lolo.IEventDispatcher */
        event_addListener(type: string, listener: (event: lolo.Event, ...args: any[]) => void, caller: any, priority: number = 0, ...args: any[]): void;

        event_removeListener(type: string, listener: (event: lolo.Event, ...args: any[]) => void, caller: any): void;

        event_dispatch(event: lolo.Event, bubbles: boolean = false, recycle: boolean = true): void;

        event_hasListener(type: string): boolean;

        // Touch
        /**是否启用touch事件*/
        touchEnabled: boolean;
        /**是否抛出 touch 相关事件，默认：true*/
        propagateTouchEvents: boolean;
        /**touch事件侦听器*/
        touchListener: TouchListener;

        /** @see lolo.touchHitTest (default) */
        hitTest(worldPoint: Point): boolean;
    }


    class Sprite extends Node {
        texture: Texture2D;

        setTexture(texture: Texture2D): void;

        getTexture(): Texture2D;

        setTextureRect(rect: Rect, rotated: boolean = false, untrimmedSize?: Size): void;

        setCenterRectNormalized(rect: Rect): void;
    }


    class LabelTTF extends Sprite {

        setFontName(fontName: string): void;

        getFontName(): string;

        setFontSize(fontSize: number): void;

        getFontSize(): number;

        setFontFillColor(fillColor: Color): void;

        getFontFillColor(): Color;

        setDimensions(dim: number|Size, height: number): void;

        getDimensions(): Size;

        setHorizontalAlignment(alignment: number): void;

        getHorizontalAlignment(): number;

        setVerticalAlignment(verticalAlignment: number): void;

        getVerticalAlignment(): number;

        enableStroke(strokeColor: Color, strokeSize: number = 0): void;

        disableStroke(): void;

        setString(text: string): void;

        getString(): string;

        _setUpdateTextureDirty(): void;// html5中，只修改文本颜色时，需要调用该方法才能更新显示
    }

    class TextFieldTTF extends LabelTTF {

    }


    class Texture2D extends Class {
        width: number;
        height: number;

        initWithElement(element: HTMLElement): void;

        handleLoadedTexture(): void;

        retain(): void;

        release(): void;
    }

    class RenderTexture extends Node {

        sprite: Sprite;

        constructor(width: number, height: number, format?: any, depthStencilFormat?: any);

        clear(r: number, g: number, b: number, a: number): void;
    }


    class ClippingNode extends Node {
        stencil: Node;
        alphaThreshold: number;
        inverted: boolean;
        mask: lolo.Mask;// 对应的mask。cc.ClippingNode 不能继承，lolo.Mask 需要绕开写
    }


    class SpriteBatchNode extends Node {
        texture: Texture2D;

        constructor(fileImage: Texture2D|string, capacity?: number);
    }


    class Layer extends Node {
    }

    class Control extends Layer {
    }

    class ControlButton extends Control {
    }

    class EditBox extends ControlButton {
        placeholder: string;
        maxLength: number;

        constructor(size?: Size, normal9SpriteBg?: Scale9Sprite);

        setFontName(value: string): void;

        setFontSize(value: number): void;

        setFontColor(value: Color): void;

        setPlaceholderFontName(value: string): void;

        setPlaceholderFontSize(value: number): void;

        setPlaceholderFontColor(value: Color): void;

        setString(value: string): void;

        getString(): string;

        setInputMode(value: number): void;

        setInputFlag(value: number): void;

        setReturnType(value: number): void;

        setDelegate(value: EditBoxDelegate): void;

        /**打开键盘（native 使用）*/
        openKeyboard(): void;
    }

    class ParticleSystem extends Node {
        sourceName: string;// lolo.Particle 实现该属性
        duration: number;
        texture: Texture2D;
        emissionRate: number;

        initWithDictionary(dictionary: any): void;

        stopSystem(): void;

        resetSystem(): void;
    }

    class ParticleBatchNode extends Node {
        initWithTexture(texture: Texture2D): void;

        setTexture(texture: Texture2D): void;
    }

    class Scale9Sprite extends Node {
        constructor(file: string, rect?: Rect, capInsets?: Rect);
    }

    class EditBoxDelegate extends Class {
    }


    class Scene extends Node {
    }


    class Director extends Class {
    }
}


// Event 和 Touch 相关
declare namespace cc {

    class Event extends Class {
        getCurrentTarget(): Node;

        getType(): number;

        isStopped(): boolean;

        stopPropagation(): void;
    }

    class EventTouch extends Event {
        getEventCode(): number;

        getTouches(): any[];
    }


    class Touch extends Class {
        getID(): number;

        getDelta(): Point;

        getLocationX(): number;

        getLocationY(): number;

        getLocation(): Point;

        getPreviousLocation(): Point;

        getStartLocation(): Point;
    }

    class EventManager extends Class {
        addListener(listener: EventListener, nodeOrPriority: Node|number): void;

        removeListener(listener: EventListener): void;

        setPriority(listener: EventListener, fixedPriority: number): void;
    }

    class EventListener extends Class {
        static TOUCH_ONE_BY_ONE: number;

        static create(argObj: any): EventListener;

        _type: number;// _type 就是 event
        _registered: boolean;// html5中，onEnter 的时候需要知道是否已经注册过 touchListener 了

        retain(): void;

        release(): void;

        clo(): EventListener;
    }

    class TouchListener extends EventListener {
        event: number;
        swallowTouches: boolean;
        bubbles: boolean;

        onTouchBegan(touch: Touch, event: EventTouch): boolean;

        onTouchMoved(touch: Touch, event: EventTouch): void;

        onTouchEnded(touch: Touch, event: EventTouch): void;

        setSwallowTouches(value: boolean): void;

        isSwallowTouches(): boolean;
    }
}


declare namespace cc {

    interface Game {
        config: any;
        CONFIG_KEY: {
            engineDir: string,
            dependencies: string,
            debugMode: string,
            showFPS: string,
            frameRate: string,
            id: string,
            renderMode: string,
            jsList: string,
            classReleaseMode: string
        };

        setFrameRate(frameRate: number): void;
        run(id?: string): void;
    }

    interface EGLView {
        enableRetina(enabled: boolean): void;
        adjustViewPort(enabled: boolean): void;
        setDesignResolutionSize(width: number, height: number, resolutionPolicy: number): void;
        resizeWithBrowserSize(enabled: boolean): void;
        setResizeCallback(callback: () => void): void;
    }

    interface TextureCache {
        removeTexture(texture): void;
    }

}


// 全局变量
declare namespace cc {
    let winSize: Size;
    let director: Director;
    let eventManager: EventManager;
    let game: Game;
    let view: EGLView;
    let textureCache: TextureCache;

    // EditBox Constants
    let EDITBOX_INPUT_MODE_ANY: number;// 文本键盘（含换行）[ 默认 ]
    let EDITBOX_INPUT_MODE_EMAILADDR: number;// 邮箱地址键盘
    let EDITBOX_INPUT_MODE_NUMERIC: number;// 数字符号键盘
    let EDITBOX_INPUT_MODE_PHONENUMBER: number;// 电话号码键盘
    let EDITBOX_INPUT_MODE_URL: number;// URL键盘
    let EDITBOX_INPUT_MODE_DECIMAL: number;// 输入键盘（含小数点）
    let EDITBOX_INPUT_MODE_SINGLELINE: number;// 文本键盘（不含换行）

    let EDITBOX_INPUT_FLAG_PASSWORD: number;// 密码形式
    let EDITBOX_INPUT_FLAG_SENSITIVE: number;// 敏感数据输入[ 默认 ]
    let EDITBOX_INPUT_FLAG_INITIAL_CAPS_WORD: number;// 每个单词首字符大写，并有提示
    let EDITBOX_INPUT_FLAG_INITIAL_CAPS_SENTENCE: number;// 第一句首字符大写，并有提示
    let EDITBOX_INPUT_FLAG_INITIAL_CAPS_ALL_CHARACTERS: number;// 自动大写

    let KEYBOARD_RETURNTYPE_DEFAULT: number;// 默认类型[ 默认 ]
    let KEYBOARD_RETURNTYPE_DONE: number;// Done字样
    let KEYBOARD_RETURNTYPE_SEND: number;// Send字样
    let KEYBOARD_RETURNTYPE_SEARCH: number;// Search字样
    let KEYBOARD_RETURNTYPE_GO: number;// Go字样
}


// 全局函数
declare namespace cc {

    function log(str: string): void;

    /**返回一个新的 cc.Color 对象*/
    function color(r?: number|Color, g?: number, b?: number, a?: number = 255): Color;

    /**返回一个新的 cc.Color 对象*/
    function hexToColor(hex: string): Color;

    function colorToHex(color: Color): string;

    function p(x?: number, y?: number): Point;

    function size(w?: number, h?: number): Size;

    function rect(x?: number, y?: number, w?: number, h?: number): Rect;

}


// 数据类型
declare namespace cc {

    interface Size {
        width: number;
        height: number;
    }

    interface Point {
        x: number;
        y: number;
    }

    interface Rect {
        x: number;
        y: number;
        width: number;
        height: number;
    }

    interface Color {
        r: number;
        g: number;
        b: number;
        a: number;
    }

}


// Action
declare namespace cc {

    class Action extends Class {
        // target: Node;// native 会取到 undefined，请使用 getTarget()
        // originalTarget: Node;
        tag: number;

        clone(): Action;

        update(dt: number): void;

        getTarget(): Node;

        getOriginalTarget(): Node;

        stop(): void;

        isDone(): boolean;
    }

    class FiniteTimeAction extends Action {
        setDuration(value: number): void;

        getDuration(): number;

        reverse(): void;
    }


    class ActionInterval extends FiniteTimeAction {
        easing(...easeObj: ActionEase[]): ActionInterval;// return this
        repeatForever(): ActionInterval;// return this
        repeat(times: number): ActionInterval;// return this
        speed(speed: number): ActionInterval;// return this
    }
    //
    class MoveBy extends ActionInterval {
        constructor(duration: number, deltaPos: number|Point, deltaY?: number);
    }
    class MoveTo extends MoveBy {
        constructor(duration: number, position: number|Point, y?: number);
    }
    //
    class FadeTo extends ActionInterval {
        constructor(duration: number, opacity: number);
    }
    class FadeIn extends FadeTo {
        constructor(duration: number);
    }
    class FadeOut extends FadeTo {
        constructor(duration: number);
    }
    //
    class ScaleTo extends ActionInterval {
        constructor(duration: number, sx: number, sy?: number);
    }
    class ScaleBy extends ScaleTo {
        constructor(duration: number, sx: number, sy?: number);
    }
    //
    class RotateTo extends ActionInterval {
        constructor(duration: number, deltaAngleX: number, deltaAngleY?: number);
    }
    class RotateBy extends ActionInterval {
        constructor(duration: number, deltaAngleX: number, deltaAngleY?: number);
    }

    //

    class DelayTime extends ActionInterval {
        constructor(delay: number);
    }

    class Sequence extends ActionInterval {
        constructor(...tempArray: FiniteTimeAction[]);
    }

    class Spawn extends ActionInterval {
        constructor(...tempArray: FiniteTimeAction[]);
    }

    //

    class ActionInstant extends FiniteTimeAction {
    }

    class CallFunc extends ActionInstant {
        constructor(selector: Function, selectorTarget: any, data?: any);

        execute(): void;

        getTargetCallback(): any;// return selectorTarget
    }

    class Show extends ActionInstant {
        constructor();
    }

    class Hide extends ActionInstant {
        constructor();
    }

    //

    class ActionEase extends ActionInterval {
    }

    class EaseSineOut extends ActionEase {
    }

    class EaseBackIn extends ActionEase {
    }
    class EaseBackOut extends ActionEase {
    }

    class EaseRateAction extends ActionEase {
    }
    class EaseOut extends EaseRateAction {
    }

}


// Action 快捷创建
declare namespace cc {

    function moveBy(duration: number, deltaPos: number|Point, deltaY?: number): MoveBy;

    function moveTo(duration: number, position: number|Point, y?: number): MoveTo;

    //
    function fadeTo(duration: number, opacity: number): FadeTo;

    function fadeIn(duration: number): FadeIn;

    function fadeOut(duration: number): FadeOut;

    //
    function scaleTo(duration: number, sx: number, sy?: number): ScaleTo;

    function scaleBy(duration: number, sx: number, sy?: number): ScaleBy;

    //
    function rotateTo(duration: number, deltaAngleX: number, deltaAngleY?: number): RotateTo;

    function rotateBy(duration: number, deltaAngleX: number, deltaAngleY?: number): RotateBy;

    //
    //
    function easeRateAction(action: ActionInterval, rate: number): EaseRateAction;

    function easeOut(rate: number): EaseOut;

    function easeSineOut(): EaseSineOut;

    function easeBackIn(): EaseBackIn;

    function easeBackOut(): EaseBackOut;

    //
    //

    function delayTime(delay: number): DelayTime;

    function sequence(...tempArray: FiniteTimeAction[]): Sequence;

    function spawn(...tempArray: FiniteTimeAction[]): Spawn;

    //
    //
    function callFunc(selector: Function, selectorTarget?: any, data?: any): CallFunc;

    function show(): Show;

    function hide(): Hide;

}


declare namespace jsb {
    class fileUtils {
        static getWritablePath(): string;

        static createDirectory(path: string): boolean;

        static isFileExist(filePath: string): boolean;

        static writeStringToFile(data: string, fullPath: string): boolean;
    }
}


declare namespace cc.sys {
    let isNative: boolean;
    let isMobile: boolean;

    let localStorage: {
        setItem: (key: string, value: string) => void;
        getItem: (key: string) => string;
        removeItem: (key: string) => void;
    };
}


declare namespace cc.loader {
    function load(resources: any|any[], optionOrCB?: any, cb?: Function): void;

    function loadImg(url: string, option: any, cb: Function): void;

    function loadJson(url: string, cb: Function): void;

    function loadTxt(url: string, cb: Function): void;

    function loadJs(url: string|string[], cb: Function): void;

    function getXMLHttpRequest(): XMLHttpRequest;
}

