import { 
    Button, 
    Flex, 
    Text, 
    TextField, 
    Select, 
    Box, 
    IconButton,
    Table,
    ScrollArea
} from "@radix-ui/themes";

import { Plus, Trash } from "lucide-react";
import { useBranchService } from "../../../services/branchService";
import { useProductService } from "../../../services/productService";


export interface FormItem {
    productId: string;
    quantity: number;
}

// Internal reusable components

const DateField = ({ value, onChange, disabled }: { value: string, onChange: (val: string) => void, disabled?: boolean }) => (
    <Box>
        <Text as="div" size="2" mb="1" weight="bold">Fecha</Text>
        {disabled ? (
            <Text size="2">{value}</Text> // Or nicely formatted date
        ) : (
            <TextField.Root 
                type="date" 
                value={value} 
                onChange={e => onChange(e.target.value)}
            />
        )}
    </Box>
);

const TypeField = ({ value, onChange, disabled }: { value: string, onChange: (val: string) => void, disabled?: boolean }) => {
    const typeLabel: Record<string, string> = {
        buy: "Compra",
        delivery_to_branch: "Envío a Sucursal",
        inventory_adjustment: "Ajuste",
        decrease: "Baja/Merma"
    };

    return (
        <Box>
            <Text as="div" size="2" mb="1" weight="bold">Tipo</Text>
            {disabled ? (
                <Text size="2">{typeLabel[value] || value}</Text>
            ) : (
                <Select.Root value={value} onValueChange={onChange}>
                    <Select.Trigger style={{ width: '100%' }} />
                    <Select.Content>
                        <Select.Item value="buy">Compra</Select.Item>
                        <Select.Item value="delivery_to_branch">Envío a Sucursal</Select.Item>
                        <Select.Item value="inventory_adjustment">Ajuste</Select.Item>
                        <Select.Item value="decrease">Baja/Merma</Select.Item>
                    </Select.Content>
                </Select.Root>
            )}
        </Box>
    );
};

const BranchField = ({ 
    label, 
    value, 
    onChange, 
    disabled, 
    branches 
}: { 
    label: string, 
    value: string, 
    onChange: (val: string) => void, 
    disabled?: boolean,
    branches?: any[]
}) => {
    // If branches are not provided, we could fetch them here, strict dependency injection is also fine.
    // However, to keep it simple and avoid multiple fetches if multiple fields exist,
    // we assume branches are passed, OR we fetch if not.
    // For the dictionary pattern, self-contained is nice, but passing data is more performant.
    // Let's assume we pass data for now, but I'll add a hook call if I can.
    // Actually, hooks rules apply. We can use the hook inside.
    
    let branchOptions = branches;
    if (!branchOptions) {
        const { useList } = useBranchService();
        const { data } = useList({ pagination: { pageSize: 100 } });
        branchOptions = data?.data || [];
    }

    const selectedBranch = branchOptions?.find((b: any) => (b.documentId === value || String(b.id) === value));

    return (
        <Box>
            <Text as="div" size="2" mb="1" weight="bold">{label}</Text>
            {disabled ? (
                <Text size="2">{selectedBranch?.name || "Seleccionar..."}</Text>
            ) : (
                <Select.Root value={value} onValueChange={onChange}>
                    <Select.Trigger style={{ width: '100%' }} placeholder={`Seleccionar ${label.toLowerCase()}`} />
                    <Select.Content>
                        {branchOptions?.map((b: any) => (
                            <Select.Item key={b.documentId || b.id} value={b.documentId || String(b.id)}>
                                {b.name}
                            </Select.Item>
                        ))}
                    </Select.Content>
                </Select.Root>
            )}
        </Box>
    );
};

const StateField = ({ value, onChange, disabled, isConfirmed }: { value: string, onChange: (val: string) => void, disabled?: boolean, isConfirmed?: boolean }) => {
    
    // State is slightly different: disabled usually means "can't change", which is true for confirmed state or if parent says so.
    // However, user specifically asked for "Cuando el movimiento esta creado", which implies "isEditing".
    // But State is the ONLY thing editable in Edit mode (unless confirmed).
    // So if disabled is true here, it means it's confirmed (or we lack permission).
    // If it's NOT disabled, we show the Select.
    // Wait, in `MovementForm.tsx`, `MovementFields.State` effectively receives `disabled={isConfirmed}`.
    // So if isConfirmed is true, we show Text. If false, we show Select.
    // This matches the requirement perfectly.
    
    const stateLabels: Record<string, string> = {
        requested: "Solicitado",
        confirmed: "Confirmado"
    };

    return (
        <Box>
            <Text as="div" size="2" mb="1" weight="bold">Estado</Text>
            {disabled ? (
                 <Box>
                    <Text size="2">{stateLabels[value] || value}</Text>
                    {isConfirmed && <Text as="div" size="1" color="red" mt="1">Este movimiento ya está confirmado y no se puede editar.</Text>}
                 </Box>
            ) : (
                <Select.Root value={value} onValueChange={onChange}>
                    <Select.Trigger style={{ width: '100%' }} />
                    <Select.Content>
                        <Select.Item value="requested">Solicitado</Select.Item>
                        <Select.Item value="confirmed">Confirmado</Select.Item>
                    </Select.Content>
                </Select.Root>
            )}
        </Box>
    );
};

