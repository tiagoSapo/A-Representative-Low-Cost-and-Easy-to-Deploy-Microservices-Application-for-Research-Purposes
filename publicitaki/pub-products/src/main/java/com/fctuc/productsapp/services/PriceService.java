
package com.fctuc.productsapp.services;

import com.fctuc.productsapp.model.Price;
import java.util.List;
import java.util.Optional;
import javax.inject.Singleton;
import javax.ws.rs.core.Response;
import static javax.ws.rs.core.Response.Status.BAD_REQUEST;
import static javax.ws.rs.core.Response.Status.NOT_FOUND;

@Singleton
public class PriceService {

    public Response getAll() {
        return Response.ok(Price.findAll().list()).build();
    }

    public Response getById(Long id) {
        return Price.findByIdOptional(id)
                .map(p -> Response.ok(p))
                .orElse(Response.status(BAD_REQUEST)
                        .entity("There is no Price with id = " + id))
                .build();
    }

    public Response getByProduct(Long productId) {
        
        // Get Prices for product
        Optional<List<Price>> prices = Price.findPricesForProduct(productId);
        
        // check if there is a product
        if (!prices.isPresent()) {
            return Response.status(BAD_REQUEST)
                        .entity("{error: \"There is no Product with id = " + productId + "\"}").build();
        }
        
        return Response.ok(prices.get()).build();
    }

    public Response delete(Long id) {
        var deleteOk = Price.deleteById(id);
        return deleteOk ?
                Response.noContent()
                        .build() :
                Response.status(NOT_FOUND)
                        .entity("There is no Price with id = " + id)
                        .build();
    }
}
