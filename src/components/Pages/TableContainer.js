import React from "react";
import { useTable } from "react-table";
import { useFilters, useGlobalFilter } from "react-table";
import { GlobalFilter, DefaultFilterForColumn } from "./Filter";

export default function Table({ columns, data }) {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    state,
    visibleColumns,
    prepareRow,
    setGlobalFilter,
    preGlobalFilteredRows,
  } = useTable(
    {
      columns,
      data,
      defaultColumn: { Filter: DefaultFilterForColumn },
    },
    useFilters,
    useGlobalFilter
  );
  return (
    <table {...getTableProps()}>
      <thead>
        <tr>
          <th
            colSpan={visibleColumns.length}
            style={{
              textAlign: "center",
            }}
          >
            {/* Rendering Global Filter */}
            <GlobalFilter
              preGlobalFilteredRows={preGlobalFilteredRows}
              globalFilter={state.globalFilter}
              setGlobalFilter={setGlobalFilter}
            />
          </th>
        </tr>
        {headerGroups.map((headerGroup) => (
          <tr className="header-group"{...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (
              <th {...column.getHeaderProps()}>
                {column.render("Header")}
                {/* Rendering Default Column Filter */}
                <div>{column.canFilter ? column.render("Filter") : null}</div>
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row, i) => {
          prepareRow(row);
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map((cell) => {
                return <td {...cell.getCellProps()}>{cell.render("Cell")}</td>;
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
