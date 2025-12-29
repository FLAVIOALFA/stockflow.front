import { Grid } from "@radix-ui/themes";
import { MovementFields } from "../MovementFormFields";
import type { FormItem } from "../MovementFormFields";

interface DecreaseFormProps {
    date: string;
    setDate: (val: string) => void;
    originId: string; // The branch where items are removed
    setOriginId: (val: string) => void;
    items: FormItem[];
    setItems: (items: FormItem[]) => void;
    disabled?: boolean;
}

export function DecreaseForm({ 
    date, 
    setDate, 
    originId, 
    setOriginId, 
    items, 
    setItems, 
    disabled 
}: DecreaseFormProps) {
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
