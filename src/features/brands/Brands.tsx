import {
  Box,
  Button,
  Dialog,
  Flex,
  Heading,
  Text,
  Spinner
} from "@radix-ui/themes";
import { Plus } from "lucide-react";
import { useState } from "react";
import { type Brand, useBrandService } from "../../services/brandService";
import { BrandTable } from "./components/BrandTable";
import { BrandForm } from "./components/BrandForm";

export function Brands() {
  const { useList, useCreate, useUpdate, useDelete } = useBrandService();
  
  const { data: response, isLoading, error } = useList({ sort: 'createdAt:desc' });
  const brands = response?.data || [];
  
  const createMutation = useCreate();
  const updateMutation = useUpdate();
  const deleteMutation = useDelete();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);

  const handleOpenCreate = () => {
    setEditingBrand(null);
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (brand: Brand) => {
    setEditingBrand(brand);
    setIsDialogOpen(true);
  };

  const handleSubmit = async (payload: any) => {
    try {
        if (editingBrand) {
            const id = editingBrand.documentId || editingBrand.id;
            await updateMutation.mutateAsync({ id, ...payload });
        } else {
            await createMutation.mutateAsync(payload);
        }
        setIsDialogOpen(false);
    } catch (err) {
      console.error("Failed to save brand:", err);
      // window.alert("Failed to save brand.");
    }
  };

  const handleDelete = async (id: string | number) => {
    try {
      await deleteMutation.mutateAsync(id);
    } catch (err) {
      console.error("Failed to delete brand:", err);
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
        <Text color="red">Failed to load brands</Text>
      </Flex>
    );
  }

  return (
    <Flex direction="column" gap="4" style={{ height: "100%" }}>
      <Flex justify="between" align="center">
        <Heading size="6">Marcas</Heading>
        <Button onClick={handleOpenCreate}>
          <Plus size={16} />
          Agregar Marca
        </Button>
      </Flex>

      <Box style={{ overflow: "auto", flexGrow: 1 }}>
        <BrandTable 
          brands={brands} 
          onEdit={handleOpenEdit} 
          onDelete={handleDelete} 
        />
      </Box>

      <Dialog.Root open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <Dialog.Content style={{ maxWidth: 500 }}>
          <Dialog.Title>{editingBrand ? "Editar Marca" : "Nueva Marca"}</Dialog.Title>
          <Dialog.Description size="2" mb="4">
            Gestione las marcas de sus productos.
          </Dialog.Description>

          <BrandForm 
            initialData={editingBrand} 
            onClose={() => setIsDialogOpen(false)} 
            onSubmit={handleSubmit}
            isSubmitting={createMutation.isPending || updateMutation.isPending}
          />
        </Dialog.Content>
      </Dialog.Root>
    </Flex>
  );
}
