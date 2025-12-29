import {
  Button,
  Flex,
  IconButton,
  Text,
  Badge,
  DropdownMenu,
  AlertDialog,
  Avatar
} from "@radix-ui/themes";
import { Pencil, Trash2, MoreHorizontal, Package } from "lucide-react";
import { createColumnHelper, type ColumnDef } from "@tanstack/react-table";
import { type Product } from "../../../services/productService";
import { Datatable } from "../../../components/Datatable";

const STRAPI_URL = "http://localhost:1337";

interface ProductTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (id: string | number) => void;
}

export function ProductTable({ products, onEdit, onDelete }: ProductTableProps) {
  const columnHelper = createColumnHelper<Product>();

  const getImageUrl = (product: Product) => {
    const url = (product as any).mainImage?.url;
    if (!url) return null;
    if (url.startsWith('http')) return url;
    return `${STRAPI_URL}${url}`;
  };

  const columns: ColumnDef<Product, any>[] = [
    columnHelper.accessor((row) => (row as any).mainImage, {
      id: "image",
      header: "Imagen",
      cell: (info) => (
        <Avatar 
          src={getImageUrl(info.row.original)} 
          fallback={<Package size={16} />} 
          size="3" 
          radius="medium"
        />
      ),
      enableSorting: false,
    }),
    columnHelper.accessor("title", {
      header: "Producto",
      cell: (info) => (
        <Flex direction="column">
            <Text weight="bold" size="2">{info.getValue()}</Text>
            <Text size="1" color="gray" style={{ maxWidth: 200, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {info.row.original.shortDescription}
            </Text>
        </Flex>
      ),
    }),
    columnHelper.accessor("brand", {
        header: "Marca",
        cell: (info) => (
            <Badge color="blue" variant="soft">
                {(info.getValue() as any)?.name || "-"}
            </Badge>
        )
    }),
    columnHelper.accessor("priceCost", {
      header: "Precio de compra",
      cell: (info) => <Text color="gray">${Number(info.getValue()).toFixed(2)}</Text>
    }),

    columnHelper.accessor("isAvailable", {
      header: "Disponibilidad",
      cell: (info) => info.getValue() ? (
          <Badge color="green">Disponible</Badge>
      ) : (
          <Badge color="gray">No disponible</Badge>
      )
    }),
    columnHelper.display({
      id: "actions",
      cell: (info) => {
        const product = info.row.original;
        return (
          <DropdownMenu.Root>
            <DropdownMenu.Trigger>
                <IconButton variant="ghost" color="gray">
                    <MoreHorizontal size={16} />
                </IconButton>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content>
                <DropdownMenu.Item onClick={() => onEdit(product)}>
                    <Pencil size={14} /> Editar
                </DropdownMenu.Item>
                  <AlertDialog.Root>
                    <AlertDialog.Trigger>
                          <DropdownMenu.Item color="red" onSelect={(e) => e.preventDefault()}>
                            <Trash2 size={14} /> Eliminar
                        </DropdownMenu.Item>
                    </AlertDialog.Trigger>
                    <AlertDialog.Content maxWidth="450px">
                        <AlertDialog.Title>Eliminar Producto</AlertDialog.Title>
                        <AlertDialog.Description size="2">
                            ¿Estás seguro? Esta acción no se puede deshacer.
                        </AlertDialog.Description>
                        <Flex gap="3" mt="4" justify="end">
                            <AlertDialog.Cancel>
                                <Button variant="soft" color="gray">Cancelar</Button>
                            </AlertDialog.Cancel>
                            <AlertDialog.Action>
                                <Button variant="solid" color="red" onClick={() => onDelete((product.documentId || product.id)!)}>
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
      data={products} 
      columns={columns} 
      enableSorting 
      enableFiltering 
    />
  );
}
