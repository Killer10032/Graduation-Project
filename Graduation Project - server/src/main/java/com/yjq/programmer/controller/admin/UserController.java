package com.yjq.programmer.controller.admin;

import com.yjq.programmer.dto.PageDTO;
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
 * @create 2023-02-15 14:42
 */
@RestController("AdminUserController")
@RequestMapping("/admin/user")
public class UserController {

    @Resource
    private IUserService userService;

    /**
     * 用户登录操作
     * @param userDTO
     * @return
     */
    @PostMapping("/login")
    public ResponseDTO<UserDTO> loginUser(@RequestBody UserDTO userDTO){
        return userService.adminLogin(userDTO);
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
     * 分页获取用户数据
     * @param pageDTO
     * @return
     */
    @PostMapping("/list")
    public ResponseDTO<PageDTO<UserDTO>> getUserList(@RequestBody PageDTO<UserDTO> pageDTO){
        return userService.getUserList(pageDTO);
    }

    /**
     * 删除用户信息
     * @param userDTO
     * @return
     */
    @PostMapping("/delete")
    public ResponseDTO<Boolean> deleteUser(@RequestBody UserDTO userDTO){
        return userService.deleteUser(userDTO);
    }

    /**
     * 保存用户信息
     * @param userDTO
     * @return
     */
    @PostMapping("/save")
    public ResponseDTO<Boolean> saveUser(@RequestBody UserDTO userDTO){
        return userService.saveUser(userDTO);
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
     * 获取用户总数
     * @return
     */
    @PostMapping("/total")
    public ResponseDTO<Integer> getUserTotal(){
        return userService.getUserTotal();
    }

}
