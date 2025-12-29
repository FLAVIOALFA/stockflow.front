import {
  Box,
  Button,
  Card,
  Dialog,
  Flex,
  Heading,
  TextField,
  Text,
  Spinner
} from "@radix-ui/themes";
import { Plus, Search } from "lucide-react";
import { useState } from "react";
import { type Product, useProductService } from "../../services/productService";
import { ProductTable } from "./components/ProductTable";
import { ProductForm } from "./components/ProductForm";

export function Products() {
  const { useList, useCreate, useUpdate, useDelete } = useProductService();
  
  const { data: response, isLoading, error } = useList({ populate: '*', sort: 'createdAt:desc' });
  const products = response?.data || [];
  
  const createMutation = useCreate();
  const updateMutation = useUpdate();
  const deleteMutation = useDelete();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredProducts = products.filter((p: any) => 
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.slug?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenCreate = () => {
    setEditingProduct(null);
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (product: Product) => {
    setEditingProduct(product);
    setIsDialogOpen(true);
  };

  const handleSubmit = async (payload: any) => {
    try {
        if (editingProduct) {
            const id = editingProduct.documentId || editingProduct.id;
            await updateMutation.mutateAsync({ id, ...payload });
        } else {
            await createMutation.mutateAsync(payload);
        }
        setIsDialogOpen(false);
    } catch (err) {
      console.error("Failed to save product:", err);
      window.alert("Failed to save product. Check required fields including Main Image.");
      throw err;
    }
  };

  const handleDelete = async (id: string | number) => {
    try {
      await deleteMutation.mutateAsync(id);
    } catch (err) {
      console.error("Failed to delete product:", err);
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
        <Text color="red">Failed to load products</Text>
      </Flex>
    );
  }

  return (
    <Flex direction="column" gap="4" style={{ height: "100%" }}>
      <Flex justify="between" align="center">
        <Heading size="6">Lista de productos</Heading>
        <Button onClick={handleOpenCreate}>
          <Plus size={16} />
          Agregar Producto
        </Button>
      </Flex>

      <Box style={{ overflow: "auto", flexGrow: 1 }}>
        <ProductTable 
          products={filteredProducts} 
          onEdit={handleOpenEdit} 
          onDelete={handleDelete} 
        />
      </Box>

      <Dialog.Root open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <Dialog.Content style={{ maxWidth: 600 }}>
          <Dialog.Title>{editingProduct ? "Editar Producto" : "Nuevo Producto"}</Dialog.Title>
          <Dialog.Description size="2" mb="4">
            Detalles de tu unidad de stock.
          </Dialog.Description>

          <ProductForm 
            initialData={editingProduct} 
            onClose={() => setIsDialogOpen(false)} 
            onSubmit={handleSubmit}
            isSubmitting={createMutation.isPending || updateMutation.isPending}
          />
        </Dialog.Content>
      </Dialog.Root>
    </Flex>
  );
}
