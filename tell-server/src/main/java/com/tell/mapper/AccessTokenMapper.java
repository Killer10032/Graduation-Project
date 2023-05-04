package com.tell.mapper;

import com.tell.model.AccessToken;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

// token的实体类映射

@Mapper
public interface AccessTokenMapper {

    AccessToken selectByUserId(@Param("userId") Integer UserId);

    int insert(AccessToken accessToken);
}
