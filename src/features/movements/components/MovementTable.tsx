import {
  IconButton,
  Badge,
  Text,
} from "@radix-ui/themes";
import { Pencil } from "lucide-react";
import { createColumnHelper, type ColumnDef } from "@tanstack/react-table";
import { type Movement } from "../../../services/movementService";
import { Datatable } from "../../../components/Datatable";


interface MovementTableProps {
  movements: Movement[];
  onEdit: (movement: Movement) => void;
}

export function MovementTable({ movements, onEdit }: MovementTableProps) {
  const columnHelper = createColumnHelper<Movement>();

  const columns: ColumnDef<Movement, any>[] = [
    columnHelper.accessor("date", {
      header: "Fecha",
      cell: (info) => info.getValue() ? new Date(info.getValue()).toLocaleDateString() : "-"
    }),

    columnHelper.accessor("origin", {
      header: "Origen",
      cell: (info) => (info.getValue() as any)?.name || <Text size="1" color="gray">Sin origen</Text>
    }),
    columnHelper.accessor("destination", {
      header: "Destino",
      cell: (info) => (info.getValue() as any)?.name || <Text size="1" color="gray">Sin destino</Text>
    }),
    columnHelper.accessor("type", {
      header: "Tipo",
      cell: (info) => {
        const type = info.getValue();
        const labels: Record<string, string> = {
          buy: "Compra",
          delivery_to_branch: "Envío a Sucursal",
          inventory_adjustment: "Ajuste",
          decrease: "Baja/Merma"
        };
        return <Badge variant="soft" color="blue">{labels[type] || type}</Badge>;
      }
    }),
    columnHelper.accessor("state", {
      header: "Estado",
      cell: (info) => {
        const state = info.getValue();
        return (
          <Badge color={state === "confirmed" ? "green" : "orange"}>
            {state === "confirmed" ? "Confirmado" : "Solicitado"}
          </Badge>
        );
      }
    }),
    columnHelper.display({
      id: "actions",
      cell: (info) => {
        const movement = info.row.original;
        
        // Disable edit if confirmed
        if (movement.state === "confirmed") {
            return <Text size="1" color="gray">Cerrado</Text>;
        }

        return (
            <IconButton variant="ghost" color="gray" onClick={() => onEdit(movement)}>
                <Pencil size={16} />
            </IconButton>
        );
      }
    })
  ];

  return (
    <Datatable 
      data={movements} 
      columns={columns} 
      enableSorting 
      enableFiltering 
    />
  );
}
