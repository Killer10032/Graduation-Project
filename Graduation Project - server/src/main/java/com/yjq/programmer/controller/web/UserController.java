package com.yjq.programmer.controller.web;

import com.yjq.programmer.dto.ResponseDTO;
import com.yjq.programmer.dto.UserDTO;
import com.yjq.programmer.service.IUserService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;

/**
 * @author 杨杨吖
 * @QQ 823208782
 * @WX yjqi12345678
 * @create 2023-02-12 21:35
 */
@RestController("WebUserController")
@RequestMapping("/web/user")
public class UserController {

    @Resource
    private IUserService userService;

    /**
     * 注册用户信息
     * @param userDTO
     * @return
     */
    @PostMapping("/register")
    public ResponseDTO<Boolean> registerUser(@RequestBody UserDTO userDTO){
        return userService.registerUser(userDTO);
    }

    /**
     * 检查用户是否登录
     * @param userDTO
     * @return
     */
    @PostMapping("/check_login")
    public ResponseDTO<UserDTO> checkLogin(@RequestBody UserDTO userDTO){
        return userService.checkLogin(userDTO);
    }


    /**
     * 用户登录操作
     * @param userDTO
     * @return
     */
    @PostMapping("/login")
    public ResponseDTO<UserDTO> loginUser(@RequestBody UserDTO userDTO){
        return userService.webLogin(userDTO);
    }

    /**
     * 退出登录操作
     * @param userDTO
     * @return
     */
    @PostMapping("/logout")
    public ResponseDTO<Boolean> logout(@RequestBody UserDTO userDTO){
        return userService.logout(userDTO);
    }

    /**
     * 根据id获取用户信息
     * @param userDTO
     * @return
     */
    @PostMapping("/get")
    public ResponseDTO<UserDTO> getUserById(@RequestBody UserDTO userDTO){
        return userService.getUserById(userDTO);
    }

    /**
     * 修改个人信息
     * @param userDTO
     * @return
     */
    @PostMapping("/update")
    public ResponseDTO<UserDTO> updateUserInfo(@RequestBody UserDTO userDTO){
        return userService.updateUserInfo(userDTO);
    }

}
