import { Grid } from "@radix-ui/themes";
import { MovementFields } from "../MovementFormFields";
import type { FormItem } from "../MovementFormFields";

interface TransferFormProps {
    date: string;
    setDate: (val: string) => void;
    originId: string;
    setOriginId: (val: string) => void;
    destinationId: string;
    setDestinationId: (val: string) => void;
    items: FormItem[];
    setItems: (items: FormItem[]) => void;
    disabled?: boolean;
}

export function TransferForm({ 
    date, 
    setDate, 
    originId, 
    setOriginId, 
    destinationId, 
    setDestinationId, 
    items, 
    setItems, 
    disabled 
}: TransferFormProps) {
    return (
        <Grid columns="1" gap="4">
            <MovementFields.Date value={date} onChange={setDate} disabled={disabled} />
            <MovementFields.Branch 
                label="Sucursal Origen" 
                value={originId} 
                onChange={setOriginId} 
                disabled={disabled} 
            />
            <MovementFields.Branch 
                label="Sucursal Destino" 
                value={destinationId} 
                onChange={setDestinationId} 
                disabled={disabled} 
            />
            <MovementFields.Items items={items} onChange={setItems} disabled={disabled} />
        </Grid>
    );
}
