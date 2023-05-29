/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.fctuc.productsapp.resource;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import javax.inject.Inject;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import org.eclipse.microprofile.config.inject.ConfigProperty;

@Path("/images/{file}")
@Consumes(MediaType.APPLICATION_JSON)
@Produces({"application/octet-stream", "image/png", "image/jpeg"})
public class ImageResource {    
    
    @Inject
    @ConfigProperty(name = "pictures.upload.directory")
    String PATH;

    @GET
    public Response getFile(@PathParam("file") String image) throws IOException {

        System.out.println(image);

        String filePath = PATH + "/" + image; // base directory + some_image.png
        System.out.println(filePath);

        File file = new File(filePath);
        if (!file.exists()) {
            return Response
                    .status(Response.Status.NOT_FOUND)
                    .entity("File not found")
                    .build();
        }

        InputStream inputStream = new FileInputStream(file);
        return Response.ok(inputStream)
                .header("Content-Disposition", "inline; filename=\"" + image + "\"")
                .header("Content-Type", "image/jpeg")
                .build();
    }
}