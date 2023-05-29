
package com.fctuc.productsapp.model;
import com.fctuc.productsapp.model.intertables.ProductCustomer;
import com.fctuc.productsapp.model.producttypes.Computer;
import com.fctuc.productsapp.model.producttypes.HomeAppliance;
import com.fctuc.productsapp.model.producttypes.Videogame;
import io.quarkus.hibernate.orm.panache.PanacheEntity;
import io.quarkus.hibernate.orm.panache.PanacheQuery;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import javax.json.bind.annotation.JsonbTransient;
import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Inheritance;
import javax.persistence.InheritanceType;
import javax.persistence.OneToMany;
        
@Entity
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
public class Product extends PanacheEntity implements Serializable {

    @Column(nullable = false, unique = true)
    public String name;
    
    @Column(nullable = false)
    public String brand;
    
    @Column(nullable = false)
    public String description;
    
    @Column(nullable = false)
    public String picture;
    
    // PRICE
    @JsonbTransient
    @OneToMany(
            mappedBy = "product", 
            cascade = CascadeType.ALL, 
            orphanRemoval = true)
    public List<Price> prices = new ArrayList<>();
    
    // OPINION
    @JsonbTransient
    @OneToMany(
            mappedBy = "product", 
            cascade = CascadeType.ALL, 
            orphanRemoval = true)
    public List<Opinion> opinions = new ArrayList<>();
    
    // CUSTOMER (aka follower, because follows a product)
    @JsonbTransient
    @OneToMany(
            mappedBy = "product", 
            cascade = CascadeType.ALL, 
            orphanRemoval = true)
    public List<ProductCustomer> followers = new ArrayList<>();
    
    
    //
    // CRUD methods
    //
    
    public static List<Product> getAllProducts() {
        return findAll().list();
    }
    
    public static List<Product> getOtherProducts() {
        List<Product> allProducts = Product.listAll();
        List<Product> otherProducts = allProducts.stream()
            .filter(p -> !(p instanceof Computer || p instanceof HomeAppliance || p instanceof Videogame))
            .collect(Collectors.toList());
        return otherProducts;
    }
    
    public static List<Product> getByBrand(String brand) {
        return list("brand", brand);
    }
    
    public static Optional<Product> getByName(String name) {
        return find("name", name).firstResultOptional();
    }
    
    public static List<Long> getFollowers(long productId) {
        
        Optional<Product> product = findByIdOptional(productId);
        if (product.isEmpty()) {
            return null;
        }
        
        return product.get().followers
                .stream()
                .map(pc -> pc.follower)
                .collect(Collectors.toList());
    }
    
    public static List<Product> getByStore(Long storeId) {
        PanacheQuery<Product> query = find("SELECT DISTINCT p FROM Product p " +
                "JOIN FETCH p.prices pr " +
                "WHERE pr.store = ?1", storeId);

        return query.list();
    }


    public static List<Product> getStoreWithoutPrice(Long storeId) {
        PanacheQuery<Product> query = find("SELECT p FROM Product p LEFT JOIN p.prices pr WHERE pr.store <> ?1 OR pr.store IS NULL", storeId);
        return query.list();
    }
}