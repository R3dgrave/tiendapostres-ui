"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { XCircleIcon, UploadCloudIcon } from "lucide-react";
import Image from "next/image";

interface FileUploaderProps {
  value: File[] | string[];
  onChange: (files: File[]) => void;
}

interface FileDetails {
  file?: File;
  name: string;
  size?: number;
  type?: string;
  previewUrl: string;
  error?: string;
}

const VALID_FILE_TYPES = ["image/webp", "image/jpeg", "image/png"];
const REQUIRED_TYPE = "image/webp";
const MIN_DIMENSION = 500;
const MAX_DIMENSION = 1200;

const FileUploader: React.FC<FileUploaderProps> = ({ value, onChange }) => {
  const [fileDetails, setFileDetails] = useState<FileDetails[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const details = value.map((item) => {
      if (typeof item === "string") {
        const fileName = item.split("/").pop() || "imagen_existente";
        return {
          name: fileName,
          previewUrl: item,
        };
      } else {
        return {
          file: item,
          name: item.name,
          size: item.size,
          type: item.type,
          previewUrl: URL.createObjectURL(item),
        };
      }
    });
    setFileDetails(details);
  }, [value]);

  // Helper para formatear el tamaño del archivo
  const formatFileSize = (bytes?: number): string => {
    if (bytes === undefined || bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  // Valida las dimensiones de una imagen (solo para nuevos archivos)
  const validateImageDimensions = (file: File): Promise<{ error?: string }> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new window.Image();
        img.onload = () => {
          if (img.width < MIN_DIMENSION || img.height < MIN_DIMENSION) {
            resolve({
              error: `Dimensiones muy pequeñas. Mínimo: ${MIN_DIMENSION}x${MIN_DIMENSION}px`,
            });
          } else if (img.width > MAX_DIMENSION || img.height > MAX_DIMENSION) {
            resolve({
              error: `Dimensiones muy grandes. Máximo: ${MAX_DIMENSION}x${MAX_DIMENSION}px`,
            });
          } else {
            resolve({});
          }
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  // Lógica principal para procesar los archivos
  const processFiles = useCallback(
    async (files: File[]) => {
      const newFilesArray: File[] = [];
      for (const file of files) {
        let error: string | undefined = undefined;
        const fileType = file.type;

        //Validación de formato
        if (!VALID_FILE_TYPES.includes(fileType)) {
          error = `Formato de archivo inválido. Solo se aceptan: .${VALID_FILE_TYPES.join(
            ", ."
          ).replace(/image\//g, "")}`;
        } else if (fileType !== REQUIRED_TYPE) {
          error = `Se recomienda el formato ${
            REQUIRED_TYPE.split("/")[1]
          } para ahorrar espacio.`;
        }

        // Validación de dimensiones
        const dimensionResult = await validateImageDimensions(file);
        if (dimensionResult.error) {
          error = dimensionResult.error;
        }

        if (error) {
          // Si hay un error, aún añadimos el archivo para mostrar la advertencia
          newFilesArray.push(file);
          setFileDetails((prevDetails) => [
            ...prevDetails,
            {
              file,
              name: file.name,
              size: file.size,
              type: file.type,
              previewUrl: URL.createObjectURL(file),
              error,
            },
          ]);
        } else {
          newFilesArray.push(file);
        }
      }

      //Notifica al formulario principal con todos los archivos válidos
      const allFiles = [
        ...(value.filter((item) => item instanceof File) as File[]),
        ...newFilesArray,
      ];
      onChange(allFiles);
    },
    [onChange, value]
  );

  // Maneja el evento de cambio de archivo (al hacer clic)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      processFiles(Array.from(e.target.files));
    }
  };

  // Maneja el evento de soltar el archivo
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files) {
      processFiles(Array.from(e.dataTransfer.files));
    }
  };

  // Maneja los eventos de arrastrar
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  // Elimina un archivo
  const handleRemoveFile = (indexToRemove: number) => {
    const newFiles = value.filter(
      (_, index) => index !== indexToRemove
    ) as File[];
    // Notifica al formulario principal con la nueva lista de archivos
    onChange(newFiles);

    // Si el input original se limpió, resetea el input para permitir subir el mismo archivo de nuevo
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="w-full mx-auto">
      {/* Área de arrastrar y soltar */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`mt-2 flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-md cursor-pointer transition-colors
          ${
            isDragOver
              ? "border-blue-500 bg-blue-50"
              : "border-gray-300 hover:border-gray-400"
          }`}
      >
        <UploadCloudIcon className="h-12 w-12 text-gray-400" />
        <p className="mt-2 text-sm text-center text-gray-600">
          Arrastra y suelta una imagen aquí, o haz clic para seleccionarla.
        </p>
        <p className="text-xs text-gray-400 mt-1">
          Formato recomendado: .webp | Dimensiones: ${MIN_DIMENSION}x$
          {MIN_DIMENSION}px a ${MAX_DIMENSION}x${MAX_DIMENSION}px
        </p>
      </div>

      {/* Input de archivo oculto */}
      <Input
        type="file"
        multiple
        onChange={handleFileChange}
        accept="image/webp,image/jpeg,image/png"
        ref={fileInputRef}
        className="hidden"
      />

      {/* Vistas previas y detalles de los archivos */}
      <div className="mt-6 space-y-4">
        {fileDetails.map((item, index) => (
          <div
            key={item.previewUrl}
            className={`flex items-center p-4 border rounded-md space-x-4 transition-colors ${
              item.error ? "border-red-500 bg-red-50" : "border-gray-200"
            }`}
          >
            {/* Previsualización */}
            <div className="relative w-24 h-24 flex-shrink-0">
              <Image
                src={item.previewUrl}
                alt={item.name}
                width={100}
                height={100}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Detalles del archivo */}
            <div className="flex-1 min-w-0">
              <p className="truncate font-medium text-gray-800">{item.name}</p>
              <div className="mt-1 text-sm text-gray-500 space-y-1">
                <p>
                  Tamaño:{" "}
                  {item.size !== undefined
                    ? formatFileSize(item.size)
                    : "No disponible"}
                </p>
                <p>Formato: {item.type || "URL"}</p>
                {/* Mensaje de error */}
                {item.error && (
                  <p className="text-sm font-semibold text-red-600 mt-2">
                    ¡Advertencia! {item.error}
                  </p>
                )}
              </div>
            </div>

            {/* Botón para eliminar */}
            <button
              type="button"
              onClick={() => handleRemoveFile(index)}
              className="p-1 rounded-full text-gray-400 hover:bg-gray-200 hover:text-gray-600 transition-colors"
            >
              <XCircleIcon size={20} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FileUploader;
