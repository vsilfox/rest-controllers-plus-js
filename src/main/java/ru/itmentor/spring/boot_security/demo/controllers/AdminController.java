package ru.itmentor.spring.boot_security.demo.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import ru.itmentor.spring.boot_security.demo.models.Role;
import ru.itmentor.spring.boot_security.demo.models.User;
import ru.itmentor.spring.boot_security.demo.repositories.RoleRepository;
import ru.itmentor.spring.boot_security.demo.security.UserDetailsImpl;
import ru.itmentor.spring.boot_security.demo.services.UserService;

import java.util.Set;


@Controller
@RequestMapping("/admin")
public class AdminController {

    private final UserService userService;
    private final RoleRepository roleRepository;


    @Autowired
    public AdminController(UserService userService, RoleRepository roleRepository) {
        this.userService = userService;
        this.roleRepository = roleRepository;
    }


    @GetMapping()
    public String showAllUsers(@ModelAttribute("user") User user, Model model) {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        model.addAttribute("authenticatedUser", userDetails.getUser());
        model.addAttribute("users", userService.getUsers());
        model.addAttribute("roles", roleRepository.findAll());
        return "admin";
    }


    @PostMapping("/create")
    public String createUser(@ModelAttribute("user") User user, @RequestParam("form-selected-roles") Set<Role> selectedRoles) {
        user.setRoles(selectedRoles);
        userService.saveUser(user);
        return "redirect:/admin";
    }


    @PatchMapping("edit/{id}")
    public String editUser(@ModelAttribute("user") User user, @PathVariable("id") Long id,
                             @RequestParam("form-selected-roles") Set<Role> selectedRoles) {
        user.setRoles(selectedRoles);
        userService.updateUser(id, user);
        return "redirect:/admin";
    }


    @DeleteMapping("delete/{id}")
    public String deleteUser(@PathVariable("id") Long id) {
        userService.deleteUser(id);
        return "redirect:/admin";
    }
}
