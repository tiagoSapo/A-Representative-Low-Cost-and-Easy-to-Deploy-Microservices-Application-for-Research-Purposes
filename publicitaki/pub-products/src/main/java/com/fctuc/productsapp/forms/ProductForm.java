package com.fctuc.productsapp.forms;

import com.fctuc.productsapp.model.Product;
import org.jboss.resteasy.annotations.providers.multipart.PartType;
import javax.ws.rs.FormParam;
import javax.ws.rs.core.MediaType;
import java.io.InputStream;

public class ProductForm {

    @FormParam("name")
    public String name;
    
    @FormParam("brand")
    public String brand;
    
    @FormParam("description")
    public String description;
    
    @FormParam("picture")
    public String picture;

    @FormParam("file")
    @PartType(MediaType.APPLICATION_OCTET_STREAM)
    private InputStream file;

    @FormParam("file-extension")
    private String fileExtension;

    public InputStream getFile() {
        return file;
    }

    public void setFile(InputStream file) {
        this.file = file;
    }

    public String getFileExtension() {
        return fileExtension;
    }

    public void setFileExtension(String fileExtension) {
        this.fileExtension = fileExtension;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getBrand() {
        return brand;
    }

    public void setBrand(String brand) {
        this.brand = brand;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getPicture() {
        return picture;
    }

    public void setPicture(String picture) {
        this.picture = picture;
    }

    public Product toProduct(String imagePath) throws Exception {

        if (!isValid() || imagePath == null) {
            throw new Exception("ProductForm is not valid");
        }

        var product = new Product();
        product.brand = this.brand;
        product.description = this.description;
        product.name = this.name;
        product.picture = imagePath;

        return product;
    }

    public boolean isValid() {
        return this.name != null
                && this.brand != null
                && this.description != null
                && this.file != null
                && this.fileExtension != null;
    }

    @Override
    public String toString() {
        return "ProductFormData{" + "name=" + name + ", brand=" + brand + ", description=" + description + ", picture=" + picture + ", file=" + String.valueOf(file!=null) + ", fileExtension=" + fileExtension + '}';
    }
    
    

}
