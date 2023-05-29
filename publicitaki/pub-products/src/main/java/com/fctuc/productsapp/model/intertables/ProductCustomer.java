
package com.fctuc.productsapp.model.intertables;

import com.fctuc.productsapp.model.Product;
import io.quarkus.hibernate.orm.panache.PanacheEntity;
import java.io.Serializable;
import java.util.List;
import java.util.Optional;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.persistence.UniqueConstraint;

@Entity
@Table(
    uniqueConstraints = @UniqueConstraint(columnNames = {"product_id", "customer_id"})
)
public class ProductCustomer extends PanacheEntity implements Serializable {
    
    @ManyToOne
    @JoinColumn(name="product_id", nullable = false)
    public Product product;

    @Column(name = "customer_id", nullable = false)
    public Long follower;


    public static long deleteFollower(Long productId, Long followerId) {
        return delete("product.id = ?1 and follower = ?2", productId, followerId);
    }

    public static List<ProductCustomer> findByProductAndCustomer(Long productId, Long followerId) {
        return list("product.id = ?1 and follower = ?2", productId, followerId);
    }

    public static List<ProductCustomer> findByFollower(long followerId) {
        return list("follower = ?1", followerId);
    }
}
