import {
  Box,
  Button,
  Flex,
  Text,
  TextField,
  TextArea,
  Switch,
  Spinner,
  Avatar,
  Select,
  Checkbox,
  Grid
} from "@radix-ui/themes";
import { Upload } from "lucide-react";
import { useState } from "react";
import { type Product } from "../../../services/productService";
import { useBrandService } from "../../../services/brandService";
import { useCategoryService } from "../../../services/categoryService";
import { api } from "../../../lib/api";

const STRAPI_URL = "http://localhost:1337";

interface ProductFormProps {
  initialData: Product | null;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  isSubmitting: boolean;
}

export function ProductForm({ initialData, onClose, onSubmit, isSubmitting }: ProductFormProps) {
  const { useList: useBrandList } = useBrandService();
  const { useList: useCategoryList } = useCategoryService();

  const { data: brandsRes } = useBrandList();
  const { data: categoriesRes } = useCategoryList();

  const brands = brandsRes?.data || [];
  const categories = categoriesRes?.data || [];

  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    shortDescription: initialData?.shortDescription || "",
    slug: initialData?.slug || "",
    priceSell: initialData ? String(initialData.priceSell) : "0",
    priceCost: initialData ? String(initialData.priceCost) : "0",
    unitsPerPack: initialData ? String(initialData.unitsPerPack) : "1",
    isAvailable: initialData ? initialData.isAvailable : true,
    brand: (initialData?.brand as any)?.id ? String((initialData?.brand as any).id) : "",
    categories: (initialData?.categories as any[])?.map((c: any) => String(c.id)) || [],
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const getImageUrl = (product: any) => {
    const url = product?.mainImage?.url;
    if (!url) return null;
    if (url.startsWith('http')) return url;
    return `${STRAPI_URL}${url}`;
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    if (!initialData) {
      const slug = title.toLowerCase()
        .replace(/ /g, '-')
        .replace(/[^\w-]+/g, '');
      setFormData(prev => ({ ...prev, title, slug }));
    } else {
      setFormData(prev => ({ ...prev, title }));
    }
  };

  const handleUpload = async (file: File) => {
    const formData = new FormData();
    formData.append("files", file);

    const res = await api.post('/api/upload', formData, {
      headers: {
        "Content-Type": undefined
      } as any
    });
    return res.data;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.brand) {
      // Simple alert or you could use a toast/error state
      alert("La marca es obligatoria.");
      return;
    }

    setUploading(true);
    try {
      let mainImageId = (initialData as any)?.mainImage?.id;

      if (imageFile) {
        const uploadedFiles = await handleUpload(imageFile);
        if (uploadedFiles && uploadedFiles.length > 0) {
          mainImageId = uploadedFiles[0].id;
        }
      }

      const payload = {
        title: formData.title,
        shortDescription: formData.shortDescription,
        slug: formData.slug,
        isAvailable: formData.isAvailable,
        priceSell: parseFloat(formData.priceSell),
        priceCost: parseFloat(formData.priceCost),
        unitsPerPack: parseInt(formData.unitsPerPack),
        mainImage: mainImageId,
        brand: parseInt(formData.brand),
        categories: formData.categories.map((id: string) => parseInt(id))
      };

      await onSubmit(payload);
    } catch (error) {
       console.error(error);
       alert("Error saving product");
    } finally {
      setUploading(false);
    }
  };

  const toggleCategory = (catId: string) => {
    setFormData(prev => {
      const current = prev.categories;
      if (current.includes(catId)) {
        return { ...prev, categories: current.filter((id: string) => id !== catId) };
      } else {
        return { ...prev, categories: [...current, catId] };
      }
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Flex direction="column" gap="3">
        <Box>
           <Grid columns="2" gap="3">
              <Box>
                <Text size="2" weight="bold">Titulo *</Text>
                <TextField.Root 
                  placeholder="Titulo del producto" 
                  value={formData.title}
                  onChange={handleTitleChange}
                  required
                />
              </Box>
              <Box>
                <Text size="2" weight="bold">Slug (UID) *</Text>
                <TextField.Root 
                  placeholder="slug-producto" 
                  value={formData.slug}
                  onChange={e => setFormData({...formData, slug: e.target.value})}
                  required
                />
              </Box>
           </Grid>
        </Box>
        
        <Box>
            <Text size="2" weight="bold" mb="1">Marca *</Text>
            <Select.Root 
                value={formData.brand} 
                onValueChange={(val) => setFormData({...formData, brand: val})}
            >
                <Select.Trigger placeholder="Selecciona una marca..." style={{ width: '100%' }} />
                <Select.Content>
                    {brands.map((brand: any) => (
                        <Select.Item key={brand.id} value={String(brand.documentId || brand.id)}>
                            {brand.name}
                        </Select.Item>
                    ))}
                </Select.Content>
            </Select.Root>
        </Box>

        <Box>
          <Text size="2" weight="bold">Descripción *</Text>
          <TextArea 
            placeholder="Descripción del producto" 
            value={formData.shortDescription}
            onChange={e => setFormData({...formData, shortDescription: e.target.value})}
            required
            style={{ height: 60 }}
          />
        </Box>

        <Box>
           <Text size="2" weight="bold">Categorías</Text>
           <Flex gap="3" wrap="wrap" mt="1">
               {categories.map((cat: any) => {
                   const catId = String(cat.documentId || cat.id);
                   return (
                     <Text as="label" size="2" key={catId}>
                       <Flex gap="2">
                         <Checkbox 
                           checked={formData.categories.includes(catId)}
                           onCheckedChange={() => toggleCategory(catId)}
                         />
                         {cat.name}
                       </Flex>
                     </Text>
                   );
               })}
           </Flex>
        </Box>

        <Box>
           <Text size="2" weight="bold">Imagen principal *</Text>
           <Flex align="center" gap="3">
              {(imageFile || (initialData as any)?.mainImage?.url) && (
                  <Avatar 
                      src={imageFile ? URL.createObjectURL(imageFile) : getImageUrl(initialData)} 
                      fallback="Img" 
                  />
              )}
              <label style={{ flex: 1 }}>
                  <Button type="button" variant="soft" asChild style={{ width: '100%', cursor: 'pointer' }}>
                      <span>
                          <Upload size={16} /> Choose File
                          <input 
                              type="file" 
                              accept="image/*" 
                              onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                              style={{ display: 'none' }}
                          />
                      </span>
                  </Button>
              </label>
           </Flex>
           {imageFile && <Text size="1" color="green">{imageFile.name}</Text>}
        </Box>

        <Grid columns="3" gap="3">
           <Box>
              <Text size="2" weight="bold">Precio Venta</Text>
              <TextField.Root 
                  type="number" step="0.01"
                  value={formData.priceSell}
                  onChange={e => setFormData({...formData, priceSell: e.target.value})}
                  required
              />
           </Box>
           <Box>
              <Text size="2" weight="bold">Precio Costo</Text>
              <TextField.Root 
                  type="number" step="0.01"
                  value={formData.priceCost}
                  onChange={e => setFormData({...formData, priceCost: e.target.value})}
                  required
              />
           </Box>
           <Box>
              <Text size="2" weight="bold">Unidades/Pack</Text>
              <TextField.Root 
                  type="number"
                  value={formData.unitsPerPack}
                  onChange={e => setFormData({...formData, unitsPerPack: e.target.value})}
                  required
              />
           </Box>
        </Grid>

        <Flex align="center" gap="2" mt="2">
            <Switch 
              checked={formData.isAvailable} 
              onCheckedChange={(checked) => setFormData({...formData, isAvailable: checked})} 
            />
            <Text size="2">Disponible</Text>
        </Flex>

        <Flex gap="3" mt="4" justify="end">
          <Button variant="soft" color="gray" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={uploading || isSubmitting}>
              {uploading || isSubmitting ? <Spinner /> : "Save"}
          </Button>
        </Flex>
      </Flex>
    </form>
  );
}
