// validators/guidePlaceValidator.js
import { z } from "zod";

export const createGuidePlaceSchema = z.object({
  name: z.string().min(3, "Le nom doit contenir au moins 3 caractères"),
  description: z.string().min(10, "La description doit contenir au moins 10 caractères"),
  location: z.string().nonempty("La localisation est obligatoire"),
  city: z.string().nonempty("La ville est obligatoire"),
  country: z.string().nonempty("Le pays est obligatoire"),
});

export const updateGuidePlaceSchema = z.object({
  name: z.string().min(3).optional(),
  description: z.string().min(10).optional(),
  location: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
});
