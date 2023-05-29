
package com.fctuc.productsapp.model.producttypes;

import com.fctuc.productsapp.model.Product;
import static io.quarkus.hibernate.orm.panache.PanacheEntityBase.findAll;
import java.util.List;
import javax.persistence.Entity;

@Entity
public class HomeAppliance extends Product {
    public String dimension;
    public String colour;
    
    public static List<Computer> getAllList() {
        return findAll().list();
    }
}
