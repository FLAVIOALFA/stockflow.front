import {
  Box,
  Button,
  Flex,
  Text,
  TextField,
  Spinner,
} from "@radix-ui/themes";
import { useState } from "react";
import { type Brand } from "../../../services/brandService";

interface BrandFormProps {
  initialData: Brand | null;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  isSubmitting: boolean;
}

export function BrandForm({ initialData, onClose, onSubmit, isSubmitting }: BrandFormProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    slug: initialData?.slug || "",
  });

  const generateSlug = (text: string) => {
    return text
      .toString()
      .toLowerCase()
      .trim()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, "-")
      .replace(/[^\w\-]+/g, "")
      .replace(/\-\-+/g, "-");
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    // Auto-generate slug if creating a new brand or if the current slug is empty
    if (!initialData || !formData.slug) {
        setFormData(prev => ({
            ...prev,
            name,
            slug: generateSlug(name)
        }));
    } else {
        setFormData(prev => ({ ...prev, name }));
    }
  };

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
            placeholder="Nombre de la marca" 
            value={formData.name}
            onChange={handleNameChange}
            required
          />
        </Box>

        <Box>
          <Text size="2" weight="bold">Slug</Text>
          <TextField.Root 
            placeholder="slug-generado" 
            value={formData.slug}
            onChange={e => setFormData({...formData, slug: e.target.value})}
            color={formData.slug ? 'gray' : 'red'}
          />
          <Text size="1" color="gray">
            Identificador único para URLs
          </Text>
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
