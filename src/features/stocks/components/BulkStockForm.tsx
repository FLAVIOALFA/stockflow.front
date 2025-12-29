import {
  Box,
  Button,
  Flex,
  Text,
  TextField,
  Spinner,
  Select,
  Grid,
  IconButton,
  ScrollArea,
} from "@radix-ui/themes";
import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { useProductService } from "../../../services/productService";
import { useBranchService } from "../../../services/branchService";

interface BulkStockFormProps {
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  isSubmitting: boolean;
}

export function BulkStockForm({ onClose, onSubmit, isSubmitting }: BulkStockFormProps) {
  const { useList: useProductList } = useProductService();
  const { useList: useBranchList } = useBranchService();

  const { data: productsRes, isLoading: isLoadingProducts } = useProductList();
  const { data: branchesRes, isLoading: isLoadingBranches } = useBranchList();

  const products = productsRes?.data || [];
  const branches = branchesRes?.data || [];

  const [branchId, setBranchId] = useState("");
  const [items, setItems] = useState<{ productId: string; quantity: string }[]>([
    { productId: "", quantity: "1" }
  ]);

  const handleAddItem = () => {
    setItems([...items, { productId: "", quantity: "1" }]);
  };

  const handleRemoveItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
  };

  const handleItemChange = (index: number, field: 'productId' | 'quantity', value: string) => {
    console.log({ index, field, value });
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!branchId) {
      alert("Debes seleccionar una sucursal.");
      return;
    }

    // Filter out incomplete rows
    const validItems = items.filter(item => item.productId && item.quantity);
    if (validItems.length === 0) {
      alert("Debes agregar al menos un producto con cantidad.");
      return;
    }

    // Prepare payload
    const payload = {
      branchId: branchId,
      products: validItems.map(item => ({
        productId: item.productId,
        quantity: parseInt(item.quantity, 10)
      }))
    };

    try {
      await onSubmit(payload);
    } catch (error) {
       console.error(error);
       alert("Error creating stock");
    }
  };

  if (isLoadingProducts || isLoadingBranches) {
      return <Flex justify="center" p="4"><Spinner /></Flex>;
  }


  return (
    <form onSubmit={handleSubmit}>
      <Flex direction="column" gap="4">
        
        <Box>
            <Text size="2" weight="bold" mb="1">Sucursal *</Text>
            <Select.Root 
                value={branchId} 
                onValueChange={setBranchId}
            >
                <Select.Trigger placeholder="Selecciona una sucursal..." style={{ width: '100%' }} />
                <Select.Content>
                    {branches.map((b: any) => (
                        <Select.Item key={b.id} value={String(b.documentId || b.id)}>
                            {b.name}
                        </Select.Item>
                    ))}
                </Select.Content>
            </Select.Root>
        </Box>

        <Box>
            <Flex justify="between" align="center" mb="2">
                <Text size="2" weight="bold">Productos</Text>
                <Button type="button" size="1" variant="soft" onClick={handleAddItem}>
                    <Plus size={14} /> Agregar Producto
                </Button>
            </Flex>
            
            <ScrollArea type="always" scrollbars="vertical" style={{ maxHeight: 300, paddingRight: 15 }}>
                <Flex direction="column" gap="3">
                    {items.map((item, index) => (
                        <Grid columns="4" gap="2" key={index} align="end">
                             <Box style={{ gridColumn: "span 2" }}>
                                <Text size="1" mb="1" color="gray">Producto</Text>
                                <Select.Root 
                                    value={item.productId} 
                                    onValueChange={(val) => handleItemChange(index, 'productId', val)}
                                >
                                    <Select.Trigger placeholder="Producto..." style={{ width: '100%' }} />
                                    <Select.Content>
                                        {products.map((p: any) => (
                                            <Select.Item key={p.id} value={p.documentId} disabled={items.some((i, idx) => idx !== index && i.productId === p.documentId)}>
                                                {p.title}
                                            </Select.Item>
                                        ))}
                                    </Select.Content>
                                </Select.Root>
                             </Box>
                             <Box>
                                <Text size="1" mb="1" color="gray">Cantidad</Text>
                                <TextField.Root 
                                    type="number" 
                                    value={item.quantity}
                                    onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                                    min="1"
                                />
                             </Box>
                             <Box>
                                 <IconButton 
                                    type="button" 
                                    color="red" 
                                    variant="ghost" 
                                    onClick={() => handleRemoveItem(index)}
                                    disabled={items.length === 1}
                                 >
                                     <Trash2 size={16} />
                                 </IconButton>
                             </Box>
                        </Grid>
                    ))}
                </Flex>
            </ScrollArea>
        </Box>

        <Flex gap="3" mt="4" justify="end">
          <Button variant="soft" color="gray" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? <Spinner /> : "Cargar Stock"}
          </Button>
        </Flex>
      </Flex>
    </form>
  );
}
