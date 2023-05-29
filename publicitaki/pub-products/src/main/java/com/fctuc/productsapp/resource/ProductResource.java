package com.fctuc.productsapp.resource;

import com.fctuc.productsapp.forms.ComputerForm;
import com.fctuc.productsapp.forms.HomeAppliancesForm;
import com.fctuc.productsapp.model.Product;
import com.fctuc.productsapp.forms.ProductForm;
import com.fctuc.productsapp.forms.VideogameForm;
import com.fctuc.productsapp.services.ProductService;
import javax.inject.Inject;
import javax.transaction.Transactional;
import javax.ws.rs.DELETE;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import org.jboss.resteasy.annotations.providers.multipart.MultipartForm;

@Path("/products")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public class ProductResource {

    @Inject
    ProductService service;

    //
    // GET Methods
    //
    
    @GET
    public Response getAll() {
        return service.getAll();
    }

    @GET
    @Path("/{id}")
    public Response getById(@PathParam("id") Long id) {
        return service.getById(id);
    }

    @GET
    @Path("/home-appliances")
    public Response getHomeAppliances() {
        return service.getHomeApliances();
    }

    @GET
    @Path("/videogames")
    public Response getVideogames(@QueryParam("platf") String platform) {
        return service.getVideogames(platform);
    }

    @GET
    @Path("/computers")
    public Response getComputers() {
        return service.getComputers();
    }

    @GET
    @Path("/all-products")
    public Response getOtherProducts() {
        return service.getOtherProducts();
    }

    @GET
    @Path("/{id}/prices")
    public Response getPrices(
            @PathParam("id") long productId) {
        return service.getPrices(productId);
    }

    @GET
    @Path("/{id}/followers")
    public Response getFollowers(@PathParam("id") long productId) {
        return service.getFollowers(productId);
    }


    @GET
    @Path("/brand/{brand}")
    public Response getByBrand(@PathParam("brand") String brand) {
        return service.getByBrand(brand);
    }

    @GET
    @Path("/name/{name}")
    public Response getByName(@PathParam("name") String name) {
        return service.getByName(name);
    }

    //
    // POST Methods
    //
    @POST
    @Transactional
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    public Response create(@MultipartForm ProductForm productForm) {
        return service.create(productForm);
    }

    
    @POST
    @Path("/home-appliances")
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @Transactional
    public Response createHomeAppliance(@MultipartForm HomeAppliancesForm productForm) {
        return service.createHomeAppliance(productForm);
    }
   
    @POST
    @Path("/computers")
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @Transactional
    public Response createComputer(@MultipartForm ComputerForm product) {
        return service.createComputer(product);
    }
    
    @POST
    @Path("/videogames")
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @Transactional
    public Response createVideoGame(@MultipartForm VideogameForm productForm) {
        return service.createVideoGame(productForm);
    }
    
    @POST
    @Path("/{product-id}/followers/{follower-id}")
    @Transactional
    public Response addAFollower(
            @PathParam("product-id") Long productId,
            @PathParam("follower-id") Long followerId) {
        return service.addAFollower(productId, followerId);
    }

    //
    //  PUT
    //
    @PUT
    @Path("/{id}")
    @Transactional
    public Response update(
            @PathParam("id") Long productId,
            Product product) {
        return service.update(productId, product);
    }

    //
    // DELETE Methods
    //
    @DELETE
    @Path("{id}")
    @Transactional
    public Response delete(@PathParam("id") Long id) {
        return service.delete(id);
    }


    @DELETE
    @Path("/{product-id}/followers/{follower-id}")
    @Transactional
    public Response removeAFollower(
            @PathParam("product-id") Long productId,
            @PathParam("follower-id") Long followerId) {
        return service.removeFollower(productId, followerId);
    }
}
