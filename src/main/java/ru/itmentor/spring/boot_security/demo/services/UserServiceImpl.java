package ru.itmentor.spring.boot_security.demo.services;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.itmentor.spring.boot_security.demo.models.User;
import ru.itmentor.spring.boot_security.demo.repositories.UserRepository;

import java.util.List;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    @Autowired
    public UserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }


    @Transactional
    @Override
    public void saveUser(User user) {
        userRepository.save(user);
    }


    @Transactional(readOnly = true)
    @Override
    public List<User> getUsers() {
        return userRepository.findAll();
    }


    @Transactional
    @Override
    public void updateUser(Long id, User user) {
        user.setId(id);
        userRepository.save(user);
    }


    @Transactional
    @Override
    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }


    @Transactional(readOnly = true)
    @Override
    public User showUser(Long id) {
        return userRepository.findById(id).orElse(null);
    }
}
