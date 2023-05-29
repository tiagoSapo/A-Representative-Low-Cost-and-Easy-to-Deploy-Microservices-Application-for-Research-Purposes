package com.fctuc.productsapp.utils;

import com.fctuc.productsapp.forms.ProductForm;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.UUID;
import javax.inject.Inject;
import javax.ws.rs.core.Response;
import static javax.ws.rs.core.Response.Status.INTERNAL_SERVER_ERROR;
import org.eclipse.microprofile.config.inject.ConfigProperty;
import org.jboss.logging.Logger;

public class Utils {
    
    

    private static String getUploadDirectoryPath(String imagesDir) throws IOException {
        java.nio.file.Path path = Paths.get(imagesDir);
        if (!Files.exists(path)) {
            Files.createDirectories(path);
        }
        return path.toAbsolutePath().toString();
    }

    public static String savePicture(Logger logger, String imagesDir, ProductForm productForm) throws Exception {


        if (!productForm.isValid()) {
            throw new Exception("ProductForm is not valid. It's missing parameters");
        }

        var uploadedInputStream = productForm.getFile();
        var fileExtension = productForm.getFileExtension();
        
        var fileName = UUID.randomUUID().toString() + fileExtension;
        var uploadedFileLocation = Utils.getUploadDirectoryPath(imagesDir)
                + File.separator
                + fileName;
        

        logger.info("Preparing to save product's image to: " + uploadedFileLocation);

        try (FileOutputStream outputStream = new FileOutputStream(new File(uploadedFileLocation))) {
            int read = 0;
            byte[] bytes = new byte[1024];

            while ((read = uploadedInputStream.read(bytes)) != -1) {
                outputStream.write(bytes, 0, read);
            }
            outputStream.flush();
        }

        logger.info("Product image saved sucessfully to: " + uploadedFileLocation);
        
        // ONLY return the file name!
        return fileName;
    }

}
