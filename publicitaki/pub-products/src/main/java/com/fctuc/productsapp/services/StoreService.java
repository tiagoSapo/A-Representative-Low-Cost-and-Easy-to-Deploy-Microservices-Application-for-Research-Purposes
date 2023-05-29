
package com.fctuc.productsapp.services;

import com.fctuc.productsapp.model.Price;
import com.fctuc.productsapp.model.Product;
import java.util.List;
import java.util.Optional;
import javax.inject.Singleton;
import javax.ws.rs.core.Response;
import static javax.ws.rs.core.Response.Status.BAD_REQUEST;

@Singleton
public class StoreService {

    public Response getAll() {
        
        Optional<List<Long>> stores = Price.getStores();
        
        return stores
                .map(s -> Response.ok(s))
                .orElse(Response.status(BAD_REQUEST))
                .build();
    }

    public Response getProducts(Long storeId) {
        var storeProducts = Product.getByStore(storeId);
        return Response.ok(storeProducts).build();
    }

    public Response getProductPrices(Long storeId) {
        var productPrices = Price.getStoreProductPrices(storeId);
        return Response.ok(productPrices).build();
    }

    public Response getProductsWithoutPrice(Long storeId) {
        var productsWithoutPrice = Product.getStoreWithoutPrice(storeId);
        return Response.ok(productsWithoutPrice).build();
    }

    public Response getStorePrices(Long storeId) {
        var productPrices = Price.getStorePrices(storeId);
        return Response.ok(productPrices).build();
    }

    public Response addPrice(Long storeId, Long productId, Price price) {
        
        try {
            Price.addProductPrice(storeId, productId, price);
        } 
        catch (Exception ex) {
            return Response
                    .status(BAD_REQUEST)
                    .entity("{error: \"" + ex.getMessage() + "\"}").build();
        }
        
        return Response.ok().build();
    }

    public Response deletePrices(Long storeId) {

        try {
            Price.deleteByStore(storeId);
        }
        catch (Exception ex) {
            return Response
                    .status(BAD_REQUEST)
                    .entity("{error: \"" + ex.getMessage() + "\"}").build();
        }

        return Response.ok().build();

    }
}
