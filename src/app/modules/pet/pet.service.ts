import { PrismaClient } from "@prisma/client";
import { Request } from "express";
import { fileUploader } from "../../../shared/fileUpload";
const prisma = new PrismaClient();

const addAPet = async (req: Request) => {
  const files = req.files as Express.Multer.File[];

  let petPhotos: string[] = [];

  if (files && files.length > 0) {
    const uploadPromises = files.map((file) =>
      fileUploader.uploadToCloudinary(file)
    );
    const uploadResults = await Promise.all(uploadPromises);

    petPhotos = uploadResults
      .filter((result) => !!result)
      .map((result) => result!.secure_url);
  }

  const result = await prisma.pet.create({
    data: {
      ...req.body,
      name: req.body.name,
      species: req.body.species,
      breed: req.body.breed,
      age: req.body.age,
      size: req.body.size,
      location: req.body.location,
      description: req.body.description,
      temperament: req.body.temperament,
      medicalHistory: req.body.medicalHistory,
      adoptionRequirements: req.body.adoptionRequirements,
      petPhoto: petPhotos, // Assign array of photo URLs
    },
  });

  return result;
};

export const petService = {
  addAPet,
};
