
package com.fctuc.productsapp.forms;

import com.fctuc.productsapp.model.producttypes.Computer;
import com.fctuc.productsapp.model.producttypes.Videogame;
import java.text.DecimalFormat;
import javax.ws.rs.FormParam;

public class ComputerForm extends ProductForm {
    
    @FormParam("cpu")
    public String cpu;
    
    @FormParam("memory")
    public String memory;
    
    @FormParam("storage")
    public String storage;
    
    @FormParam("screen-resolution")
    public String screenResolution;
    
    @FormParam("screen-size")
    public String screenSize;
    
    @FormParam("os")
    public String Os;

    public String getCpu() {
        return cpu;
    }

    public void setCpu(String cpu) {
        this.cpu = cpu;
    }

    public String getMemory() {
        return memory;
    }

    public void setMemory(String memory) {
        this.memory = memory;
    }

    public String getStorage() {
        return storage;
    }

    public void setStorage(String storage) {
        this.storage = storage;
    }

    public String getScreenResolution() {
        return screenResolution;
    }

    public void setScreenResolution(String screenResolution) {
        this.screenResolution = screenResolution;
    }

    public String getScreenSize() {
        return screenSize;
    }

    public void setScreenSize(String screenSize) {
        this.screenSize = screenSize;
    }

    public String getOs() {
        return Os;
    }

    public void setOs(String Os) {
        this.Os = Os;
    }

    public Computer toComputer(String imagePath) throws Exception {
        
        if (!isValid() || imagePath == null) {
            throw new Exception("ComputerForm is not valid");
        }

        // columns common with product
        Computer pc = new Computer();
        pc.brand = this.brand;
        pc.description = this.description;
        pc.name = this.name;
        pc.picture = imagePath;
        
        // new pc columns
        pc.cpu = this.cpu;
        pc.memory = this.memory;
        pc.storage = this.storage;
        pc.screenResolution = this.screenResolution;
        pc.screenSize = this.screenSize;
        pc.Os = this.Os;

        return pc;
    }
    
    @Override
    public boolean isValid() {
        
        if (!super.isValid()) {
            return false;
        }
        
        return  cpu != null 
                && memory != null 
                && storage != null 
                && screenResolution != null 
                && screenSize != null 
                && Os != null;
    }
    
}
