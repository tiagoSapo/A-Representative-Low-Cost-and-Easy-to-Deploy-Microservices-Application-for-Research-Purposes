
package com.fctuc.productsapp.forms;

import com.fctuc.productsapp.model.producttypes.HomeAppliance;
import javax.ws.rs.FormParam;

public class HomeAppliancesForm extends ProductForm {
    
    @FormParam("dimension")
    private String dimension;
    
    @FormParam("color")
    private String color;

    public String getDimension() {
        return dimension;
    }

    public void setDimension(String dimension) {
        this.dimension = dimension;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }
    
    @Override
    public boolean isValid() {
        if (!super.isValid())
            return false;
        return dimension != null && color != null;
    }

    public HomeAppliance toHomeAppliance(String imagePath) throws Exception {
        if (!isValid() || imagePath == null) {
            throw new Exception("HomeApplianceForm is not valid");
        }

        // columns common with product
        HomeAppliance home = new HomeAppliance();
        home.brand = this.brand;
        home.description = this.description;
        home.name = this.name;
        home.picture = imagePath;
        
        // new pc columns
        home.colour = this.color;
        home.dimension = this.dimension;

        return home;
    }
    
}
