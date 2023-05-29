
package com.fctuc.productsapp.model;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import static io.quarkus.hibernate.orm.panache.PanacheEntityBase.find;
import io.quarkus.hibernate.orm.panache.PanacheQuery;
import java.io.Serializable;
import java.util.List;
import java.util.Optional;
import javax.json.bind.annotation.JsonbProperty;
import javax.json.bind.annotation.JsonbTransient;
import javax.persistence.*;
import javax.validation.constraints.Max;
import javax.validation.constraints.Min;

@Entity
@Table(
    uniqueConstraints = @UniqueConstraint(columnNames = {"product_id", "customer_id"})
)
public class Opinion extends PanacheEntity implements Serializable {
 
    @Column(nullable = false)
    public String title;
    
    @Column(nullable = false)
    public String description;
    
    @Min(1)
    @Max(5)
    @Column(nullable = false)
    public int rating;

    //
    // Relationships
    //
    @JsonbTransient
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    public Product product;

    @Transient
    @JsonbProperty("product-details")
    public Price.InnerProduct innerProduct; // For JSON only!
    
    @Column(name = "customer_id")
    public long customer;

    @PostLoad
    void populateAssociatedProduct() {
        if (product != null) {
            innerProduct = new Price.InnerProduct();
            innerProduct.setBrand(product.brand);
            innerProduct.setDescription(product.description);
            innerProduct.setPicture(product.picture);
            innerProduct.setName(product.name);
        }
    }


    public static void create(long productId, long customerId, Opinion opinion) throws Exception {

        // Check if opinion provided
        if (opinion == null) {
            throw new Exception("No opinion provided");
        }

        // Check customer's id
        if (customerId <= 0) {
            throw new Exception("Invalid customer (id >= 1)");
        }

        // Check rating between 1 and 5
        if (opinion.rating < 1 || opinion.rating > 5) {
            throw new Exception("Invalid rating");
        }

        if (opinion.title == null || opinion.title.isBlank()) {
            throw new Exception("Invalid opinion's title");
        }

        if (opinion.description == null || opinion.description.isBlank()) {
            throw new Exception("Invalid opinion's description");
        }

        // Check if customer already made an opinion
        if (Opinion.getByProductAndCustomer(productId, customerId).isPresent()) {
            throw new Exception("Customer " + customerId + " already made an opinion for product " + productId);
        }

        // Check if product exists
        Product product = Product.findById(productId);
        if (product == null) {
            throw new Exception("There is no product with id = " + productId);
        }

        // Associate Opinion to [Product and Customer]
        opinion.product = product;
        opinion.customer = customerId;

        // Save opinion
        opinion.persist();

        // Check if new opinion is saved DB
        if (!opinion.isPersistent()) {
            throw new Exception("Problem persisting opinion on DB");
        }
    }
    
    public static Optional<List<Opinion>> getByProduct(long productId) {
        
        // Get product by its id
        Optional<Product> product = Product.findByIdOptional(productId);
        
        // Check if product with id provided exists
        if (product.isEmpty()) {
            return Optional.ofNullable(null);
        }
        
        // Return product's opinions in the optional format
        return Optional.ofNullable(product.get().opinions);
    }
    
    public static List<Opinion> getByCustomer(long customerId) {
        
        // Get all customer's opinions
        List<Opinion> opinions = find("customer", customerId)
                .list();
        
        return opinions;
    }
    
    public static Optional<Opinion> getByProductAndCustomer(long productId, long customerId) {
        return Opinion
                .find("customer = ?1 and product.id = ?2", customerId, productId)
                .firstResultOptional();
    }
    
    public boolean customerHasOpinionForProduct(int customerId, long productId) {
        
        // query for any opinions with the given customer and product IDs
        List<Opinion> opinions = Opinion.list("customer = ?1 and product.id = ?2", customerId, productId);

        // return true if any opinions were found
        return !opinions.isEmpty();
    }
}
