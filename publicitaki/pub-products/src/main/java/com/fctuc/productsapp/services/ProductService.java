
package com.fctuc.productsapp.services;

import com.fctuc.productsapp.forms.ComputerForm;
import com.fctuc.productsapp.forms.HomeAppliancesForm;
import com.fctuc.productsapp.model.Price;
import com.fctuc.productsapp.model.Product;
import com.fctuc.productsapp.forms.ProductForm;
import com.fctuc.productsapp.forms.VideogameForm;
import com.fctuc.productsapp.model.intertables.ProductCustomer;
import com.fctuc.productsapp.model.producttypes.Computer;
import com.fctuc.productsapp.model.producttypes.HomeAppliance;
import com.fctuc.productsapp.model.producttypes.Videogame;
import com.fctuc.productsapp.utils.Utils;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import javax.inject.Inject;
import javax.inject.Singleton;
import javax.ws.rs.core.Response;
import static javax.ws.rs.core.Response.Status.BAD_REQUEST;
import static javax.ws.rs.core.Response.Status.NOT_FOUND;

import org.eclipse.microprofile.config.inject.ConfigProperty;
import org.jboss.logging.Logger;

@Singleton
public class ProductService {
    
    @Inject
    Logger logger;
    
    @Inject
    @ConfigProperty(name = "pictures.upload.directory")
    String imagesDir;  

    
    public Response getPrices(long productId) {
        
        // Fetch product's "prices" by date range
        List<Price> prices = Price.findByProduct(productId);
        if (prices.isEmpty()) {
            return Response
                .status(NOT_FOUND)
                .entity("{error: There is no product with id = " + productId + "}")
                .build();
        }
        
        return Response.ok(prices).build();
    }
    

    public Response getAll() {
        var products = Product.getAllProducts();
        return Response.ok(products).build();
    }

    public Response getById(Long id) {
        return Product.findByIdOptional(id)
                .map(p -> Response.ok(p))
                .orElse(Response.status(NOT_FOUND)
                        .entity("{error: There is no product with id = " + id + "}"))
                .build();
    }

    public Response getHomeApliances() {
        var products = HomeAppliance.getAllList();
        return Response.ok(products).build();
    }

    public Response getVideogames(String platform) {
        
        List<?> products;
        
        if (platform == null) {
            products = Videogame.getAllList();
        }
        else if (platform.equalsIgnoreCase("Playstation")) {
            products = Videogame.getAllPlaystation();
        }
        else if (platform.equalsIgnoreCase("Xbox")) {
            products = Videogame.getAllXbox();
        }
        else if (platform.equalsIgnoreCase("Nintendo")) {
            products = Videogame.getAllNintendo();
        } 
        else {
            return Response.status(BAD_REQUEST).entity("{\"error\" = \"There is no platform with that name\"}").build();
        }
        
        return Response.ok(products).build();
    }

    public Response getComputers() {
        var products = Computer.getAllList();
        return Response.ok(products).build();
    }

    public Response getOtherProducts() {
        var products = Product.getOtherProducts();
        return Response.ok(products).build();
    }
    
    public Response getFollowers(Long productId) {
        
        var product = Product.findByIdOptional(productId);
        if (product.isEmpty()) {
            return Response.status(NOT_FOUND)
                    .entity("There is no product with id = " + productId)
                    .build();
        }
        
        // Getting product's followers from intermediate table 'ProductCustomer'
        List<ProductCustomer> productCustomers = ProductCustomer
                .list("product.id = ?1", productId);
        
        // Returning only the followers' id (the product id is not necessary)
        return Response.ok(productCustomers)
                .build();
    }

    public Response getByBrand(String brand) {
        var products = Product.getByBrand(brand);
        return Response.ok(products).build();
    }

    public Response getByName(String name) {
        return Product.getByName(name)
                .map(p -> Response.ok(p))
                .orElse(Response.status(NOT_FOUND)
                        .entity("There is no product with name = " + name))
                .build();
    }

    public Response create(ProductForm productForm) {
        
        try {
            logger.info(productForm);
            
            // Check if product with name exists
            if (Product
                    .getByName(productForm.name)
                    .isPresent()) {
                throw new Exception("Duplicated product " + productForm.name);
            }

            // Saving product's picture name
            var imageName = Utils.savePicture(logger, imagesDir, productForm);

            // convert Form to Product entity
            Product product = productForm.toProduct(imageName);

            // persist new product
            Product.persist(product);
            if (!product.isPersistent()) {
                throw new Exception("Product is not persistent on DB");
            }
            
            return Response.noContent().build();
            
        } 
        catch (Exception ex) {
            logger.error("Error creating new product = " + ex);
            return Response
                        .status(BAD_REQUEST)
                        .build();
        }  
    }
    
