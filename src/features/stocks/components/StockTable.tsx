import {
  Button,
  Flex,
  IconButton,
  Text,
  Badge,
  DropdownMenu,
  AlertDialog,
} from "@radix-ui/themes";
import { Pencil, Trash2, MoreHorizontal } from "lucide-react";
import { createColumnHelper, type ColumnDef } from "@tanstack/react-table";
import { type Stock } from "../../../services/stockService";
import { Datatable } from "../../../components/Datatable";

interface StockTableProps {
  stocks: Stock[];
  onEdit: (stock: Stock) => void;
  onDelete: (id: string | number) => void;
}

export function StockTable({ stocks, onEdit, onDelete }: StockTableProps) {
  const columnHelper = createColumnHelper<Stock>();

  const columns: ColumnDef<Stock, any>[] = [
    columnHelper.accessor("product", {
      header: "Producto",
      cell: (info) => (
        <Flex direction="column">
            <Text weight="bold" size="2">{(info.getValue() as any)?.title || "-"}</Text>
        </Flex>
      ),
    }),
    columnHelper.accessor("branch", {
      header: "Sucursal",
      cell: (info) => (
        <Text size="2">{(info.getValue() as any)?.name || "-"}</Text>
      ),
    }),
    columnHelper.accessor("quantity", {
      header: "Cantidad",
      cell: (info) => {
          const val = Number(info.getValue());
          const color = val > 0 ? 'green' : 'red';
          return <Badge color={color}>{val}</Badge>;
      }
    }),
    
    columnHelper.display({
      id: "actions",
      cell: (info) => {
        const stock = info.row.original;
        const id = (stock as any).documentId || stock.id;
        
        return (
          <DropdownMenu.Root>
            <DropdownMenu.Trigger>
                <IconButton variant="ghost" color="gray">
                    <MoreHorizontal size={16} />
                </IconButton>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content>
                <DropdownMenu.Item onClick={() => onEdit(stock)}>
                    <Pencil size={14} /> Editar
                </DropdownMenu.Item>
                  <AlertDialog.Root>
                    <AlertDialog.Trigger>
                          <DropdownMenu.Item color="red" onSelect={(e) => e.preventDefault()}>
                            <Trash2 size={14} /> Eliminar
                        </DropdownMenu.Item>
                    </AlertDialog.Trigger>
                    <AlertDialog.Content maxWidth="450px">
                        <AlertDialog.Title>Eliminar Stock</AlertDialog.Title>
                        <AlertDialog.Description size="2">
                            ¿Estás seguro? Esta acción no se puede deshacer.
                        </AlertDialog.Description>
                        <Flex gap="3" mt="4" justify="end">
                            <AlertDialog.Cancel>
                                <Button variant="soft" color="gray">Cancelar</Button>
                            </AlertDialog.Cancel>
                            <AlertDialog.Action>
                                <Button variant="solid" color="red" onClick={() => onDelete(id)}>
                                    Eliminar
                                </Button>
                            </AlertDialog.Action>
                        </Flex>
                    </AlertDialog.Content>
                </AlertDialog.Root>
            </DropdownMenu.Content>
          </DropdownMenu.Root>
        );
      }
    })
  ];

  return (
    <Datatable 
      data={stocks} 
      columns={columns} 
      enableSorting 
      enableFiltering 
    />
  );
}
