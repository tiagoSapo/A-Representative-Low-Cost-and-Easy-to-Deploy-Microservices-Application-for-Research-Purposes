
package com.fctuc.productsapp.forms;

import java.io.Serializable;
import javax.ws.rs.FormParam;

public class ImageRequestForm implements Serializable {
    
    @FormParam("file-name")
    public String path;

    public String getPath() {
        return path;
    }

    public void setPath(String path) {
        this.path = path;
    }
}
