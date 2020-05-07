import { Path } from "../../scene/shape/path";

export class RangeMask extends Path {
    static className = 'RangeMask';

    protected _stroke = 'black';
    protected _strokeWidth = 1;
    protected _fillOpacity = 0.2;

    protected _x: number = 0;
    set x(value: number) {
        if (this._x !== value) {
            this._x = value;
            this.dirtyPath = true;
        }
    }
    get x(): number {
        return this._x;
    }

    protected _y: number = 0;
    set y(value: number) {
        if (this._y !== value) {
            this._y = value;
            this.dirtyPath = true;
        }
    }
    get y(): number {
        return this._y;
    }

    protected _width: number = 200;
    set width(value: number) {
        if (this._width !== value) {
            this._width = value;
            this.dirtyPath = true;
        }
    }
    get width(): number {
        return this._width;
    }

    protected _height: number = 30;
    set height(value: number) {
        if (this._height !== value) {
            this._height = value;
            this.dirtyPath = true;
        }
    }
    get height(): number {
        return this._height;
    }

    protected _min: number = 0;
    set min(value: number) {
        value = Math.min(Math.max(value, 0), this.max);
        if (this._min !== value) {
            this._min = value;
            this.dirtyPath = true;
        }
    }
    get min(): number {
        return this._min;
    }

    protected _max: number = 1;
    set max(value: number) {
        value = Math.max(Math.min(value, 1), this.min);
        if (this._max !== value) {
            this._max = value;
            this.dirtyPath = true;
        }
    }
    get max(): number {
        return this._max;
    }

    updatePath() {
        const { path, x, y, width, height, min, max } = this;

        path.clear();

        // Whole range.
        path.moveTo(x, y);
        path.lineTo(x + width, y);
        path.lineTo(x + width, y + height);
        path.lineTo(x, y + height);
        path.lineTo(x, y);

        const minX = x + width * min;
        const maxX = x + width * max;
        // Visible range.
        path.moveTo(minX, y);
        path.lineTo(minX, y + height);
        path.lineTo(maxX, y + height);
        path.lineTo(maxX, y);
        path.lineTo(minX, y);
    }
}