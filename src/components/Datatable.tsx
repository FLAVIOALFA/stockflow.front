import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table";
import { Table, TextField, Flex, Box, IconButton } from "@radix-ui/themes";
import { Search, ArrowUpDown, ChevronUp, ChevronDown } from "lucide-react";
import { useState } from "react";

interface DatatableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  enableSorting?: boolean;
  enableFiltering?: boolean;
  onRowClick?: (row: TData) => void;
  onCellClick?: (cellValue: unknown, row: TData, columnId: string) => void;
}

export function Datatable<TData, TValue>({
  columns,
  data,
  enableSorting = false,
  enableFiltering = false,
  onRowClick,
  onCellClick,
}: DatatableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      globalFilter,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: enableSorting ? getSortedRowModel() : undefined,
    getFilteredRowModel: enableFiltering ? getFilteredRowModel() : undefined,
  });

  return (
    <Flex direction="column" gap="3" p="1">
      {enableFiltering && (
        <Box style={{ width: '100%', maxWidth: 300 }}>
          <TextField.Root 
            placeholder="Buscar..." 
            value={globalFilter ?? ""} 
            onChange={(e) => setGlobalFilter(e.target.value)}
          >
            <TextField.Slot>
              <Search size={16} />
            </TextField.Slot>
          </TextField.Root>
        </Box>
      )}

      <Box style={{ overflow: "auto" }}>
        <Table.Root variant="surface">
          <Table.Header>
            {table.getHeaderGroups().map((headerGroup) => (
              <Table.Row key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const isSortable = enableSorting && header.column.getCanSort();
                  return (
                    <Table.ColumnHeaderCell 
                      key={header.id}
                      style={{ cursor: isSortable ? 'pointer' : 'default', whiteSpace: 'nowrap' }}
                      onClick={isSortable ? header.column.getToggleSortingHandler() : undefined}
                    >
                      <Flex align="center" gap="2">
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {isSortable && (
                          <Box>
                            {{
                              asc: <ChevronUp size={14} />,
                              desc: <ChevronDown size={14} />,
                            }[header.column.getIsSorted() as string] ?? <ArrowUpDown size={14} style={{ opacity: 0.3 }} />}
                          </Box>
                        )}
                      </Flex>
                    </Table.ColumnHeaderCell>
                  );
                })}
              </Table.Row>
            ))}
          </Table.Header>
          <Table.Body>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <Table.Row 
                  key={row.id} 
                  style={{ cursor: onRowClick ? 'pointer' : 'default' }}
                  onClick={() => onRowClick?.(row.original)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <Table.Cell 
                      key={cell.id}
                      onClick={(e) => {
                        if (onCellClick) {
                          e.stopPropagation();
                          onCellClick(cell.getValue(), row.original, cell.column.id);
                        }
                      }}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </Table.Cell>
                  ))}
                </Table.Row>
              ))
            ) : (
              <Table.Row>
                <Table.Cell colSpan={columns.length} style={{ textAlign: "center", color: "var(--gray-10)" }}>
                  No results found.
                </Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table.Root>
      </Box>
    </Flex>
  );
}
