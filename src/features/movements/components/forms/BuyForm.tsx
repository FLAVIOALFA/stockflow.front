import { Grid } from "@radix-ui/themes";
import { MovementFields } from "../MovementFormFields";
import type { FormItem } from "../MovementFormFields";

interface BuyFormProps {
    date: string;
    setDate: (val: string) => void;
    destinationId: string;
    setDestinationId: (val: string) => void;
    items: FormItem[];
    setItems: (items: FormItem[]) => void;
    disabled?: boolean;
}

export function BuyForm({ date, setDate, destinationId, setDestinationId, items, setItems, disabled }: BuyFormProps) {
    return (
        <Grid columns="1" gap="4">
            <MovementFields.Date value={date} onChange={setDate} disabled={disabled} />
            <MovementFields.Branch 
                label="Sucursal" 
                value={destinationId} 
                onChange={setDestinationId} 
                disabled={disabled} 
            />
            <MovementFields.Items items={items} onChange={setItems} disabled={disabled} />
        </Grid>
    );
}
