import { React, useMemo, useState } from "react";
import { useAsyncDebounce } from "react-table";
import { Label } from "reactstrap";
import Input from "@mui/material/Input";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";

// Component for Global Filter
export function GlobalFilter({ globalFilter, setGlobalFilter }) {
  const [value, setValue] = useState(globalFilter);

  const onChange = useAsyncDebounce((value) => {
    setGlobalFilter(value || undefined);
  }, 200);

  return (
    <div className="search-field">
      <Label>Pesquisar na tabela: </Label>
      <Input
        value={value || ""}
        onChange={(e) => {
          setValue(e.target.value);
          onChange(e.target.value);
        }}
        placeholder="Pesquisar"
        className="w-25"
        style={{
          fontSize: "1.1rem",
          margin: "15px",
          display: "inline",
        }}
      />
    </div>
  );
}

// Component for Default Column Filter
export function DefaultFilterForColumn({
  column: {
    filterValue,
    preFilteredRows: { length },
    setFilter,
  },
}) {
  return (
    <Input
      value={filterValue || ""}
      onChange={(e) => {
        // Set undefined to remove the filter entirely
        setFilter(e.target.value || undefined);
      }}
      placeholder={`Procurar`}
      style={{ marginTop: "10px" }}
    />
  );
}

// Component for Custom Select Filter
export function SelectColumnFilter({
  column: { filterValue, setFilter, preFilteredRows, id },
}) {
  // Use preFilteredRows to calculate the options
  const options = useMemo(() => {
    const options = new Set();
    preFilteredRows.forEach((row) => {
      options.add(row.values[id]);
    });
    return [...options.values()];
  }, [id, preFilteredRows]);

  // UI for Multi-Select box
  return (
    <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
      <Select
        className="select-options"
        value={filterValue}
        onChange={(e) => {
          setFilter(e.target.value || undefined);
        }}
        label="Search"
      >
        <MenuItem value="">All</MenuItem>
        {options.map((option, i) => (
          <MenuItem key={i} value={option}>
            {option}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
