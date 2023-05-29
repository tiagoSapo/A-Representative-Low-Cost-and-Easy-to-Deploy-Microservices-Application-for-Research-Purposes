package com.fctuc.productsapp.services;

import com.fctuc.productsapp.model.intertables.ProductCustomer;

import javax.inject.Singleton;
import javax.ws.rs.core.Response;
import java.util.List;

@Singleton
public class FollowersService {
    public Response getFollowerProducts(Long follower) {

        try {
            List<ProductCustomer> followerAndProducts = ProductCustomer.findByFollower(follower);
            return Response.ok(followerAndProducts).build();
        } catch (Exception ex) {
            return Response
                    .status(Response.Status.BAD_REQUEST)
                    .entity("{\"error\": \"There was problem getting the products of follower\"}")
                    .build();
        }
    }
}
