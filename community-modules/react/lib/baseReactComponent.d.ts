// @ag-grid-community/react v23.1.1
import { IComponent, WrapableInterface } from '@ag-grid-community/core';
export declare abstract class BaseReactComponent implements IComponent<any>, WrapableInterface {
    hasMethod(name: string): boolean;
    callMethod(name: string, args: IArguments): void;
    addMethod(name: string, callback: Function): void;
    abstract getGui(): HTMLElement;
    abstract getFrameworkComponentInstance(): any;
}
