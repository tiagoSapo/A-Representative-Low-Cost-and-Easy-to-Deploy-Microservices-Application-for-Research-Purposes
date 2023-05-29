package com.fctuc.productsapp.resource;

import com.fctuc.productsapp.services.FollowersService;
import com.fctuc.productsapp.services.OpinionService;

import javax.inject.Inject;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

@Path("/followers/")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public class FollowersResource {

    @Inject
    FollowersService service;


    @GET
    @Path("/{id}")
    public Response getFollowerProducts(@PathParam("id") Long followerId) {
        return service.getFollowerProducts(followerId);
    }
}
