package com.tell.mapper;

import com.tell.model.User;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

//user实体类的映射

@Mapper
public interface UserMapper {

    /**
     * 根据用户昵称查询用户
     * @param name
     * @return
     */
    User findUserByName(@Param("name") String name);

    /**
     * 查询发表文章数量最多的用户
     * @param pageNo
     * @param pageSize
     * @return
     */
    List<User> findUserByArticleCountDesc(@Param("pageNo") Integer pageNo, @Param("pageSize") Integer pageSize);

    int insert(User user);
}
