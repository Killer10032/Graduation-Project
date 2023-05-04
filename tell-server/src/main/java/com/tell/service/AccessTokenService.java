package com.tell.service;

import com.tell.model.AccessToken;



public interface AccessTokenService {

    AccessToken getByUserId(Integer userId);

    void save(AccessToken accessToken);

    AccessToken create(String token,Integer userId);
}
