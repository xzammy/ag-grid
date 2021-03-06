import { Autowired, Events, EventService, GridApi, PostConstruct, IStatusPanelComp, _ } from '@ag-grid-community/core';
import { NameValueComp } from "./nameValueComp";

export class SelectedRowsComp extends NameValueComp implements IStatusPanelComp {

    @Autowired('eventService') private eventService: EventService;
    @Autowired('gridApi') private gridApi: GridApi;

    @PostConstruct
    protected postConstruct(): void {

        if (!this.isValidRowModel()) {
            console.warn(`ag-Grid: agSelectedRowCountComponent should only be used with the client and server side row model.`);
            return;
        }

        this.setLabel('selectedRows', 'Selected');

        this.addCssClass('ag-status-panel');
        this.addCssClass('ag-status-panel-selected-row-count');

        const selectedRowCount = this.gridApi.getSelectedRows().length;
        this.setValue(_.formatNumberCommas(selectedRowCount));
        this.setDisplayed(selectedRowCount > 0);

        const eventListener = this.onRowSelectionChanged.bind(this);
        this.events = [
            this.eventService.addEventListener(Events.EVENT_MODEL_UPDATED, eventListener),
            this.eventService.addEventListener(Events.EVENT_SELECTION_CHANGED, eventListener)
        ];
    }

    private isValidRowModel() {
        // this component is only really useful with client or server side rowmodels
        const rowModelType = this.gridApi.getModel().getType();
        return rowModelType === 'clientSide' || rowModelType === 'serverSide';
    }

    private onRowSelectionChanged() {
        const selectedRowCount = this.gridApi.getSelectedRows().length;
        this.setValue(_.formatNumberCommas(selectedRowCount));
        this.setDisplayed(selectedRowCount > 0);
    }

    public init() {
    }
}
