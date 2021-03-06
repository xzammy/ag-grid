// Type definitions for @ag-grid-community/core v23.1.1
// Project: http://www.ag-grid.com/
// Definitions by: Niall Crosby <https://github.com/ag-grid/>
import { DraggingEvent, DragSourceType, DropTarget } from "../dragAndDrop/dragAndDropService";
import { GridPanel } from "./gridPanel";
import { RowDragEnterEvent, RowDragLeaveEvent, RowDragMoveEvent, RowDragEndEvent } from "../events";
export interface RowDropZoneEvents {
    onDragEnter?: (params: RowDragEnterEvent) => void;
    onDragLeave?: (params: RowDragLeaveEvent) => void;
    onDragging?: (params: RowDragMoveEvent) => void;
    onDragStop?: (params: RowDragEndEvent) => void;
}
export interface RowDropZoneParams extends RowDropZoneEvents {
    getContainer: () => HTMLElement;
    fromGrid?: boolean;
}
export declare class RowDragFeature implements DropTarget {
    private dragAndDropService;
    private rowModel;
    private columnController;
    private focusController;
    private sortController;
    private filterManager;
    private gridOptionsWrapper;
    private selectionController;
    private rangeController;
    private mouseEventService;
    private eventService;
    private gridPanel;
    private clientSideRowModel;
    private eContainer;
    private needToMoveUp;
    private needToMoveDown;
    private movingIntervalId;
    private intervalCount;
    private lastDraggingEvent;
    private isMultiRowDrag;
    private events;
    private isGridSorted;
    private isGridFiltered;
    private isRowGroupActive;
    constructor(eContainer: HTMLElement, gridPanel: GridPanel);
    private postConstruct;
    destroy(): void;
    private onSortChanged;
    private onFilterChanged;
    private onRowGroupChanged;
    getContainer(): HTMLElement;
    isInterestedIn(type: DragSourceType): boolean;
    getIconName(): string;
    shouldPreventRowMove(): boolean;
    private getRowNodes;
    onDragEnter(draggingEvent: DraggingEvent): void;
    onDragging(draggingEvent: DraggingEvent): void;
    private isFromThisGrid;
    private isDropZoneWithinThisGrid;
    private onEnterOrDragging;
    private doManagedDrag;
    private getRowIndexNumber;
    private moveRowAndClearHighlight;
    private clearRowHighlight;
    private moveRows;
    private checkCenterForScrolling;
    private ensureIntervalStarted;
    private ensureIntervalCleared;
    private moveInterval;
    addRowDropZone(params: RowDropZoneParams): void;
    getRowDropZone(events: RowDropZoneEvents): RowDropZoneParams;
    private draggingToRowDragEvent;
    dispatchEvent(type: string, draggingEvent: DraggingEvent): void;
    onDragLeave(draggingEvent: DraggingEvent): void;
    onDragStop(draggingEvent: DraggingEvent): void;
    private stopDragging;
}
