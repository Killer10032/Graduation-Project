package com.tell.mapper;

import com.tell.model.AccessToken;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;


@Mapper
public interface AccessTokenMapper {

    AccessToken selectByUserId(@Param("userId") Integer UserId);

    int insert(AccessToken accessToken);
}