    public Response createVideoGame(VideogameForm productForm) {
        try {
            logger.info(productForm);
            
            // Check if product with name exists
            if (Product
                    .getByName(productForm.name)
                    .isPresent()) {
                throw new Exception("Duplicated videogame " + productForm.name);
            }

            // Saving product's picture name
            var imageName = Utils.savePicture(logger, imagesDir, productForm);

            // convert Form to Product entity
            Videogame videogame = productForm.toVideoGame(imageName);

            // persist new product
            Videogame.persist(videogame);
            if (!videogame.isPersistent()) {
                throw new Exception("Videogame is not persistent on DB");
            }
            
            return Response.noContent().build();
            
        } 
        catch (Exception ex) {
            logger.error("Error creating new videogame = " + ex);
            return Response
                        .status(BAD_REQUEST)
                        .build();
        }  
    }
    
    public Response createHomeAppliance(HomeAppliancesForm productForm) {
        try {
            logger.info(productForm);
            
            // Check if product with name exists
            if (Product
                    .getByName(productForm.name)
                    .isPresent()) {
                throw new Exception("Duplicated homeappliance " + productForm.name);
            }

            // Saving product's picture name
            var imageName = Utils.savePicture(logger, imagesDir, productForm);

            // convert Form to Product entity
            HomeAppliance home = productForm.toHomeAppliance(imageName);

            // persist new product
            home.persist(home);
            if (!home.isPersistent()) {
                throw new Exception("Homeappliance is not persistent on DB");
            }
            
            return Response.noContent().build();
            
        } 
        catch (Exception ex) {
            logger.error("Error creating new homeappliance = " + ex);
            return Response
                        .status(BAD_REQUEST)
                        .build();
        }  
    }
    
        public Response createComputer(ComputerForm productForm) {
        try {
            logger.info(productForm);
            
            // Check if product with name exists
            if (Product
                    .getByName(productForm.name)
                    .isPresent()) {
                throw new Exception("Duplicated computer " + productForm.name);
            }

            // Saving product's picture name
            var imageName = Utils.savePicture(logger, imagesDir, productForm);

            // convert Form to Product entity
            Computer computer = productForm.toComputer(imageName);

            // persist new product
            Computer.persist(computer);
            if (!computer.isPersistent()) {
                throw new Exception("computer is not persistent on DB");
            }
            
            return Response.noContent().build();
            
        } 
        catch (Exception ex) {
            logger.error("Error creating new computer = " + ex);
            return Response
                        .status(BAD_REQUEST)
                        .build();
        }  
    }

    public Response addAFollower(Long productId, Long followerId) {
        
        // Get product
        Optional<Product> product = Product.findByIdOptional(productId);
        if (product.isEmpty()) {
            return Response
                    .status(NOT_FOUND)
                    .entity("There is no product with id = " + productId)
                    .build();
        }

        // Get Product customer
        List<ProductCustomer> productCustomer = ProductCustomer.findByProductAndCustomer(productId, followerId);
        if (!productCustomer.isEmpty()) {
            return Response
                    .status(NOT_FOUND)
                    .entity("Customer " + followerId + " already follows product " + productId)
                    .build();
        }
        
        // Create the middle table Product-Customer
        ProductCustomer pc = new ProductCustomer();
        pc.product = product.get();
        pc.follower = followerId;
        
        // Persist the middle table with the new follower/customer
        pc.persist();
        
        return pc.isPersistent() ?
                Response.noContent()
                        .build() :
                Response.status(BAD_REQUEST)
                        .entity("Problem adding follower " + followerId + " to product " + productId)
                        .build();
    }

    public Response update(Long productId, Product product) {
        throw new UnsupportedOperationException("Not supported yet."); // Generated from nbfs://nbhost/SystemFileSystem/Templates/Classes/Code/GeneratedMethodBody
    }

    public Response delete(Long id) {
        var deleteOk = Product.deleteById(id);
        return deleteOk ?
                Response.noContent()
                        .build() :
                Response.status(NOT_FOUND)
                        .entity("There is no Product with id = " + id)
                        .build();
    }

    public Response removeFollower(Long productId, Long followerId) {
        var deleteOk = ProductCustomer.deleteFollower(productId, followerId);
        return deleteOk > 0 ?
                Response.noContent()
                        .build() :
                Response.status(NOT_FOUND)
                        .entity("There is no Product with id = " + productId + " or customer " + followerId + " is not following product")
                        .build();
    }
}
