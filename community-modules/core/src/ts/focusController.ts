import { Bean, Autowired, PostConstruct } from "./context/context";
import { BeanStub } from "./context/beanStub";
import { Column } from "./entities/column";
import { CellFocusedEvent, Events } from "./events";
import { GridOptionsWrapper } from "./gridOptionsWrapper";
import { ColumnApi } from "./columnController/columnApi";
import { ColumnController } from "./columnController/columnController";
import { CellPosition } from "./entities/cellPosition";
import { RowNode } from "./entities/rowNode";
import { GridApi } from "./gridApi";
import { CellComp } from "./rendering/cellComp";
import { HeaderRowComp } from "./headerRendering/headerRowComp";
import { AbstractHeaderWrapper } from "./headerRendering/header/abstractHeaderWrapper";
import { HeaderPosition } from "./headerRendering/header/headerPosition";
import { _ } from "./utils";

@Bean('focusController')
export class FocusController extends BeanStub {

    @Autowired('gridOptionsWrapper') private gridOptionsWrapper: GridOptionsWrapper;
    @Autowired('columnController') private columnController: ColumnController;
    @Autowired('columnApi') private columnApi: ColumnApi;
    @Autowired('gridApi') private gridApi: GridApi;

    private focusedCellPosition: CellPosition;
    private focusedHeaderPosition: HeaderPosition;
    private keyboardFocusActive: boolean = false;

    @PostConstruct
    private init(): void {
        const eDocument = this.gridOptionsWrapper.getDocument();

        const clearFocusedCellListener = this.clearFocusedCell.bind(this);

        this.addManagedListener(this.eventService, Events.EVENT_COLUMN_PIVOT_MODE_CHANGED, clearFocusedCellListener);
        this.addManagedListener(this.eventService, Events.EVENT_COLUMN_EVERYTHING_CHANGED, this.onColumnEverythingChanged.bind(this));
        this.addManagedListener(this.eventService, Events.EVENT_COLUMN_GROUP_OPENED, clearFocusedCellListener);
        this.addManagedListener(this.eventService, Events.EVENT_COLUMN_ROW_GROUP_CHANGED, clearFocusedCellListener);

        this.addManagedListener(eDocument, 'keydown', this.activateKeyboardMode.bind(this));
        this.addManagedListener(eDocument, 'mousedown', this.activateMouseMode.bind(this));
    }

    public onColumnEverythingChanged(): void {
        // if the columns change, check and see if this column still exists. if it does,
        // then we can keep the focused cell. if it doesn't, then we need to drop the focused
        // cell.
        if (this.focusedCellPosition) {
            const col = this.focusedCellPosition.column;
            const colFromColumnController = this.columnController.getGridColumn(col.getId());
            if (col !== colFromColumnController) {
                this.clearFocusedCell();
            }
        }
    }

    public isKeyboardFocus(): boolean {
        return this.keyboardFocusActive;
    }

    private activateMouseMode(): void {
        this.keyboardFocusActive = false;
        this.eventService.dispatchEvent({ type: Events.EVENT_MOUSE_FOCUS });
    }

    private activateKeyboardMode(): void {
        this.keyboardFocusActive = true;
        this.eventService.dispatchEvent({ type: Events.EVENT_KEYBOARD_FOCUS });
    }

    // we check if the browser is focusing something, and if it is, and
    // it's the cell we think is focused, then return the cell. so this
    // methods returns the cell if a) we think it has focus and b) the
    // browser thinks it has focus. this then returns nothing if we
    // first focus a cell, then second click outside the grid, as then the
    // grid cell will still be focused as far as the grid is concerned,
    // however the browser focus will have moved somewhere else.
    public getFocusCellToUseAfterRefresh(): CellPosition {
        if (this.gridOptionsWrapper.isSuppressFocusAfterRefresh()) {
            return null;
        }

        if (!this.focusedCellPosition) {
            return null;
        }

        // we check that the browser is actually focusing on the grid, if it is not, then
        // we have nothing to worry about
        const browserFocusedCell = this.getGridCellForDomElement(document.activeElement);
        if (!browserFocusedCell) {
            return null;
        }

        return this.focusedCellPosition;
    }

