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
import { type Branch } from "../../../services/branchService";
import { Datatable } from "../../../components/Datatable";

interface BranchTableProps {
  branches: Branch[];
  onEdit: (branch: Branch) => void;
  onDelete: (id: string | number) => void;
}

export function BranchTable({ branches, onEdit, onDelete }: BranchTableProps) {
  const columnHelper = createColumnHelper<Branch>();

  const columns: ColumnDef<Branch, any>[] = [
    columnHelper.accessor("name", {
      header: "Sucursal",
      cell: (info) => <Text weight="bold" size="2">{info.getValue()}</Text>
    }),
    columnHelper.accessor("type", {
      header: "Tipo",
      cell: (info) => {
        const val = info.getValue() as string;
        const color = val === 'local' ? 'indigo' : 'brown';
        const label = val === 'local' ? 'Local' : 'Depósito';
        return <Badge color={color}>{label}</Badge>;
      }
    }),
    columnHelper.accessor("address", {
      header: "Dirección",
      cell: (info) => <Text size="2" color="gray">{info.getValue()}</Text>
    }),
    columnHelper.display({
      id: "actions",
      cell: (info) => {
        const branch = info.row.original;
        return (
          <DropdownMenu.Root>
            <DropdownMenu.Trigger>
                <IconButton variant="ghost" color="gray">
                    <MoreHorizontal size={16} />
                </IconButton>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content>
                <DropdownMenu.Item onClick={() => onEdit(branch)}>
                    <Pencil size={14} /> Editar
                </DropdownMenu.Item>
                  <AlertDialog.Root>
                    <AlertDialog.Trigger>
                          <DropdownMenu.Item color="red" onSelect={(e) => e.preventDefault()}>
                            <Trash2 size={14} /> Eliminar
                        </DropdownMenu.Item>
                    </AlertDialog.Trigger>
                    <AlertDialog.Content maxWidth="450px">
                        <AlertDialog.Title>Eliminar Sucursal</AlertDialog.Title>
                        <AlertDialog.Description size="2">
                            ¿Estás seguro? Esta acción no se puede deshacer.
                        </AlertDialog.Description>
                        <Flex gap="3" mt="4" justify="end">
                            <AlertDialog.Cancel>
                                <Button variant="soft" color="gray">Cancelar</Button>
                            </AlertDialog.Cancel>
                            <AlertDialog.Action>
                                <Button variant="solid" color="red" onClick={() => onDelete(branch.documentId || branch.id)}>
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
      data={branches} 
      columns={columns} 
      enableSorting 
      enableFiltering 
    />
  );
}
