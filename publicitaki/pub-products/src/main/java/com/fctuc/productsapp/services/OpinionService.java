
package com.fctuc.productsapp.services;

import com.fctuc.productsapp.model.Opinion;

import java.util.List;
import java.util.Optional;
import javax.inject.Singleton;
import javax.ws.rs.core.Response;
import static javax.ws.rs.core.Response.Status.BAD_REQUEST;
import static javax.ws.rs.core.Response.Status.NOT_FOUND;

@Singleton
public class OpinionService {
    
    public Response getAll() {
        return Response.ok(Opinion.findAll().list()).build();
    }
    
    public Response getById(Long id) {
        return Opinion.findByIdOptional(id)
                .map(o -> Response.ok(o))
                .orElse(Response
                        .status(BAD_REQUEST)
                        .entity("There is no Opinion with id = " + id))
                .build();
    }

    public Response getByProduct(long productId) {
        
        // Get product's opinions from DB
        Optional<List<Opinion>> opinions = Opinion.getByProduct(productId);
        
        // If Opinions are null -> means the product's id is not valid!
        if (opinions.isEmpty()) {
            return Response
                    .status(BAD_REQUEST)
                    .entity("There is no product with id = " + productId)
                    .build();
        }
        
        return Response.ok(opinions.get()).build();
    }

    public Response getByCustomer(long customerId) {
        
        // Get customer's opinions
        List<Opinion> opinions = Opinion.getByCustomer(customerId);
        
        // Return customer's opinons
        return Response.ok(opinions).build();
    }

    public Response getByProductAndCustomer(long productId, long customerId) {
        
        // Get customer's product opinion
        Optional<Opinion> opinion = Opinion.getByProductAndCustomer(productId, customerId);
        
        // Check if there is an opinion
        if (opinion.isEmpty()) {
            return Response
                    .status(BAD_REQUEST)
                    .entity("There is no product with id = " + productId)
                    .build();
        }
        
        return Response.ok(opinion).build();
    }

    public Response create(long productId, long customerId, Opinion opinion) {
        
        try {
            Opinion.create(productId, customerId, opinion);
        } 
        catch (Exception ex) {
            return Response
                    .status(BAD_REQUEST)
                    .entity("{\"error\": \"" + ex.getMessage() + "\"").build();
        }
        
        return Response.ok().build();
    }

    public Response delete(Long id) {
        var deleteOk = Opinion.deleteById(id);
        return deleteOk ?
                Response.noContent()
                        .build() :
                Response.status(NOT_FOUND)
                        .entity("Thre is no Opinion with id " + id)
                        .build();
    }
}
