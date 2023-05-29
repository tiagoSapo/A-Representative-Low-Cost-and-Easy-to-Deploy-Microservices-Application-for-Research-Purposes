
package com.fctuc.productsapp.resource;

import com.fctuc.productsapp.model.Price;
import com.fctuc.productsapp.services.StoreService;
import javax.inject.Inject;
import javax.transaction.Transactional;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

@Path("/stores")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public class StoreResource {
    
    @Inject
    StoreService service;
    
    //
    // GET Methods
    //
    
    // Get all existing stores
    @GET
    public Response getAll() {
        return service.getAll();
    }
    
    // Get all product from store
    @GET
    @Path("/{id}/products")
    public Response getProducts(@PathParam("id") Long storeId) {
        return service.getProducts(storeId);
    }

    // Get all product from store
    @GET
    @Path("/{id}/products-without-price")
    public Response getProductsWithoutPrice(@PathParam("id") Long storeId) {
        return service.getProductsWithoutPrice(storeId);
    }


    // Get store's prices with respective products
    @GET
    @Path("/{store-id}/prices")
    public Response getStorePrices(
            @PathParam("store-id") Long storeId) {
        return service.getStorePrices(storeId);
    }

    
    //
    // POST Methods
    //
    
    @POST
    @Path("{store-id}/product/{product-id}/price")
    @Transactional
    public Response addPrice(
            @PathParam("store-id") Long storeId, 
            @PathParam("product-id") Long productId,
            Price price) {
        
        return service.addPrice(storeId, productId, price);
    }

    //
    // DELETE Methods
    //
    @DELETE
    @Path("{store-id}/prices")
    @Transactional
    public Response deletePrices(
            @PathParam("store-id") Long storeId) {

        return service.deletePrices(storeId);
    }
}
