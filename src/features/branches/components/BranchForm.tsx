import {
  Box,
  Button,
  Flex,
  Text,
  TextField,
  RadioGroup,
  Spinner,
} from "@radix-ui/themes";
import { useState } from "react";
import { type Branch } from "../../../services/branchService";

interface BranchFormProps {
  initialData: Branch | null;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  isSubmitting: boolean;
}

export function BranchForm({ initialData, onClose, onSubmit, isSubmitting }: BranchFormProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    type: initialData?.type || "local",
    address: initialData?.address || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Flex direction="column" gap="3">
        <Box>
          <Text size="2" weight="bold">Nombre *</Text>
          <TextField.Root 
            placeholder="Nombre de la sucursal" 
            value={formData.name}
            onChange={e => setFormData({...formData, name: e.target.value})}
            required
          />
        </Box>
        
        <Box>
            <Text size="2" weight="bold" mb="1">Tipo *</Text>
            <RadioGroup.Root 
                value={formData.type} 
                onValueChange={(val: any) => setFormData({...formData, type: val})}
            >
                <Flex gap="2" direction="column">
                    <Text as="label" size="2">
                        <Flex gap="2">
                            <RadioGroup.Item value="local" /> Local
                        </Flex>
                    </Text>
                    <Text as="label" size="2">
                        <Flex gap="2">
                            <RadioGroup.Item value="deposit" /> Depósito
                        </Flex>
                    </Text>
                </Flex>
            </RadioGroup.Root>
        </Box>

        <Box>
          <Text size="2" weight="bold">Dirección</Text>
          <TextField.Root 
            placeholder="Dirección completa" 
            value={formData.address}
            onChange={e => setFormData({...formData, address: e.target.value})}
          />
        </Box>

        <Flex gap="3" mt="4" justify="end">
          <Button variant="soft" color="gray" type="button" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? <Spinner /> : "Guardar"}
          </Button>
        </Flex>
      </Flex>
    </form>
  );
}
