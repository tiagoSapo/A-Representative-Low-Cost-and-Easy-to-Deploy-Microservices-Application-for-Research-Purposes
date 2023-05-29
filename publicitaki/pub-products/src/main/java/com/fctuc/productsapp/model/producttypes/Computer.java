
package com.fctuc.productsapp.model.producttypes;

import com.fctuc.productsapp.model.Product;
import static io.quarkus.hibernate.orm.panache.PanacheEntityBase.list;
import java.text.DecimalFormat;
import java.util.List;
import javax.persistence.Entity;

@Entity
public class Computer extends Product {
    public String cpu;
    public String memory;
    public String storage;
    public String screenResolution;
    public String screenSize;
    public String Os;
    
    public static List<Computer> getAllList() {
        return findAll().list();
    }
}
