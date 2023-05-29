
package com.fctuc.productsapp.model;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import static io.quarkus.hibernate.orm.panache.PanacheEntityBase.find;
import static io.quarkus.hibernate.orm.panache.PanacheEntityBase.findByIdOptional;
import io.quarkus.panache.common.Sort;
import java.io.Serializable;
import java.math.BigDecimal;
import java.text.DecimalFormat;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import javax.json.bind.annotation.JsonbProperty;
import javax.json.bind.annotation.JsonbTransient;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.persistence.PostLoad;
import javax.persistence.Transient;
import javax.persistence.UniqueConstraint;

@Entity
@Table(uniqueConstraints = @UniqueConstraint(columnNames = {"product_id", "store_id"}))
public class Price extends PanacheEntity implements Serializable {
    
    @Column(nullable = false)
    public BigDecimal price;
    
    //
    // Relationships
    //
    /* Foreign key for store in store's service */
    @Column(name = "store_id", nullable = false)
    public long store;
    
    @JsonbTransient
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "product_id")
    public Product product;
    
    @Transient
    @JsonbProperty("product-details")
    public InnerProduct innerProduct; // For JSON only!


    @PostLoad
    void populateAssociatedProduct() {
        if (product != null) {
            innerProduct = new InnerProduct();
            innerProduct.setBrand(product.brand);
            innerProduct.setDescription(product.description);
            innerProduct.setPicture(product.picture);
            innerProduct.setName(product.name);
        }
    }
    
    
    //
    // CRUD methods
    //
    public static void deleteByStore(long store) {
        delete("store", store);
    }


    public static List<Price> getAll() {
        return Price.findAll().list();
    }
    
    public static Optional<List<Price>> findPricesForProduct(Long productId) {
        
        // Check if product exists
        Product product = Product.findById(productId);
        if (product == null) {
            return Optional.ofNullable(null);
        }
        
        return Optional.ofNullable(
                Price.list("product", Sort.by("id"), product));
    }
    
    private static Optional<Price> getByProductAndStore(Long productId, Long storeId) {
        return find("product.id = ?1 and store = ?2", productId, storeId).firstResultOptional();
    }

    public static List<Price> findByProduct(long productId) {
        return list("product.id = ?1", productId);
    }
    
    public static Optional<List<Long>> getStores() {
        
        Stream<Price> prices = Price.streamAll();
        
        List<Long> stores = prices.map(p -> p.store)
                .distinct()
                .collect(Collectors.toList());
        
        return Optional.ofNullable(stores);
    }
    
    public static List<Price> getStoreProductPrices(Long storeId) {
        return list("store = ?1", storeId);
    }

    public static List<Price> getStorePrices(Long storeId) {
        return list("store = ?1", storeId);
    }
    
    public static void addProductPrice(Long storeId, Long productId, Price price) throws Exception {
        
        // check if store is valid
        if (storeId == null) {
            throw new Exception("Store id is not valid");
        }
        
        // check if ProductId is valid
        if (productId == null) {
            throw new Exception("Product id is not valid");
        }
        
        // check if Price is valid
        if (price == null) {
            throw new Exception("Price is not valid");
        }
        
        // Check Dates
        /*
        if (price.startDate == null || price.endDate == null) {
            throw new Exception("Empty Start and End dates");
        }
        if (price.startDate.isAfter(price.endDate)) {
            throw new Exception("Start-date is after End-date");
        }
        */
        
        // Check if Price is >= 0
        if (price.price == null || price.price.doubleValue() < 0) {
            throw new Exception("Price should be greater than zero");
        }
        
        
        // Get existing product
        Optional<Product> product = Product.findByIdOptional(productId);
        if (product.isEmpty()) {
            throw new Exception("There is no product with id = " + productId);
        }
        
        // check if Store already has a price for this product
        boolean hasPrice = Price.getByProductAndStore(productId, storeId).isPresent();
        if (hasPrice) {
            throw new Exception("Store " + storeId + " already has a price for product " + productId);
        }
        
        // Associate Price to a Product and a Store
        price.product = product.get();
        price.store = storeId;
        
        // Save new Price for store's product
        price.persist();
        
        // Check if price is saved on DB
        if (!price.isPersistent()) {
            throw new Exception("Problem saving new price for store's " + storeId + " product " + productId);
        }
    }


    public static class InnerProduct implements Serializable {
        private String name;
        private String brand;
        private String description;
        private String picture;

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
    }
}
