import {
  Button,
  Flex,
  IconButton,
  Text,
  DropdownMenu,
  AlertDialog,
  Badge,
} from "@radix-ui/themes";
import { Pencil, Trash2, MoreHorizontal } from "lucide-react";
import { createColumnHelper, type ColumnDef } from "@tanstack/react-table";
import { type Brand } from "../../../services/brandService";
import { Datatable } from "../../../components/Datatable";

interface BrandTableProps {
  brands: Brand[];
  onEdit: (brand: Brand) => void;
  onDelete: (id: string | number) => void;
}

export function BrandTable({ brands, onEdit, onDelete }: BrandTableProps) {
  const columnHelper = createColumnHelper<Brand>();

  const columns: ColumnDef<Brand, any>[] = [
    columnHelper.accessor("name", {
      header: "Marca",
      cell: (info) => <Text weight="bold" size="2">{info.getValue()}</Text>
    }),
    columnHelper.accessor("slug", {
      header: "Slug",
      cell: (info) => <Badge color="gray">{info.getValue()}</Badge>
    }),
    columnHelper.display({
      id: "actions",
      cell: (info) => {
        const brand = info.row.original;
        return (
          <DropdownMenu.Root>
            <DropdownMenu.Trigger>
                <IconButton variant="ghost" color="gray">
                    <MoreHorizontal size={16} />
                </IconButton>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content>
                <DropdownMenu.Item onClick={() => onEdit(brand)}>
                    <Pencil size={14} /> Editar
                </DropdownMenu.Item>
                  <AlertDialog.Root>
                    <AlertDialog.Trigger>
                          <DropdownMenu.Item color="red" onSelect={(e) => e.preventDefault()}>
                            <Trash2 size={14} /> Eliminar
                        </DropdownMenu.Item>
                    </AlertDialog.Trigger>
                    <AlertDialog.Content maxWidth="450px">
                        <AlertDialog.Title>Eliminar Marca</AlertDialog.Title>
                        <AlertDialog.Description size="2">
                            ¿Estás seguro? Esta acción no se puede deshacer.
                        </AlertDialog.Description>
                        <Flex gap="3" mt="4" justify="end">
                            <AlertDialog.Cancel>
                                <Button variant="soft" color="gray">Cancelar</Button>
                            </AlertDialog.Cancel>
                            <AlertDialog.Action>
                                <Button variant="solid" color="red" onClick={() => onDelete(brand.documentId || brand.id)}>
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
      data={brands} 
      columns={columns} 
      enableSorting 
      enableFiltering 
    />
  );
}
