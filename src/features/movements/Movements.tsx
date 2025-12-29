import {
  Box,
  Button,
  Flex,
  Heading,
  Text,
  Spinner,
  Dialog
} from "@radix-ui/themes";
import { Plus } from "lucide-react";
import { useState } from "react";
import { type Movement, useMovementService } from "../../services/movementService";
import { MovementTable } from "./components/MovementTable";
import { MovementForm } from "./components/MovementForm";

export function Movements() {
  const { useList, useCreate, useUpdate, useOne } = useMovementService();
  
  const { data: response, isLoading, error } = useList({ populate: '*', sort: 'createdAt:desc' });
  const movements = response?.data || [];
  
  const createMutation = useCreate();
  const updateMutation = useUpdate();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | number | null>(null);

  // Fetch full details when editing
  const { data: oneResponse, isLoading: isLoadingOne } = useOne(selectedId || "");
  const editingMovement = selectedId ? oneResponse?.data : null;

  const handleOpenCreate = () => {
    setSelectedId(null);
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (movement: Movement) => {
    setSelectedId(movement.documentId || movement.id!);
    setIsDialogOpen(true);
  };

  const handleSubmit = async (payload: any) => {
    try {
        if (selectedId) {
            await updateMutation.mutateAsync({ id: selectedId, ...payload });
        } else {
            // Ensure payload matches strict creation requirements
            await createMutation.mutateAsync(payload);
        }
        setIsDialogOpen(false);
    } catch (err) {
      console.error("Failed to save movement:", err);
      // alert("Failed to save movement."); 
      // Ideally show a toast or error message in UI
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
        <Text color="red">Failed to load movements</Text>
      </Flex>
    );
  }

  return (
    <Flex direction="column" gap="4" style={{ height: "100%" }}>
      <Flex justify="between" align="center">
        <Heading size="6">Movimientos de Stock</Heading>
        <Button onClick={handleOpenCreate}>
          <Plus size={16} />
          Nuevo Movimiento
        </Button>
      </Flex>

      <Box style={{ overflow: "auto", flexGrow: 1 }}>
        <MovementTable 
          movements={movements} 
          onEdit={handleOpenEdit} 
        />
      </Box>

      <Dialog.Root open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <Dialog.Content style={{ maxWidth: 850, padding: "2em 1em", }}>
          <Dialog.Title>{selectedId ? 'Editar' : 'Nuevo'} Movimiento</Dialog.Title>
             {/* We use MovementForm which has its own Card/Layout. 
                 We remove padding to let the Card fill the Dialog. */}
            
            {selectedId && isLoadingOne ? (
                <Flex justify="center" p="5">
                    <Spinner size="3" />
                </Flex>
            ) : (
                <MovementForm 
                    movement={editingMovement || undefined} 
                    onSave={handleSubmit} 
                    onCancel={() => setIsDialogOpen(false)} 
                />
            )}
        </Dialog.Content>
      </Dialog.Root>
    </Flex>
  );
}