const ItemsField = ({ 
    items, 
    onChange, 
    disabled 
}: { 
    items: FormItem[], 
    onChange: (items: FormItem[]) => void, 
    disabled?: boolean 
}) => {
    const { useList } = useProductService();
    const { data } = useList({ pagination: { pageSize: 100 } });
    const products = data?.data || [];

    const addItem = () => {
        onChange([...items, { productId: "", quantity: 1 }]);
    };

    const removeItem = (index: number) => {
        onChange(items.filter((_, i) => i !== index));
    };

    const updateItem = (index: number, field: keyof FormItem, value: any) => {
        const newItems = [...items];
        newItems[index] = { ...newItems[index], [field]: value };
        onChange(newItems);
    };

    if (disabled) {
        return (
            <Box>
                <Text size="4" weight="bold" mb="2">Items ({items.length})</Text>
                <ScrollArea type="always" scrollbars="vertical" style={{ maxHeight: 250 }}>
                    <Table.Root variant="surface">
                        <Table.Header>
                            <Table.Row>
                                <Table.ColumnHeaderCell>Producto</Table.ColumnHeaderCell>
                                <Table.ColumnHeaderCell align="right">Cantidad</Table.ColumnHeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {items.map((item, index) => {
                                 const product = products.find((p: any) => (p.documentId === item.productId || String(p.id) === item.productId));
                                 return (
                                    <Table.Row key={index}>
                                        <Table.Cell>{product?.title || "Producto desconocido"}</Table.Cell>
                                        <Table.Cell align="right">{item.quantity}</Table.Cell>
                                    </Table.Row>
                                 );
                            })}
                        </Table.Body>
                    </Table.Root>
                    {items.length === 0 && <Text color="gray" size="2" align="center" as="p" my="2">No hay items.</Text>}
                </ScrollArea>
            </Box>
        );
    }

    return (
        <Box>
             <Flex justify="between" align="center" mb="2">
                <Text size="4" weight="bold">Items</Text>
                <Button variant="soft" onClick={addItem}>
                    <Plus size={16} /> Agregar Item
                </Button>
            </Flex>

            <ScrollArea type="always" scrollbars="vertical" style={{ maxHeight: 250, paddingRight: 10 }}>
                <Flex direction="column" gap="3">
                    {items.map((item, index) => (
                        <Flex key={index} gap="3" align="end">
                            <Box flexGrow="1">
                                <Text as="div" size="2" mb="1">Producto</Text>
                                <Select.Root 
                                    value={item.productId} 
                                    onValueChange={(val) => updateItem(index, 'productId', val)}
                                >
                                    <Select.Trigger style={{ width: '100%' }} placeholder="Producto" />
                                    <Select.Content>
                                        {products?.map((p: any) => (
                                            <Select.Item key={p.documentId || p.id} value={p.documentId || String(p.id)}>
                                                {p.title}
                                            </Select.Item>
                                        ))}
                                    </Select.Content>

                                </Select.Root>
                            </Box>
                            <Box width="100px">
                                <Text as="div" size="2" mb="1">Cantidad</Text>
                                <TextField.Root 
                                    type="number" 
                                    min="1"
                                    value={item.quantity}
                                    onChange={e => updateItem(index, 'quantity', Number(e.target.value))}
                                />
                            </Box>
                            <IconButton color="red" variant="soft" onClick={() => removeItem(index)}>
                                <Trash size={16} />
                            </IconButton>
                        </Flex>
                    ))}
                    {items.length === 0 && (
                        <Text color="gray" align="center" size="2">No hay items agregados</Text>
                    )}
                </Flex>
            </ScrollArea>
        </Box>
    );
}

// The Dictionary
export const MovementFields = {
    Date: DateField,
    Type: TypeField,
    Branch: BranchField,
    State: StateField,
    Items: ItemsField
};
