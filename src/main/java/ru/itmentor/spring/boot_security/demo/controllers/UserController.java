package ru.itmentor.spring.boot_security.demo.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import ru.itmentor.spring.boot_security.demo.models.Role;
import ru.itmentor.spring.boot_security.demo.models.User;
import ru.itmentor.spring.boot_security.demo.security.UserDetailsImpl;
import ru.itmentor.spring.boot_security.demo.services.RoleService;
import ru.itmentor.spring.boot_security.demo.services.UserService;

import java.util.List;


@RestController
@RequestMapping("/api")
public class UserController {

    private final UserService userService;
    private final RoleService roleService;


    @Autowired
    public UserController(UserService userService, RoleService roleService) {
        this.userService = userService;
        this.roleService = roleService;
    }

    @GetMapping("/authenticated")
    public User getAuthenticatedUser(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        return userDetails.getUser();
    }

    @GetMapping("/users")
    public List<User> getUsers() {
        return userService.getUsers();
    }

    @GetMapping("/roles")
    public List<Role> getRoles() {
        return roleService.getRoles();
    }

    @GetMapping("/users/{id}")
    public User getUser(@PathVariable Long id) {
        return userService.showUser(id);
    }

    @PostMapping("/users/create")
    public User createUser(@RequestBody User user) {
        userService.saveUser(user);
        return user;
    }

    @PutMapping("/users/edit/{id}")
    public User editUser(@RequestBody User user, @PathVariable Long id) {
        userService.updateUser(id, user);
        return userService.showUser(id);
    }

    @DeleteMapping("/users/delete/{id}")
    public void deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
    }
}
