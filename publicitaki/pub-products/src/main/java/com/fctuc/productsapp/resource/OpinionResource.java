
package com.fctuc.productsapp.resource;

import com.fctuc.productsapp.model.Opinion;
import com.fctuc.productsapp.services.OpinionService;
import javax.inject.Inject;
import javax.transaction.Transactional;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

@Path("/opinions")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public class OpinionResource {
    
    @Inject
    OpinionService service;
    
    
    //
    // GET
    //
    
    // Get all opinions
    @GET
    public Response getAll() {
        return service.getAll();
    }
    
    // Get an opinion by its id
    @GET
    @Path("/{id}")
    public Response getById(@PathParam("id") Long id) {
        return service.getById(id);
    }
    
    // Get product's opinions
    @GET
    @Path("/products/{id}")
    public Response getByProduct(@PathParam("id") long productId) {
        return service.getByProduct(productId);
    }
    
    // Get product's opinions
    @GET
    @Path("/products/{product-id}/customer/{customer-id}")
    public Response getByProductAndCustomer(
            @PathParam("product-id") long productId,
            @PathParam("customer-id") long customerId) {
        
        return service.getByProductAndCustomer(productId, customerId);
    }
    
    // Get customer's opinions
    @GET
    @Path("/customers/{id}")
    public Response getByCustomer(@PathParam("id") long customerId) {
        return service.getByCustomer(customerId);
    }
    
    
    //
    //  POST
    //
    
    // Create an opinion for product from a customer
    @POST
    @Path("/products/{product-id}/customer/{customer-id}")
    @Transactional
    public Response create(
            @PathParam("product-id") long productId,
            @PathParam("customer-id") long customerId,
            Opinion opinion) {
        
        return service.create(productId, customerId, opinion);
    }
    
    //
    //  DELETE
    //
    
    // Delete opinion with id provided
    @DELETE
    @Path("{id}")
    @Transactional
    public Response delete(@PathParam("id") Long id) {
        return service.delete(id);
    }
    
}
