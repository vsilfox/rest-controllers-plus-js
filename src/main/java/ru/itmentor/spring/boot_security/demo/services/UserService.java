package ru.itmentor.spring.boot_security.demo.services;


import ru.itmentor.spring.boot_security.demo.models.User;

import java.util.List;

public interface UserService {

    void saveUser(User user);

    List<User> getUsers();

    void updateUser(Long id, User user);

    void deleteUser(Long id);

    User showUser(Long id);

}
