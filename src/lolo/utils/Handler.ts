namespace lolo {


    /**
     * 用于 指定执行域（this），携带参数 的情况下，执行回调函数
     * @author LOLO
     */
    export class Handler {
        /**Hander 缓存池*/
        private static _pool: Handler[] = [];

        /**执行域（this）*/
        public caller: any;
        /**回调函数*/
        public callback: Function;
        /**附带的参数*/
        public args: any[];
        /**是否只执行一次，执行完毕后，将会自动回收到池中*/
        public once: boolean;

        /**是否正在缓存池中*/
        public inPool: boolean = false;
        /**setTimeout() 返回的句柄。使用 lolo.delayedCall() 创建时，才会存在该属性*/
        public dcHandle: number;


        /**
         * 创建，或从池中获取一个 Handler 对象。
         * 注意：：使用 Handler.once() 创建的 Handler 对象 once 属性默认为 true。
         * 如果不想执行完毕被回收（比如：timer.timerHandler），请使用 new Hander() 来创建。或设置 once=false
         * @param callback 回调函数
         * @param caller 执行域（this）
         * @param args 附带的参数
         */
        public static once(callback: Function, caller: any, ...args: any[]): Handler {
            let handler: Handler;
            if (this._pool.length > 0) {
                handler = this._pool.pop();
                handler.inPool = false;
                handler.setTo(callback, caller, args, true);
            }
            else {
                handler = new Handler(callback, caller);
                handler.args = args;
                handler.once = true;
            }
            return handler;
        }


        /**
         * 创建一个 Handler 对象
         * 如果 Handler 只需要被执行一次，推荐使用 Handler.create() 创建
         * @param callback 回调函数
         * @param caller 执行域（this）
         * @param args 附带的参数
         */
        public constructor(callback: Function, caller: any, ...args: any[]) {
            this.setTo(callback, caller, args, false);
        }


        /**
         * 设置属性值
         */
        public setTo(callback: Function, caller: any, args: any[], once: boolean): void {
            this.callback = callback;
            this.caller = caller;
            this.args = args;
            this.once = once;
        }


        /**
         * 执行回调
         * @param args 附带的参数。在执行回调时，args 的值会添加到创建时传入的 args 之前。args.concat(this.args)
         */
        public execute(...args: any[]): void {
            if (this.dcHandle != null) {
                clearTimeout(this.dcHandle);
                this.dcHandle = null;
            }

            if (this.callback != null)
                this.callback.apply(this.caller, args.concat(this.args));

            if (this.once) this.recycle();
        }


        /**
         * 清除引用，并回收到池中。
         * 注意：手动调用该方法，一定要仔细检查上下文逻辑，避免缓存池混乱
         */
        public recycle(): void {
            if (this.inPool) return;
            this.inPool = true;

            this.clean();
            Handler._pool.push(this);
        }


        /**
         * 清除引用（不再执行 callback）
         */
        public clean(): void {
            if (this.dcHandle != null) {
                clearTimeout(this.dcHandle);
                this.dcHandle = null;
            }
            this.callback = null;
            this.caller = null;
            this.args = null;
        }

        //
    }
}