    private getGridCellForDomElement(eBrowserCell: Node): CellPosition {

        let ePointer = eBrowserCell;
        while (ePointer) {
            const cellComp = this.gridOptionsWrapper.getDomData(ePointer, CellComp.DOM_DATA_KEY_CELL_COMP) as CellComp;
            if (cellComp) {
                return cellComp.getCellPosition();
            }
            ePointer = ePointer.parentNode;
        }

        return null;
    }

    public clearFocusedCell(): void {
        this.focusedCellPosition = null;
        this.onCellFocused(false);
    }

    public getFocusedCell(): CellPosition {
        return this.focusedCellPosition;
    }

    public setFocusedCell(rowIndex: number, colKey: string | Column, floating: string | undefined, forceBrowserFocus = false): void {
        const column = _.makeNull(this.columnController.getGridColumn(colKey));
        this.focusedCellPosition = {rowIndex: rowIndex, rowPinned: _.makeNull(floating), column: column};
        this.onCellFocused(forceBrowserFocus);
    }

    public isCellFocused(cellPosition: CellPosition): boolean {
        if (_.missing(this.focusedCellPosition)) { return false; }
        return this.focusedCellPosition.column === cellPosition.column && this.isRowFocused(cellPosition.rowIndex, cellPosition.rowPinned);
    }

    public isRowNodeFocused(rowNode: RowNode): boolean {
        return this.isRowFocused(rowNode.rowIndex, rowNode.rowPinned);
    }

    public isHeaderWrapperFocused(headerWrapper: AbstractHeaderWrapper): boolean {
        if (_.missing(this.focusedHeaderPosition)) { return false; }
        const column = headerWrapper.getColumn();
        const headerRowIndex = (headerWrapper.getParentComponent() as HeaderRowComp).getRowIndex();
        const pinned = headerWrapper.getPinned();

        return column === this.focusedHeaderPosition.column &&
            headerRowIndex === this.focusedHeaderPosition.headerRowIndex &&
            pinned == this.focusedHeaderPosition.pinned;
    }

    public clearFocusedHeader(): void {
        this.focusedHeaderPosition = null;
    }

    public getFocusedHeader(): HeaderPosition {
        return this.focusedHeaderPosition;
    }

    public setHeaderFocused(headerWrapper: AbstractHeaderWrapper): void {
        const column = headerWrapper.getColumn();
        const headerRowIndex = (headerWrapper.getParentComponent() as HeaderRowComp).getRowIndex();
        const pinned = headerWrapper.getPinned();

        this.focusedHeaderPosition = {
            column,
            headerRowIndex,
            pinned
        };
    }

    public isAnyCellFocused(): boolean {
        return !!this.focusedCellPosition;
    }

    public isRowFocused(rowIndex: number, floating: string): boolean {
        if (_.missing(this.focusedCellPosition)) { return false; }
        const floatingOrNull = _.makeNull(floating);
        return this.focusedCellPosition.rowIndex === rowIndex && this.focusedCellPosition.rowPinned === floatingOrNull;
    }

    public findFocusableElements(rootNode: HTMLElement, exclude?: string): HTMLElement[] {
        const focusableString = '[tabindex], input, select, button, textarea';
        let excludeString = '.ag-hidden, .ag-hidden *, .ag-disabled, .ag-disabled *';

        if (exclude) {
            excludeString += ', ' + exclude;
        }

        const nodes = Array.from(rootNode.querySelectorAll(focusableString)) as HTMLElement[];
        const excludeNodes = Array.from(rootNode.querySelectorAll(excludeString)) as HTMLElement[];

        if (!excludeNodes.length) {
            return nodes;
        }

        const diff = (a: HTMLElement[], b: HTMLElement[]) => a.filter(element => b.indexOf(element) === -1);
        return diff(nodes, excludeNodes);
    }

    private onCellFocused(forceBrowserFocus: boolean): void {
        const event: CellFocusedEvent = {
            type: Events.EVENT_CELL_FOCUSED,
            forceBrowserFocus: forceBrowserFocus,
            rowIndex: null as number,
            column: null as Column,
            floating: null as string,
            api: this.gridApi,
            columnApi: this.columnApi,
            rowPinned: null as string
        };

        if (this.focusedCellPosition) {
            event.rowIndex = this.focusedCellPosition.rowIndex;
            event.column = this.focusedCellPosition.column;
            event.rowPinned = this.focusedCellPosition.rowPinned;
        }

        this.eventService.dispatchEvent(event);
    }
}
