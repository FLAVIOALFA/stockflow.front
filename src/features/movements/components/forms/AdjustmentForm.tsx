import { Grid } from "@radix-ui/themes";
import { MovementFields } from "../MovementFormFields";
import type { FormItem } from "../MovementFormFields";

interface AdjustmentFormProps {
    date: string;
    setDate: (val: string) => void;
    originId: string; // The branch being adjusted
    setOriginId: (val: string) => void;
    items: FormItem[];
    setItems: (items: FormItem[]) => void;
    disabled?: boolean;
}

export function AdjustmentForm({ 
    date, 
    setDate, 
    originId, 
    setOriginId, 
    items, 
    setItems, 
    disabled 
}: AdjustmentFormProps) {
    return (
        <Grid columns="1" gap="4">
            <MovementFields.Date value={date} onChange={setDate} disabled={disabled} />
            <MovementFields.Branch 
                label="Sucursal" 
                value={originId} 
                onChange={setOriginId} 
                disabled={disabled} 
            />
            <MovementFields.Items items={items} onChange={setItems} disabled={disabled} />
        </Grid>
    );
}
