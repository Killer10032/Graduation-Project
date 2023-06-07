package com.yjq.programmer.service;

import com.yjq.programmer.dto.PageDTO;
import com.yjq.programmer.dto.ResponseDTO;
import com.yjq.programmer.dto.UserDTO;

/**
 * @author 杨杨吖
 * @QQ 823208782
 * @WX yjqi12345678
 * @create 2023-02-12 21:33
 */
public interface IUserService {

    // 注册用户信息
    ResponseDTO<Boolean> registerUser(UserDTO userDTO);

    // 前台用户登录操作
    ResponseDTO<UserDTO> webLogin(UserDTO userDTO);

    // 后台用户登录操作
    ResponseDTO<UserDTO> adminLogin(UserDTO userDTO);

    // 检查用户是否登录
    ResponseDTO<UserDTO> checkLogin(UserDTO userDTO);

    // 退出登录操作
    ResponseDTO<Boolean> logout(UserDTO userDTO);

    // 分页获取用户数据
    ResponseDTO<PageDTO<UserDTO>> getUserList(PageDTO<UserDTO> pageDTO);

    // 保存用户信息
    ResponseDTO<Boolean> saveUser(UserDTO userDTO);

    // 删除用户信息
    ResponseDTO<Boolean> deleteUser(UserDTO userDTO);

    // 根据id获取用户信息
    ResponseDTO<UserDTO> getUserById(UserDTO userDTO);

    // 修改个人信息
    ResponseDTO<UserDTO> updateUserInfo(UserDTO userDTO);

    // 获取用户总数
    ResponseDTO<Integer> getUserTotal();

}
