<?php
$pageTitle = "Column Pinning: Core Feature of our Datagrid";
$pageDescription = "Core feature of ag-Grid supporting Angular, React, Javascript and more. One such feature is Column Pinning. Use Column Pinning to pin one or more columns to the left or to the right. Pinned columns are always present and not impacted by horizontal scroll. Version 20 is available for download now, take it for a free two month trial.";
$pageKeywords = "ag-Grid Pinning";
$pageGroup = "feature";
include '../documentation-main/documentation_header.php';
?>

<h1>Column Pinning</h1>

<p class="lead">
    You can pin columns by setting the <code>pinned</code> attribute on the column definition to either <code>'left'</code> or <code>'right'</code>.
</p>

<?= createSnippet(<<<SNIPPET
colDef = {
    headerName: "Athlete",
    field: "athlete",
    pinned: 'left'
}
SNIPPET
) ?>

<p>
    Below shows an example with two pinned columns on the left and one pinned column on the right.
    The example also demonstrates changing the pinning via the API at runtime.
</p>

<p>
    The grid will reorder the columns so that 'left pinned' columns come first and 'right pinned' columns
    come last. In the example below the state of pinned columns impacts the order of the
    columns such that when 'Country' is pinned, it jumps to the first position.
</p>

<h2>Jump To & Pinning</h2>

<p>
    Below shows jumping to rows and columns via the API. Jumping to a pinned column makes no sense, as the pinned
    columns, by definition, are always visible. So below, if you try to jump to a pinned column, the grid will
    print a warning to the console.
</p>

<h2>Example Pinning</h2>

<?= grid_example('Column Pinning', 'column-pinning', 'generated', ['exampleHeight' => 570]) ?>

<h2>Pinning via Column Dragging</h2>

<p>It is possible to pin a column by moving the column in the following ways:</p>

<ul class="content">
    <li>
        When other columns are pinned, drag the column to the existing pinned area.
    </li>
    <li>
        When no columns are pinned, drag the column to the edge of the grid and wait
        for approximately one second. The grid will then assume you want to pin and create
        a pinned area and place the column into it.
    </li>
</ul>

<img src="../javascript-grid-pinning/pinningByMoving.gif" style="margin: 10px; border: 1px solid #aaa;" alt="Pinning via Column Dragging" />

<h2>Lock Pinned</h2>

<p>
    If you do not want the user to be able to pin using the UI, set the property
    <code>lockPinned=true</code>. This will block the UI in the following way:
</p>

<ul class="content">
    <li>Dragging a column to the pinned section will not pin the column.</li>
    <li>For ag-Grid Enterprise, the column menu will not have a pin option.</li>
</ul>

<p>
    The example below demonstrates columns with pinning locked. The following can be noted:
</p>

<ul class="content">
    <li>
        The column <b>Athlete</b> is pinned via the configuration and has <code>lockPinned=true</code>.
        This means the column will be pinned always, it is not possible to drag the column out
        of the pinned section.
    </li>
    <li>
        The column <b>Age</b> is not pinned and has <code>lockPinned=true</code>.
        This means the column cannot be pinned by dragging the column.
    </li>
    <li>
        All other columns act as normal. They can be added and removed from the pinned
        section by dragging.
    </li>
</ul>

<?= grid_example('Lock Pinned', 'lock-pinned', 'generated') ?>

<?php include '../documentation-main/documentation_footer.php';?>
