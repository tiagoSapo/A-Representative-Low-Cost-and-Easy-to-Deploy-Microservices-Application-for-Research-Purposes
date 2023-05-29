
package com.fctuc.productsapp.forms;

import com.fctuc.productsapp.model.Product;
import com.fctuc.productsapp.model.producttypes.Videogame;
import javax.ws.rs.FormParam;


public class VideogameForm extends ProductForm {
    
    @FormParam("platform")
    private String platform;
    
    @FormParam("release-date")
    private String releaseDate;

    public String getPlatform() {
        return platform;
    }

    public void setPlatform(String platform) {
        this.platform = platform;
    }

    public String getReleaseDate() {
        return releaseDate;
    }

    public void setReleaseDate(String releaseDate) {
        this.releaseDate = releaseDate;
    }
    
    public Videogame toVideoGame(String imagePath) throws Exception {

        if (!isValid() || imagePath == null) {
            throw new Exception("VideoGameForm is not valid");
        }

        // columns common with product
        Videogame videogame = new Videogame();
        videogame.brand = this.brand;
        videogame.description = this.description;
        videogame.name = this.name;
        videogame.picture = imagePath;
        
        // new videogame columns
        videogame.platform = this.platform;
        videogame.releaseDate = this.releaseDate;

        return videogame;
    }

    @Override
    public boolean isValid() {
        if (!super.isValid())
            return false;
        return platform != null && releaseDate != null;
    }

}
