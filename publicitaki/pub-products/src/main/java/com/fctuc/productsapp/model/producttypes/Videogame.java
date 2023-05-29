
package com.fctuc.productsapp.model.producttypes;

import com.fctuc.productsapp.model.Product;
import static io.quarkus.hibernate.orm.panache.PanacheEntityBase.findAll;
import io.quarkus.panache.common.Parameters;
import java.util.List;
import javax.persistence.Entity;


@Entity
public class Videogame extends Product {

    public String platform;
    public String releaseDate;
    
    public static List<Product> getAllList() {
        return findAll().list();
    }
    
    public static List<Videogame> getAllPlaystation() {
        return find("platform like ?1", "Playstation%").list();
    }
    
    public static List<Product> getAllXbox() {
        return find("platform like ?1", "Xbox%").list();
    }
    
    public static List<Product> getAllNintendo() {
        return find("platform like ?1", "Nintendo%").list();
    }
}
