import { supabase } from "@/supabase/supabase";
import imageCompression from "browser-image-compression";

export async function uploadImageToSupabase(
  file: File,
  nomeLoja: string,
  medidorId: string
): Promise<string> {
  const bucketName = "leitura-fotos";
  const folderName = medidorId;
  const nameLoja = nomeLoja;
  const safeStoreName = nameLoja
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]/g, "-");
  const fileName = `${safeStoreName}/${folderName}/${Date.now()}.jpg`;

  const options = {
    maxSizeMB: 1,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
    fileType: "image/jpeg",
  };

  let fileToUpload: File;

  try {
    const compressedBlob = await imageCompression(file, options);
    fileToUpload = new File([compressedBlob], file.name, {
      type: compressedBlob.type,
    });
  } catch (error) {
    console.warn("Compressão falhou, usando arquivo original:", error);
    fileToUpload = file; // fallback
  }

  const { error: uploadError } = await supabase.storage
    .from(bucketName)
    .upload(fileName, fileToUpload, {
      contentType: fileToUpload.type,
      upsert: false,
    });

  if (uploadError) {
    console.error("Erro no upload para Supabase Storage:", uploadError);
    throw new Error("Erro no upload da imagem: " + uploadError.message);
  }

  const { data: publicUrlData } = supabase.storage
    .from(bucketName)
    .getPublicUrl(fileName);

  if (!publicUrlData || !publicUrlData.publicUrl) {
    throw new Error("Não foi possível obter a URL pública da imagem.");
  }

  return publicUrlData.publicUrl;
}
