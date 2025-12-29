import { useState, useEffect } from "react";
import { 
    Button, 
    Flex, 
    Separator
} from "@radix-ui/themes";
import { MovementFields } from "./MovementFormFields";
import type { FormItem } from "./MovementFormFields";

import { BuyForm } from "./forms/BuyForm";
import { TransferForm } from "./forms/TransferForm";
import { AdjustmentForm } from "./forms/AdjustmentForm";
import { DecreaseForm } from "./forms/DecreaseForm";
import type { Movement } from "../../../services/movementService";

interface MovementFormProps {
    movement?: Movement;
    onSave: (data: any) => Promise<void>;
    onCancel: () => void;
}

export function MovementForm({ movement, onSave, onCancel }: MovementFormProps) {
    const isEditing = !!movement;
    
    // Form State
    const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
    const [originId, setOriginId] = useState<string>("");
    const [destinationId, setDestinationId] = useState<string>("");
    const [type, setType] = useState<string>("buy");
    const [state, setState] = useState<string>("requested");
    const [items, setItems] = useState<FormItem[]>([]);

    useEffect(() => {
        if (movement) {
            setDate(movement.date || new Date().toISOString().split('T')[0]);
            setOriginId(movement.origin?.documentId || String(movement.origin?.id || ""));
            setDestinationId(movement.destination?.documentId || String(movement.destination?.id || ""));
            setType(movement.type || "buy");
            setState(movement.state || "requested");
            
            if (movement.items && Array.isArray(movement.items)) {
                setItems(movement.items.map((item: any) => ({
                    productId: item.product?.documentId || String(item.product?.id),
                    quantity: item.quantityTotalItems || 0
                })));
            }
        }
    }, [movement]);

    const handleSubmit = async () => {
        if (isEditing) {
            // Only state is updatable when editing existing movements
           await onSave({ state });
           return;
        }

        const mappedItems = items.map(item => ({
            product: item.productId,
            quantity: item.quantity
        }));

        const commonPayload = { 
            date, 
            type, 
            state: "requested",
            items: mappedItems 
        };

        let specificPayload = {};
        
        // Construct payload based on type to ensure cleaner data
        if (type === 'buy') {
            specificPayload = { destination: destinationId };
        } else if (type === 'delivery_to_branch') {
            specificPayload = { origin: originId, destination: destinationId };
        } else if (type === 'inventory_adjustment' || type === 'decrease') {
            specificPayload = { origin: originId };
        }

        await onSave({ ...commonPayload, ...specificPayload });
    };

    const isConfirmed = movement?.state === 'confirmed';

    const renderForm = () => {
        const commonProps = {
            date,
            setDate,
            items,
            setItems,
            disabled: isEditing
        };

        switch (type) {
            case 'buy':
                return (
                    <BuyForm 
                        {...commonProps}
                        destinationId={destinationId}
                        setDestinationId={setDestinationId}
                    />
                );
            case 'delivery_to_branch':
                return (
                    <TransferForm 
                        {...commonProps}
                        originId={originId}
                        setOriginId={setOriginId}
                        destinationId={destinationId}
                        setDestinationId={setDestinationId}
                    />
                );
            case 'inventory_adjustment':
                return (
                    <AdjustmentForm 
                        {...commonProps}
                        originId={originId}
                        setOriginId={setOriginId}
                    />
                );
            case 'decrease':
                return (
                    <DecreaseForm 
                        {...commonProps}
                        originId={originId}
                        setOriginId={setOriginId}
                    />
                );
            default:
                return (
                    <BuyForm 
                        {...commonProps}
                        destinationId={destinationId}
                        setDestinationId={setDestinationId}
                    />
                );
        }
    };

    return (
        <Flex direction="column" gap="4">
            <MovementFields.Type value={type} onChange={setType} disabled={isEditing} />
            
            <Separator size="4" />
            
            {renderForm()}

            {isEditing && (
                <>
                    <Separator size="4" />
                    <MovementFields.State 
                        value={state} 
                        onChange={setState} 
                        disabled={isConfirmed} 
                        isConfirmed={isConfirmed} 
                    />
                </>
            )}

            <Flex justify="end" gap="3" mt="4">
                <Button variant="soft" color="gray" onClick={onCancel}>Cancelar</Button>
                <Button onClick={handleSubmit} disabled={isEditing && isConfirmed}>
                    {isEditing ? "Actualizar Estado" : "Crear Movimiento"}
                </Button>
            </Flex>
        </Flex>
    );
}
