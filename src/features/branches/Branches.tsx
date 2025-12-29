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
import { type Branch, useBranchService } from "../../services/branchService";
import { BranchTable } from "./components/BranchTable";
import { BranchForm } from "./components/BranchForm";

export function Branches() {
  const { useList, useCreate, useUpdate, useDelete } = useBranchService();
  
  const { data: response, isLoading, error } = useList({ sort: 'createdAt:desc' });
  const branches = response?.data || [];
  
  const createMutation = useCreate();
  const updateMutation = useUpdate();
  const deleteMutation = useDelete();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null);

  const handleOpenCreate = () => {
    setEditingBranch(null);
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (branch: Branch) => {
    setEditingBranch(branch);
    setIsDialogOpen(true);
  };

  const handleSubmit = async (payload: any) => {
    try {
        if (editingBranch) {
            const id = editingBranch.documentId || editingBranch.id;
            await updateMutation.mutateAsync({ id, ...payload });
        } else {
            await createMutation.mutateAsync(payload);
        }
        setIsDialogOpen(false);
    } catch (err) {
      console.error("Failed to save branch:", err);
      window.alert("Failed to save branch.");
    }
  };

  const handleDelete = async (id: string | number) => {
    try {
      await deleteMutation.mutateAsync(id);
    } catch (err) {
      console.error("Failed to delete branch:", err);
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
        <Text color="red">Failed to load branches</Text>
      </Flex>
    );
  }

  return (
    <Flex direction="column" gap="4" style={{ height: "100%" }}>
      <Flex justify="between" align="center">
        <Heading size="6">Sucursales</Heading>
        <Button onClick={handleOpenCreate}>
          <Plus size={16} />
          Agregar Sucursal
        </Button>
      </Flex>

      <Box style={{ overflow: "auto", flexGrow: 1 }}>
        <BranchTable 
          branches={branches} 
          onEdit={handleOpenEdit} 
          onDelete={handleDelete} 
        />
      </Box>

      <Dialog.Root open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <Dialog.Content style={{ maxWidth: 500 }}>
          <Dialog.Title>{editingBranch ? "Editar Sucursal" : "Nueva Sucursal"}</Dialog.Title>
          <Dialog.Description size="2" mb="4">
            Gestione las sucursales y depósitos.
          </Dialog.Description>

          <BranchForm 
            initialData={editingBranch} 
            onClose={() => setIsDialogOpen(false)} 
            onSubmit={handleSubmit}
            isSubmitting={createMutation.isPending || updateMutation.isPending}
          />
        </Dialog.Content>
      </Dialog.Root>
    </Flex>
  );
}
