import {
  Box,
  Button,
  Dialog,
  Flex,
  Heading,
  Spinner,
  Text,
} from "@radix-ui/themes";
import { Plus } from "lucide-react";
import { useState } from "react";
import { type Stock, useStockService, useBulkCreateStocks } from "../../services/stockService";
import { StockTable } from "./components/StockTable";
import { StockForm } from "./components/StockForm";
import { BulkStockForm } from "./components/BulkStockForm";

export function Stocks() {
  const { useList, useUpdate, useDelete } = useStockService();
  
  const { data: response, isLoading, error } = useList({ populate: ['branch', 'product'] });
  const stocks = response?.data || [];
  
  const bulkCreateMutation = useBulkCreateStocks();
  const updateMutation = useUpdate();
  const deleteMutation = useDelete();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingStock, setEditingStock] = useState<Stock | null>(null);

  const handleOpenCreate = () => {
    setEditingStock(null);
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (stock: Stock) => {
    setEditingStock(stock);
    setIsDialogOpen(true);
  };

  const handleSubmit = async (payload: any) => {
    try {
        if (editingStock) {
            const id = (editingStock as any).documentId || editingStock.id;
            await updateMutation.mutateAsync({ id, ...payload });
        } else {
            // Bulk Create
            await bulkCreateMutation.mutateAsync(payload);
        }
        setIsDialogOpen(false);
    } catch (err) {
      console.error("Failed to save stock:", err);
      // window.alert("Failed to save stock."); // Better handled in form or handled cleanly 
    }
  };

  const handleDelete = async (id: string | number) => {
    try {
      await deleteMutation.mutateAsync(id);
    } catch (err) {
      console.error("Failed to delete stock:", err);
    }
  };

  if (isLoading) {
    return (
      <Flex justify="center" align="center" style={{ height: "100%" }}>
        <Spinner size="3" />
      </Flex>
    );
  }

  if (error) {
    return (
      <Flex justify="center" align="center" style={{ height: "100%" }}>
        <Text color="red">Failed to load stocks</Text>
      </Flex>
    );
  }

  return (
    <Flex direction="column" gap="4" style={{ height: "100%" }}>
      <Flex justify="between" align="center">
        <Heading size="6">Gestión de Stock</Heading>
        <Button onClick={handleOpenCreate}>
          <Plus size={16} />
          Carga Masiva
        </Button>
      </Flex>

      <Box style={{ overflow: "auto", flexGrow: 1 }}>
        <StockTable 
          stocks={stocks} 
          onEdit={handleOpenEdit} 
          onDelete={handleDelete} 
        />
      </Box>

      <Dialog.Root open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <Dialog.Content style={{ maxWidth: 800 }}>
          <Dialog.Title>{editingStock ? "Editar Stock" : "Carga Masiva de Stock"}</Dialog.Title>
          <Dialog.Description size="2" mb="4">
            {editingStock ? "Ajusta la cantidad de este ítem." : "Selecciona una sucursal y carga múltiples productos."}
          </Dialog.Description>

          {editingStock ? (
             <StockForm 
               initialData={editingStock} 
               onClose={() => setIsDialogOpen(false)} 
               onSubmit={handleSubmit}
               isSubmitting={updateMutation.isPending}
             />
          ) : (
             <BulkStockForm
               onClose={() => setIsDialogOpen(false)}
               onSubmit={handleSubmit}
               isSubmitting={bulkCreateMutation.isPending}
             />
          )}

        </Dialog.Content>
      </Dialog.Root>
    </Flex>
  );
}
