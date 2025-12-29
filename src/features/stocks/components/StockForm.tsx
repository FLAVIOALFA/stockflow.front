import {
  Box,
  Button,
  Flex,
  Text,
  TextField,
  Spinner,
  Select,
} from "@radix-ui/themes";
import { useState, useEffect } from "react";
import { type Stock } from "../../../services/stockService";
import { useProductService } from "../../../services/productService";
import { useBranchService } from "../../../services/branchService";

interface StockFormProps {
  initialData: Stock | null;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  isSubmitting: boolean;
}

export function StockForm({ initialData, onClose, onSubmit, isSubmitting }: StockFormProps) {
  const { useList: useProductList } = useProductService();
  const { useList: useBranchList } = useBranchService();

  const { data: productsRes, isLoading: isLoadingProducts } = useProductList();
  const { data: branchesRes, isLoading: isLoadingBranches } = useBranchList();

  const products = productsRes?.data || [];
  const branches = branchesRes?.data || [];

  const [formData, setFormData] = useState(() => {
    if (initialData) {
      const prodId = (initialData.product as any)?.id;
      const branchId = (initialData.branch as any)?.id;
      return {
        quantity: String(initialData.quantity),
        product: prodId ? String(prodId) : "",
        branch: branchId ? String(branchId) : "",
      };
    }
    return {
      quantity: "0",
      product: "",
      branch: "",
    };
  });

  useEffect(() => {
    if (initialData) {
      const prodId = (initialData.product as any)?.id;
      const branchId = (initialData.branch as any)?.id;
      
      setFormData({
        quantity: String(initialData.quantity),
        product: prodId ? String(prodId) : "",
        branch: branchId ? String(branchId) : "",
      });
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.product || !formData.branch) {
      alert("Producto y Sucursal son obligatorios.");
      return;
    }

    try {
      const payload = {
        quantity: parseInt(formData.quantity, 10),
        product: Number(formData.product), // Sending ID as number usually works, or documentId if Strapi 5
        branch: Number(formData.branch),
      };

      await onSubmit(payload);
    } catch (error) {
       console.error(error);
       alert("Error saving stock");
    }
  };

  if (isLoadingProducts || isLoadingBranches) {
      return <Flex justify="center" p="4"><Spinner /></Flex>;
  }

  return (
    <form onSubmit={handleSubmit}>
      <Flex direction="column" gap="3">
        
        <Box>
            <Text size="2" weight="bold" mb="1">Producto *</Text>
            <Select.Root 
                value={formData.product} 
                onValueChange={(val) => setFormData({...formData, product: val})}
                disabled={!!initialData} // If editing, maybe we shouldn't change product/branch? Usually stocks are adjusted, not moved. But let's leave it enabled if needed, or disabled if that's business logic. I'll leave it enabled but maybe user wants to safeguard.
            >
                <Select.Trigger placeholder="Selecciona un producto..." style={{ width: '100%' }} />
                <Select.Content>
                    {products.map((p: any) => (
                        <Select.Item key={p.id} value={String(p.id)}>
                            {p.title}
                        </Select.Item>
                    ))}
                </Select.Content>
            </Select.Root>
        </Box>

        <Box>
            <Text size="2" weight="bold" mb="1">Sucursal *</Text>
            <Select.Root 
                value={formData.branch} 
                onValueChange={(val) => setFormData({...formData, branch: val})}
                disabled={!!initialData}
            >
                <Select.Trigger placeholder="Selecciona una sucursal..." style={{ width: '100%' }} />
                <Select.Content>
                    {branches.map((b: any) => (
                        <Select.Item key={b.id} value={String(b.id)}>
                            {b.name}
                        </Select.Item>
                    ))}
                </Select.Content>
            </Select.Root>
        </Box>

        <Box>
            <Text size="2" weight="bold">Cantidad</Text>
            <TextField.Root 
                type="number" 
                value={formData.quantity}
                onChange={e => setFormData({...formData, quantity: e.target.value})}
                required
            />
        </Box>

        <Flex gap="3" mt="4" justify="end">
          <Button variant="soft" color="gray" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? <Spinner /> : "Save"}
          </Button>
        </Flex>
      </Flex>
    </form>
  );
}
