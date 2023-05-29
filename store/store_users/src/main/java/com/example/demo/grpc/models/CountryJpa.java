
package com.example.demo.grpc.models;

import java.io.Serializable;
import java.util.List;
import javax.persistence.*;

@Entity
@Table(name = "countries")
public class CountryJpa implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "name", unique = true)
    private String name;

    @OneToMany(mappedBy = "country")
    private List<UserJpa> users;
    
    // getters and setters omitted for brevity

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<UserJpa> getUsers() {
        return users;
    }

    public void setUsers(List<UserJpa> users) {
        this.users = users;
    }
    
}


