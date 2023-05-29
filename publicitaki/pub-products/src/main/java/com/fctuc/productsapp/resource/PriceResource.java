
package com.fctuc.productsapp.resource;

import com.fctuc.productsapp.services.PriceService;
import javax.inject.Inject;

import javax.transaction.Transactional;
import javax.ws.rs.DELETE;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

@Path("/prices")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public class PriceResource {
    
    @Inject
    PriceService service;
    
    
    //
    // GET
    //
    
    // Get all prices
    @GET
    public Response getAll() {
        return service.getAll();
    }
    
    // Get a price by its id
    @GET
    @Path("/{id}")
    public Response getById(@PathParam("id") Long id) {
        return service.getById(id);
    }
    
    // Get product's price
    @GET
    @Path("/products/{id}")
    public Response getByProduct(@PathParam("id") Long productId) {
        return service.getByProduct(productId);
    }
    

    // Delete a price by its id
    @DELETE
    @Path("{id}")
    @Transactional
    public Response delete(@PathParam("id") Long id) {
        return service.delete(id);
    }
}
